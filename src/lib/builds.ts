import { createClient } from "@/lib/supabase/server";
import type { BuildWithImages } from "@/lib/types";

export { buildImageUrl } from "@/lib/image-url";

export async function getBuilds(): Promise<BuildWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("builds")
    .select("*, build_images(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((build) => ({
    ...build,
    build_images: [...build.build_images].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }));
}

export async function getBuildBySlug(
  slug: string
): Promise<BuildWithImages | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("builds")
    .select("*, build_images(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    build_images: [...data.build_images].sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}
