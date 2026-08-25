import type { Metadata } from "next";
import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Turn-Key Trucks For Sale",
  description:
    "Turn-key crew cab trucks ready to drive, for sale from Classic Crew Cabs.",
};

export default async function TurnKeyPage() {
  const builds = await getBuilds("for_sale");
  const turnKey = builds.filter((b) => b.sale_type === "turn_key");

  return (
    <BuildGrid
      builds={turnKey}
      emptyMessage="No turn-key trucks for sale right now — check back soon."
    />
  );
}
