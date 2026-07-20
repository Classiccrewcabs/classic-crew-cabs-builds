import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10">
      <div className="bg-navy text-cream text-center text-xs tracking-[0.2em] uppercase py-2 px-4">
        1957&ndash;1979 Crew Cab Builds | Frame-Off Restorations | Built to
        Order
      </div>
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-bold uppercase tracking-wide text-navy text-lg sm:text-xl"
        >
          Classic Crew Cabs
          <span className="block text-[0.65rem] tracking-[0.3em] text-red font-semibold">
            Past Builds
          </span>
        </Link>
        <a
          href="https://classiccrewcabs.com"
          className="border border-navy text-navy text-xs sm:text-sm font-semibold uppercase tracking-wide px-4 py-2 hover:bg-navy hover:text-cream transition-colors"
        >
          Main Site
        </a>
      </div>
    </header>
  );
}
