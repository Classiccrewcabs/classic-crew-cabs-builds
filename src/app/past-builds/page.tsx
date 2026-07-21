import type { Metadata } from "next";
import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Past Builds",
  description:
    "Frame-off restoration showcase of past crew cab builds from Classic Crew Cabs.",
};

export default async function PastBuildsPage() {
  const builds = await getBuilds("past_build");

  return (
    <BuildGrid
      builds={builds}
      emptyMessage="No past builds posted yet — check back soon."
    />
  );
}
