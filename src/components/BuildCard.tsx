import Image from "next/image";
import Link from "next/link";
import { buildImageUrl } from "@/lib/builds";
import type { BuildWithImages } from "@/lib/types";

export function BuildCard({ build }: { build: BuildWithImages }) {
  const cover = build.build_images[0];

  return (
    <Link href={`/builds/${build.slug}`} className="group block">
      <div className="flex items-baseline gap-1 text-navy">
        <span className="text-lg font-semibold">{build.year}</span>
        <span className="text-red text-lg leading-none">/</span>
      </div>
      <h3 className="font-bold uppercase tracking-tight text-navy text-xl leading-snug">
        {build.make} {build.model}
      </h3>
      {build.package && (
        <p className="font-semibold uppercase text-sm text-navy mt-1">
          {build.package}
        </p>
      )}
      {build.exterior_color && (
        <p className="text-red text-xs uppercase tracking-wide">
          {build.exterior_color}
        </p>
      )}
      {build.category === "for_sale" && build.price && (
        <p className="font-bold text-navy mt-1">{build.price}</p>
      )}

      <div className="relative mt-4 aspect-[4/3] bg-white">
        {build.status !== "available" && (
          <span className="absolute top-3 left-3 z-10 bg-navy text-cream text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-1">
            {build.status}
          </span>
        )}
        {cover ? (
          <Image
            src={buildImageUrl(cover.storage_path)}
            alt={`${build.year} ${build.make} ${build.model}`}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-navy/30 text-sm uppercase">
            No photo yet
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-navy font-semibold uppercase text-sm">
        View Build
        <span className="transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </div>
      <div className="mt-3 h-[3px] bg-red" />
    </Link>
  );
}
