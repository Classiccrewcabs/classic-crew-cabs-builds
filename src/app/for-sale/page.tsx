import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export default async function ForSalePage() {
  const builds = await getBuilds("for_sale");

  return (
    <BuildGrid
      builds={builds}
      emptyMessage="No trucks for sale right now — check back soon."
    />
  );
}
