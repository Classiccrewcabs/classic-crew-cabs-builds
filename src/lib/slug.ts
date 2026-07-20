export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function makeBuildSlug(year: number, make: string, model: string) {
  const base = slugify(`${year}-${make}-${model}`);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
