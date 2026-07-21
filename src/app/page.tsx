import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16">
      <p className="text-navy/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-8">
        Classic Crew Cabs
      </p>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full max-w-3xl">
        <Link
          href="/for-sale"
          className="group flex-1 border-2 border-navy px-8 py-16 text-center hover:bg-navy transition-colors"
        >
          <span className="block text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-navy group-hover:text-cream transition-colors">
            For Sale
          </span>
          <span className="block mt-3 text-sm uppercase tracking-wide text-navy/60 group-hover:text-cream/80 transition-colors">
            Current Inventory
          </span>
        </Link>
        <Link
          href="/past-builds"
          className="group flex-1 border-2 border-navy px-8 py-16 text-center hover:bg-navy transition-colors"
        >
          <span className="block text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-navy group-hover:text-cream transition-colors">
            Past Builds
          </span>
          <span className="block mt-3 text-sm uppercase tracking-wide text-navy/60 group-hover:text-cream/80 transition-colors">
            Restoration Showcase
          </span>
        </Link>
      </div>
    </div>
  );
}
