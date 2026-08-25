import type { Metadata } from "next";
import { getBuilds } from "@/lib/builds";
import { BuildCard } from "@/components/BuildCard";
import type { BuildWithImages } from "@/lib/types";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Trucks For Sale",
  description:
    "Current inventory of restored crew cab trucks for sale from Classic Crew Cabs.",
};

function Section({
  title,
  builds,
}: {
  title: string;
  builds: BuildWithImages[];
}) {
  if (builds.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-navy mb-8">
        {title} <span className="text-red">/</span>
      </h2>
      <div className="flex flex-col gap-10">
        {builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  );
}

export default async function ForSalePage() {
  const builds = await getBuilds("for_sale");
  const turnKey = builds.filter((b) => b.sale_type === "turn_key");
  const project = builds.filter((b) => b.sale_type === "project");

  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      {builds.length === 0 ? (
        <p className="text-navy/60 text-center py-24 uppercase tracking-wide text-sm">
          No trucks for sale right now — check back soon.
        </p>
      ) : (
        <>
          <Section title="Turn-Key" builds={turnKey} />
          <Section title="Project Trucks" builds={project} />
        </>
      )}
    </div>
  );
}
