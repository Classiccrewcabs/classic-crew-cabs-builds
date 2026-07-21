import Link from "next/link";
import Image from "next/image";
import { getBuilds, buildImageUrl } from "@/lib/builds";
import { getCoverImage, getDisplayTitle } from "@/lib/build-helpers";
import { DeleteBuildForm } from "@/components/DeleteBuildForm";
import { moveBuild } from "@/app/admin/actions";
import type { BuildWithImages } from "@/lib/types";

export const revalidate = 0;

function BuildSection({
  title,
  builds,
}: {
  title: string;
  builds: BuildWithImages[];
}) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-bold uppercase tracking-wide text-navy/50 mb-3">
        {title} ({builds.length})
      </h2>

      {builds.length === 0 ? (
        <p className="text-navy/40 text-sm uppercase tracking-wide py-4">
          No builds in this category yet.
        </p>
      ) : (
        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {builds.map((build, i) => {
            const cover = getCoverImage(build);
            return (
              <div key={build.id} className="flex items-center gap-4 py-4">
                <div className="flex flex-col">
                  <form action={moveBuild}>
                    <input type="hidden" name="build_id" value={build.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Move up"
                      className="text-navy/60 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed leading-none px-1"
                    >
                      &#9650;
                    </button>
                  </form>
                  <form action={moveBuild}>
                    <input type="hidden" name="build_id" value={build.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={i === builds.length - 1}
                      aria-label="Move down"
                      className="text-navy/60 hover:text-navy disabled:opacity-20 disabled:cursor-not-allowed leading-none px-1"
                    >
                      &#9660;
                    </button>
                  </form>
                </div>

                <div className="relative h-16 w-20 flex-shrink-0 bg-white border border-navy/10">
                  {cover ? (
                    <Image
                      src={buildImageUrl(cover.storage_path)}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy truncate">
                    {getDisplayTitle(build)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-navy/50">
                    {build.build_images.length} photo
                    {build.build_images.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  href={`/builds/${build.slug}`}
                  target="_blank"
                  className="text-xs font-semibold uppercase tracking-wide text-navy/60 hover:text-navy"
                >
                  View
                </Link>
                <Link
                  href={`/admin/builds/${build.id}/edit`}
                  className="text-xs font-semibold uppercase tracking-wide text-navy hover:text-red"
                >
                  Edit
                </Link>
                <DeleteBuildForm
                  buildId={build.id}
                  label={`${build.year} ${build.make} ${build.model}`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function AdminDashboard() {
  const [forSale, pastBuilds] = await Promise.all([
    getBuilds("for_sale"),
    getBuilds("past_build"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide text-navy">
          Builds ({forSale.length + pastBuilds.length})
        </h1>
        <Link
          href="/admin/builds/new"
          className="bg-red text-cream font-semibold uppercase tracking-wide text-sm px-5 py-3 hover:bg-red-dark transition-colors"
        >
          + Add New Build
        </Link>
      </div>

      <p className="text-xs text-navy/50 mb-6">
        Use the arrows to change the order builds appear in on each page.
      </p>

      <BuildSection title="For Sale" builds={forSale} />
      <BuildSection title="Past Builds" builds={pastBuilds} />
    </div>
  );
}
