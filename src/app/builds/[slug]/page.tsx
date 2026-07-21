import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuildBySlug, buildImageUrl } from "@/lib/builds";
import { getDisplayTitle, getVehicleLine } from "@/lib/build-helpers";

export const revalidate = 0;

export default async function BuildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) notFound();

  const backHref =
    build.category === "for_sale" ? "/for-sale" : "/past-builds";
  const backLabel =
    build.category === "for_sale" ? "All For Sale" : "All Past Builds";

  const specValues = [
    build.engine,
    build.transmission,
    build.axles,
    build.brakes,
    build.interior,
    build.creature_comforts,
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href={backHref}
        className="text-sm font-semibold uppercase tracking-wide text-navy/70 hover:text-navy"
      >
        &larr; {backLabel}
      </Link>

      <div className="mt-6 max-w-4xl">
        <p className="text-red text-sm font-semibold uppercase tracking-wide">
          {getVehicleLine(build)}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-navy">
            {getDisplayTitle(build)}
          </h1>
          {build.status !== "available" && (
            <span className="bg-navy text-cream text-xs font-semibold uppercase tracking-wide px-3 py-1.5">
              {build.status}
            </span>
          )}
          {build.price && (
            <span className="bg-red text-cream text-sm font-bold px-3 py-1.5">
              {build.price}
            </span>
          )}
        </div>
        {build.exterior_color && (
          <p className="text-navy/60 uppercase tracking-wide text-sm mt-2">
            {build.exterior_color}
          </p>
        )}
      </div>

      {build.description && (
        <p className="mt-8 max-w-3xl text-navy/80 leading-relaxed whitespace-pre-line">
          {build.description}
        </p>
      )}

      {specValues.length > 0 && (
        <ul className="mt-8 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 border-y border-navy/10 py-6">
          {specValues.map((value, i) => (
            <li
              key={i}
              className="text-navy before:content-['—'] before:text-red before:mr-2"
            >
              {value}
            </li>
          ))}
        </ul>
      )}

      {build.build_images.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {build.build_images.map((image, i) => (
            <div key={image.id} className="relative aspect-[4/3] bg-white">
              <Image
                src={buildImageUrl(image.storage_path)}
                alt={`${getDisplayTitle(build)} - photo ${i + 1}`}
                fill
                className="object-contain"
                sizes="(min-width: 640px) 50vw, 100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-navy/50 uppercase text-sm tracking-wide">
          No photos yet
        </p>
      )}
    </div>
  );
}
