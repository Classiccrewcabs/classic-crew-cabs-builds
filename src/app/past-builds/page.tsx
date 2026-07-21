import { getBuilds } from "@/lib/builds";
import { BuildGrid } from "@/components/BuildGrid";

export const revalidate = 0;

export default async function PastBuildsPage() {
  const builds = await getBuilds("past_build");

  return (
    <BuildGrid
      builds={builds}
      emptyMessage="No past builds posted yet — check back soon."
    />
  );
}
