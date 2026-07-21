"use client";

import { useState } from "react";
import Image from "next/image";
import { buildImageUrl } from "@/lib/image-url";
import type { BuildImage } from "@/lib/types";

export function ImageCarousel({
  images,
  alt,
}: {
  images: BuildImage[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-navy/5 text-navy/40 text-sm uppercase tracking-wide">
        No photos yet
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-[16/10] bg-white">
        <Image
          src={buildImageUrl(images[index].storage_path)}
          alt={`${alt} - photo ${index + 1}`}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 900px, 100vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-navy/80 text-cream text-xl hover:bg-navy transition-colors"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-navy/80 text-cream text-xl hover:bg-navy transition-colors"
            >
              &rarr;
            </button>
            <span className="absolute bottom-2 right-2 bg-navy/80 text-cream text-xs px-2 py-1">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`relative h-16 w-20 flex-shrink-0 bg-white border-2 transition-colors ${
                i === index ? "border-red" : "border-transparent"
              }`}
            >
              <Image
                src={buildImageUrl(image.storage_path)}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
