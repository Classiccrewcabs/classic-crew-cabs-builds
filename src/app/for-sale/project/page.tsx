import type { Metadata } from "next";
import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Project Trucks For Sale",
  description:
    "Total project crew cab trucks for sale from Classic Crew Cabs.",
};

export default async function ProjectTrucksPage() {
  const builds = await getBuilds("for_sale");
  const projects = builds.filter((b) => b.sale_type === "project");

  return (
    <BuildGrid
      builds={projects}
      emptyMessage="No project trucks for sale right now — check back soon."
    />
  );
}
