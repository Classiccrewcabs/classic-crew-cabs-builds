import { BuildCard } from "@/components/BuildCard";
import type { BuildWithImages } from "@/lib/types";

export function BuildGrid({
  builds,
  emptyMessage,
}: {
  builds: BuildWithImages[];
  emptyMessage: string;
}) {
  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      {builds.length === 0 ? (
        <p className="text-navy/60 text-center py-24 uppercase tracking-wide text-sm">
          {emptyMessage}
        </p>
      ) : (
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}
    </div>
  );
}
