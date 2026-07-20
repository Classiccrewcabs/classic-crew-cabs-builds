"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import heicConvert from "heic-convert";
import { createClient } from "@/lib/supabase/server";
import { makeBuildSlug } from "@/lib/slug";
import type { BuildStatus } from "@/lib/types";

function isHeic(file: File) {
  return (
    /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
  );
}

function readBuildFields(formData: FormData) {
  return {
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
    interior: (String(formData.get("interior") ?? "").trim() || null) as
      | string
      | null,
    description: (String(formData.get("description") ?? "").trim() ||
      null) as string | null,
    status: String(formData.get("status") ?? "available") as BuildStatus,
  };
}

async function uploadPhotos(
  buildId: string,
  files: File[],
  startingSortOrder: number
) {
  const supabase = await createClient();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;

    let body: File | Buffer = file;
    let contentType = file.type || "image/jpeg";
    let safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    if (isHeic(file)) {
      const inputBuffer = Buffer.from(await file.arrayBuffer());
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.9,
      });
      body = Buffer.from(outputBuffer);
      contentType = "image/jpeg";
      safeName = safeName.replace(/\.hei[cf]$/i, "") + ".jpg";
    }

    const path = `${buildId}/${Date.now()}-${i}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("build-photos")
      .upload(path, body, { contentType });

    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("build_images").insert({
      build_id: buildId,
      storage_path: path,
      sort_order: startingSortOrder + i,
    });

    if (insertError) throw insertError;
  }
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

  const photos = formData.getAll("photos") as File[];
  await uploadPhotos(build.id, photos, 0);

  revalidatePath("/");
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

  const { count } = await supabase
    .from("build_images")
    .select("id", { count: "exact", head: true })
    .eq("build_id", buildId);

  const photos = formData.getAll("photos") as File[];
  await uploadPhotos(buildId, photos, count ?? 0);

  revalidatePath("/");
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

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
