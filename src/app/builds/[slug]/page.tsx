import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuildBySlug, buildImageUrl } from "@/lib/builds";
import { getCoverImage, getDisplayTitle, getVehicleLine } from "@/lib/build-helpers";
import { BuildGallery } from "@/components/BuildGallery";

export const revalidate = 0;

const CONTACT_URL = "https://classiccrewcabs.com/pages/contact";

type BuildPageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: BuildPageParams): Promise<Metadata> {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) return {};

  const title = getDisplayTitle(build);
  const vehicleLine = getVehicleLine(build);
  const description =
    build.description?.trim().slice(0, 160) ||
    [vehicleLine, build.exterior_color, build.engine]
      .filter(Boolean)
      .join(" — ");
  const cover = getCoverImage(build);

  return {
    title,
    description,
    alternates: { canonical: `/builds/${build.slug}` },
    openGraph: {
      title: `${title} | ${vehicleLine}`,
      description,
      images: cover ? [buildImageUrl(cover.storage_path)] : undefined,
    },
    twitter: {
      title,
      description,
      images: cover ? [buildImageUrl(cover.storage_path)] : undefined,
    },
  };
}

export default async function BuildPage({ params }: BuildPageParams) {
  const { slug } = await params;
  const build = await getBuildBySlug(slug);

  if (!build) notFound();

  const backHref =
    build.category === "for_sale" ? "/for-sale" : "/past-builds";
  const backLabel =
    build.category === "for_sale" ? "All For Sale" : "All Past Builds";

  const overview = [
    { label: "Color", value: build.exterior_color },
    { label: "Interior", value: build.interior },
    { label: "Engine", value: build.engine },
    { label: "Transmission", value: build.transmission },
    { label: "Axles", value: build.axles },
    { label: "Brakes", value: build.brakes },
    { label: "Creature Comforts", value: build.creature_comforts },
  ].filter((row) => row.value);

  return (
    <div className="px-6 py-10 sm:px-10 lg:px-16">
      <Link
        href={backHref}
        className="text-sm font-semibold uppercase tracking-wide text-navy/70 hover:text-navy"
      >
        &larr; {backLabel}
      </Link>

      <div className="mt-6 max-w-4xl mx-auto">
        <BuildGallery
          images={build.build_images}
          coverImageId={build.cover_image_id}
          alt={getDisplayTitle(build)}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-navy text-cream px-6 py-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{build.year}</span>
              <span className="text-red text-2xl leading-none">/</span>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
                {getDisplayTitle(build)}
              </h1>
            </div>
            {build.exterior_color && (
              <p className="text-cream/70 uppercase tracking-wide text-sm mt-1">
                {build.exterior_color}
              </p>
            )}
          </div>

          <a
            href={CONTACT_URL}
            className="bg-red text-cream font-semibold uppercase tracking-wide text-sm px-6 py-3 hover:bg-red-dark transition-colors self-start sm:self-auto"
          >
            Contact Us About a Build
          </a>

          {(build.status !== "available" || build.price) && (
            <div className="flex items-center gap-3 text-lg font-bold uppercase">
              {build.status !== "available" && <span>{build.status}</span>}
              {build.status !== "available" && build.price && (
                <span className="text-red">/</span>
              )}
              {build.price && <span>{build.price}</span>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white px-6 py-10 sm:px-8">
          {build.description && (
            <div>
              <h2 className="text-xl font-extrabold uppercase text-navy">
                Description <span className="text-red">/</span>
              </h2>
              <div className="h-[2px] bg-navy/10 mt-2 mb-4" />
              <p className="text-navy/80 leading-relaxed whitespace-pre-line">
                {build.description}
              </p>
            </div>
          )}

          {overview.length > 0 && (
            <div>
              <h2 className="text-xl font-extrabold uppercase text-navy">
                Vehicle Overview <span className="text-red">/</span>
              </h2>
              <div className="h-[2px] bg-navy/10 mt-2 mb-4" />
              <dl className="space-y-3">
                {overview.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-4 border-b border-navy/10 pb-2"
                  >
                    <dt className="text-navy/50 uppercase text-sm tracking-wide">
                      {row.label}
                    </dt>
                    <dd className="text-navy font-semibold text-right">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
