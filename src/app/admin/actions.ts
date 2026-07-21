"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { makeBuildSlug } from "@/lib/slug";
import type { BuildCategory, PhotoCategory } from "@/lib/types";

const MAX_DIMENSION = 2400;
const PHOTO_CATEGORIES: PhotoCategory[] = ["exterior", "interior", "detail"];

async function processImage(file: File): Promise<Buffer> {
  const source = Buffer.from(await file.arrayBuffer());

  return sharp(source)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

function readBuildFields(formData: FormData) {
  return {
    category: String(
      formData.get("category") ?? "past_build"
    ) as BuildCategory,
    title: (String(formData.get("title") ?? "").trim() || null) as
      | string
      | null,
    year: Number(formData.get("year")),
    make: String(formData.get("make") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    package: (String(formData.get("package") ?? "").trim() || null) as
      | string
      | null,
    exterior_color: (String(formData.get("exterior_color") ?? "").trim() ||
      null) as string | null,
    engine: (String(formData.get("engine") ?? "").trim() || null) as
      | string
      | null,
    transmission: (String(formData.get("transmission") ?? "").trim() ||
      null) as string | null,
    axles: (String(formData.get("axles") ?? "").trim() || null) as
      | string
      | null,
    brakes: (String(formData.get("brakes") ?? "").trim() || null) as
      | string
      | null,
    interior: (String(formData.get("interior") ?? "").trim() || null) as
      | string
      | null,
    creature_comforts: (String(
      formData.get("creature_comforts") ?? ""
    ).trim() || null) as string | null,
    description: (String(formData.get("description") ?? "").trim() ||
      null) as string | null,
    price: (String(formData.get("price") ?? "").trim() || null) as
      | string
      | null,
  };
}

async function uploadPhotos(
  buildId: string,
  files: File[],
  startingSortOrder: number,
  photoCategory: PhotoCategory
) {
  const supabase = await createClient();
  const inserted: { id: string; sort_order: number }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;

    const body = await processImage(file);
    const safeName =
      file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").replace(/\.\w+$/, "") +
      ".jpg";
    const path = `${buildId}/${Date.now()}-${i}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("build-photos")
      .upload(path, body, { contentType: "image/jpeg" });

    if (uploadError) throw uploadError;

    const { data: image, error: insertError } = await supabase
      .from("build_images")
      .insert({
        build_id: buildId,
        storage_path: path,
        sort_order: startingSortOrder + i,
        photo_category: photoCategory,
      })
      .select("id, sort_order")
      .single();

    if (insertError) throw insertError;
    inserted.push(image);
  }

  return inserted;
}

async function uploadAllCategories(
  buildId: string,
  formData: FormData,
  startingSortOrder: number
) {
  let sortOrder = startingSortOrder;
  const inserted: { id: string; sort_order: number }[] = [];

  for (const category of PHOTO_CATEGORIES) {
    const files = formData.getAll(`photos_${category}`) as File[];
    const result = await uploadPhotos(buildId, files, sortOrder, category);
    sortOrder += result.length;
    inserted.push(...result);
  }

  return inserted;
}

export async function createBuild(formData: FormData) {
  const supabase = await createClient();
  const fields = readBuildFields(formData);
  const slug = makeBuildSlug(fields.year, fields.make, fields.model);

  const { data: build, error } = await supabase
    .from("builds")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error) throw error;

  const inserted = await uploadAllCategories(build.id, formData, 0);

  const firstImage = inserted.find((img) => img.sort_order === 0);
  if (firstImage) {
    await supabase
      .from("builds")
      .update({ cover_image_id: firstImage.id })
      .eq("id", build.id);
  }

  revalidatePath("/for-sale");
  revalidatePath("/past-builds");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateBuild(buildId: string, formData: FormData) {
  const supabase = await createClient();
  const fields = readBuildFields(formData);

  const { error } = await supabase
    .from("builds")
    .update(fields)
    .eq("id", buildId);

  if (error) throw error;

  const imageIdsToDelete = formData.getAll("delete_image") as string[];
  if (imageIdsToDelete.length > 0) {
    const { data: images } = await supabase
      .from("build_images")
      .select("id, storage_path")
      .in("id", imageIdsToDelete);

    if (images && images.length > 0) {
      await supabase.storage
        .from("build-photos")
        .remove(images.map((img) => img.storage_path));
      await supabase
        .from("build_images")
        .delete()
        .in(
          "id",
          images.map((img) => img.id)
        );
    }
  }

  const selectedCoverId = formData.get("cover_image_id");
  if (
    selectedCoverId &&
    !imageIdsToDelete.includes(String(selectedCoverId))
  ) {
    await supabase
      .from("builds")
      .update({ cover_image_id: String(selectedCoverId) })
      .eq("id", buildId);
  }

  const { count } = await supabase
    .from("build_images")
    .select("id", { count: "exact", head: true })
    .eq("build_id", buildId);

  const inserted = await uploadAllCategories(buildId, formData, count ?? 0);

  if (!selectedCoverId && (count ?? 0) === 0 && inserted.length > 0) {
    await supabase
      .from("builds")
      .update({ cover_image_id: inserted[0].id })
      .eq("id", buildId);
  }

  revalidatePath("/for-sale");
  revalidatePath("/past-builds");
  revalidatePath(`/builds/${formData.get("slug")}`);
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteBuild(formData: FormData) {
  const supabase = await createClient();
  const buildId = String(formData.get("build_id"));

  const { data: images } = await supabase
    .from("build_images")
    .select("storage_path")
    .eq("build_id", buildId);

  if (images && images.length > 0) {
    await supabase.storage
      .from("build-photos")
      .remove(images.map((img) => img.storage_path));
  }

  const { error } = await supabase.from("builds").delete().eq("id", buildId);
  if (error) throw error;

  revalidatePath("/for-sale");
  revalidatePath("/past-builds");
  revalidatePath("/admin");
}

export async function moveBuild(formData: FormData) {
  const supabase = await createClient();
  const buildId = String(formData.get("build_id"));
  const direction = String(formData.get("direction"));

  const { data: target } = await supabase
    .from("builds")
    .select("id, category")
    .eq("id", buildId)
    .single();

  if (!target) return;

  const { data: siblings } = await supabase
    .from("builds")
    .select("id")
    .eq("category", target.category)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!siblings) return;

  const ids = siblings.map((b) => b.id);
  const idx = ids.indexOf(buildId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;

  if (swapIdx < 0 || swapIdx >= ids.length) return;

  [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];

  await Promise.all(
    ids.map((id, i) =>
      supabase.from("builds").update({ sort_order: i }).eq("id", id)
    )
  );

  revalidatePath("/for-sale");
  revalidatePath("/past-builds");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
