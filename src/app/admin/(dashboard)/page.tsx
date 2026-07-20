import Link from "next/link";
import Image from "next/image";
import { getBuilds, buildImageUrl } from "@/lib/builds";
import { DeleteBuildForm } from "@/components/DeleteBuildForm";

export const revalidate = 0;

export default async function AdminDashboard() {
  const builds = await getBuilds();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide text-navy">
          Builds ({builds.length})
        </h1>
        <Link
          href="/admin/builds/new"
          className="bg-red text-cream font-semibold uppercase tracking-wide text-sm px-5 py-3 hover:bg-red-dark transition-colors"
        >
          + Add New Build
        </Link>
      </div>

      {builds.length === 0 ? (
        <p className="text-navy/60 uppercase text-sm tracking-wide">
          No builds yet. Click &quot;Add New Build&quot; to create your
          first one.
        </p>
      ) : (
        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {builds.map((build) => {
            const cover = build.build_images[0];
            return (
              <div
                key={build.id}
                className="flex items-center gap-4 py-4"
              >
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
                    {build.year} {build.make} {build.model}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-navy/50">
                    {build.status} &middot; {build.build_images.length} photo
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
