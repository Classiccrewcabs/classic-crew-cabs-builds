import type { BuildImage, BuildWithImages } from "@/lib/types";

export function getCoverImage(build: BuildWithImages): BuildImage | undefined {
  if (build.cover_image_id) {
    const match = build.build_images.find(
      (img) => img.id === build.cover_image_id
    );
    if (match) return match;
  }
  return build.build_images[0];
}

export function getDisplayTitle(build: BuildWithImages) {
  return build.title?.trim() || `${build.year} ${build.make} ${build.model}`;
}

export function getVehicleLine(build: BuildWithImages) {
  return [build.year, build.make, build.model, build.package]
    .filter(Boolean)
    .join(" ");
}
