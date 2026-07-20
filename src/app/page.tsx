import { getBuilds } from "@/lib/builds";
import { BuildCard } from "@/components/BuildCard";

export const revalidate = 0;

export default async function Home() {
  const builds = await getBuilds();

  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      {builds.length === 0 ? (
        <p className="text-navy/60 text-center py-24 uppercase tracking-wide text-sm">
          No builds posted yet &mdash; check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
    </div>
  );
}
