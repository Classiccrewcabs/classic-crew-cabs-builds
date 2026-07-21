import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuildBySlug, buildImageUrl } from "@/lib/builds";

type SpecRow = { label: string; value: string | null };

export const revalidate = 0;

export default async function BuildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) notFound();

  const specs: SpecRow[] = [
    { label: "Package", value: build.package },
    { label: "Exterior Color", value: build.exterior_color },
    { label: "Engine", value: build.engine },
    { label: "Transmission", value: build.transmission },
    { label: "Interior", value: build.interior },
  ].filter((spec) => spec.value);

  const backHref = build.category === "for_sale" ? "/for-sale" : "/past-builds";
  const backLabel =
    build.category === "for_sale" ? "All For Sale" : "All Past Builds";

  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href={backHref}
        className="text-sm font-semibold uppercase tracking-wide text-navy/70 hover:text-navy"
      >
        &larr; {backLabel}
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <span className="text-2xl font-semibold text-navy">
          {build.year}
        </span>
        <span className="text-red text-2xl leading-none">/</span>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-navy">
          {build.make} {build.model}
        </h1>
        {build.status !== "available" && (
          <span className="bg-navy text-cream text-xs font-semibold uppercase tracking-wide px-2 py-1">
            {build.status}
          </span>
        )}
        {build.category === "for_sale" && build.price && (
          <span className="text-xl font-bold text-navy">{build.price}</span>
        )}
      </div>

      {specs.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 border-y border-navy/10 py-6">
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt className="text-xs uppercase tracking-wide text-navy/50">
                {spec.label}
              </dt>
              <dd className="font-semibold text-navy mt-1">{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {build.description && (
        <p className="mt-8 max-w-3xl text-navy/80 leading-relaxed whitespace-pre-line">
          {build.description}
        </p>
      )}

      {build.build_images.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {build.build_images.map((image, i) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] bg-white"
            >
              <Image
                src={buildImageUrl(image.storage_path)}
                alt={`${build.year} ${build.make} ${build.model} - photo ${
                  i + 1
                }`}
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
