"use client";

import { createClient } from "@/lib/supabase/client";

// Same output settings the server used to apply with sharp.
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.82;

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Fallback for browsers without createImageBitmap options support.
    // <img> applies EXIF orientation automatically in modern browsers.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } catch {
      throw new Error(
        `Couldn't read "${file.name}". If it's an iPhone HEIC photo, export it as JPEG first.`
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** Shrink a photo in the browser so the long edge is at most 2400px, as JPEG. */
export async function resizeImage(file: File): Promise<Blob> {
  const source = await decode(file);
  const srcW = source.width;
  const srcH = source.height;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
  const width = Math.round(srcW * scale);
  const height = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process images.");

  ctx.fillStyle = "#ffffff"; // flatten transparent PNGs onto white
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  if ("close" in source) source.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
  );
  // Release the canvas memory right away (matters on phones).
  canvas.width = 0;
  canvas.height = 0;

  if (!blob) throw new Error(`Couldn't compress "${file.name}".`);
  return blob;
}

/**
 * Resize each photo and upload it straight to Supabase Storage from the
 * browser, one at a time. Returns the storage paths of the uploaded files.
 * The image bytes never pass through the Render server.
 */
export async function resizeAndUploadPhotos(
  folder: string,
  files: File[],
  onProgress?: (fileName: string) => void
): Promise<string[]> {
  const supabase = createClient();
  const paths: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;
    onProgress?.(file.name);

    const body = await resizeImage(file);
    const safeName =
      file.name.replace(/\.\w+$/, "").replace(/[^a-zA-Z0-9.\-_]/g, "_") +
      ".jpg";
    const path = `${folder}/${Date.now()}-${i}-${safeName}`;

    const { error } = await supabase.storage
      .from("build-photos")
      .upload(path, body, { contentType: "image/jpeg" });
    if (error) throw new Error(`Upload failed for "${file.name}": ${error.message}`);

    paths.push(path);
  }

  return paths;
}
