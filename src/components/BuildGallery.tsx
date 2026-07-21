"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { buildImageUrl } from "@/lib/image-url";
import type { BuildImage, PhotoCategory } from "@/lib/types";

const TABS: { key: PhotoCategory; label: string }[] = [
  { key: "exterior", label: "Exterior" },
  { key: "interior", label: "Interior" },
  { key: "detail", label: "Mechanical" },
];

export function BuildGallery({
  images,
  coverImageId,
  alt,
}: {
  images: BuildImage[];
  coverImageId: string | null;
  alt: string;
}) {
  const grouped = useMemo(() => {
    const map: Record<PhotoCategory, BuildImage[]> = {
      exterior: [],
      interior: [],
      detail: [],
    };
    for (const image of images) {
      map[image.photo_category].push(image);
    }
    return map;
  }, [images]);

  const coverImage = images.find((img) => img.id === coverImageId);
  const availableTabs = TABS.filter((tab) => grouped[tab.key].length > 0);

  const [activeTab, setActiveTab] = useState<PhotoCategory>(
    coverImage?.photo_category ?? availableTabs[0]?.key ?? "exterior"
  );
  const [index, setIndex] = useState(() => {
    const list = grouped[activeTab];
    const coverIdx = list.findIndex((img) => img.id === coverImageId);
    return coverIdx >= 0 ? coverIdx : 0;
  });

  const activeImages = grouped[activeTab];
  const goTo = (i: number) =>
    setIndex((i + activeImages.length) % activeImages.length);

  function selectTab(tab: PhotoCategory) {
    setActiveTab(tab);
    setIndex(0);
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-navy/5 text-navy/40 text-sm uppercase tracking-wide">
        No photos yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] bg-black">
        {activeImages[index] && (
          <Image
            src={buildImageUrl(activeImages[index].storage_path)}
            alt={`${alt} - ${activeTab} photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 900px, 100vw"
            priority
          />
        )}

        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-cream/90 text-navy text-xl hover:bg-cream transition-colors"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-cream/90 text-navy text-xl hover:bg-cream transition-colors"
            >
              &rarr;
            </button>
            <span className="absolute bottom-2 right-2 bg-navy/80 text-cream text-xs px-2 py-1">
              {index + 1} / {activeImages.length}
            </span>
          </>
        )}
      </div>

      {availableTabs.length > 1 && (
        <div className="flex items-center justify-center gap-6 bg-navy py-3">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectTab(tab.key)}
              className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === tab.key
                  ? "text-red"
                  : "text-cream/60 hover:text-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {activeImages.map((image, i) => (
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
