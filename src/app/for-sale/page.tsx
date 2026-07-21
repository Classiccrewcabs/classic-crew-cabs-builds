import type { Metadata } from "next";
import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Trucks For Sale",
  description:
    "Current inventory of restored crew cab trucks for sale from Classic Crew Cabs.",
};

export default async function ForSalePage() {
  const builds = await getBuilds("for_sale");

  return (
    <BuildGrid
      builds={builds}
      emptyMessage="No trucks for sale right now — check back soon."
    />
  );
}
