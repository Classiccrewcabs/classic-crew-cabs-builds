import type { MetadataRoute } from "next";
import { getBuilds } from "@/lib/builds";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const builds = await getBuilds();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/for-sale`, changeFrequency: "daily", priority: 0.9 },
    {
      url: `${SITE_URL}/past-builds`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const buildRoutes: MetadataRoute.Sitemap = builds.map((build) => ({
    url: `${SITE_URL}/builds/${build.slug}`,
    lastModified: build.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...buildRoutes];
}
