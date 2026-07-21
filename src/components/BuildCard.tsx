import Image from "next/image";
import Link from "next/link";
import { buildImageUrl } from "@/lib/builds";
import { getCoverImage, getDisplayTitle } from "@/lib/build-helpers";
import type { BuildWithImages } from "@/lib/types";

export function BuildCard({ build }: { build: BuildWithImages }) {
  const cover = getCoverImage(build);
  const vehicleLine = [build.year, build.make, build.model, build.package]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="border border-navy/10 bg-white">
      <div className="relative aspect-[16/9] bg-navy/5">
        {build.price && (
          <span className="absolute top-4 right-4 z-10 bg-red text-cream text-sm font-bold px-3 py-1.5">
            {build.price}
          </span>
        )}
        {cover ? (
          <Image
            src={buildImageUrl(cover.storage_path)}
            alt={getDisplayTitle(build)}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/30 text-sm uppercase">
            No photo yet
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-red text-sm font-semibold uppercase tracking-wide mb-1">
          {vehicleLine}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-navy">
          {build.title?.trim() || vehicleLine}
        </h2>

        <Link
          href={`/builds/${build.slug}`}
          className="inline-block mt-6 bg-navy text-cream font-semibold uppercase tracking-wide text-sm px-6 py-3 hover:bg-navy-light transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
