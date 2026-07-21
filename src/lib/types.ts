export type BuildCategory = "for_sale" | "past_build";
export type PhotoCategory = "exterior" | "interior" | "detail";

export type Build = {
  id: string;
  slug: string;
  category: BuildCategory;
  title: string | null;
  year: number;
  make: string;
  model: string;
  package: string | null;
  exterior_color: string | null;
  engine: string | null;
  transmission: string | null;
  interior: string | null;
  axles: string | null;
  brakes: string | null;
  creature_comforts: string | null;
  description: string | null;
  price: string | null;
  sort_order: number;
  cover_image_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BuildImage = {
  id: string;
  build_id: string;
  storage_path: string;
  sort_order: number;
  photo_category: PhotoCategory;
  created_at: string;
};

export type BuildWithImages = Build & {
  build_images: BuildImage[];
};
