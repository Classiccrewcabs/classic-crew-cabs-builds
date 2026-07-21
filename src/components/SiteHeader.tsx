"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-lg sm:text-xl font-extrabold uppercase tracking-wide pb-1 border-b-4 transition-colors ${
        isActive
          ? "text-navy border-red"
          : "text-navy/50 border-transparent hover:text-navy"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-black/10">
      <div className="bg-navy text-cream text-center text-xs tracking-[0.2em] uppercase py-2 px-4">
        1957&ndash;1979 Crew Cab Builds | Frame-Off Restorations | Built to
        Order
      </div>
      <div className="flex flex-col gap-4 px-6 py-5 sm:px-10 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-bold uppercase tracking-wide text-navy text-lg sm:text-xl"
        >
          Classic Crew Cabs
          <span className="block text-[0.65rem] tracking-[0.3em] text-red font-semibold">
            Inventory &amp; Builds
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <NavLink href="/" label="For Sale" />
          <NavLink href="/past-builds" label="Past Builds" />
        </nav>

        <a
          href="https://classiccrewcabs.com"
          className="border border-navy text-navy text-xs sm:text-sm font-semibold uppercase tracking-wide px-4 py-2 hover:bg-navy hover:text-cream transition-colors self-start sm:self-auto"
        >
          Main Site
        </a>
      </div>
    </header>
  );
}
