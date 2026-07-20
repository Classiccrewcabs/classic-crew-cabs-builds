export type BuildStatus = "available" | "sold" | "featured";

export type Build = {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  package: string | null;
  exterior_color: string | null;
  engine: string | null;
  transmission: string | null;
  interior: string | null;
  description: string | null;
  status: BuildStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BuildImage = {
  id: string;
  build_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

export type BuildWithImages = Build & {
  build_images: BuildImage[];
};
