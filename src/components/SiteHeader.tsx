"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_SITE, MAIN_NAV, ACCOUNT_URL, CART_URL } from "@/lib/main-site-nav";
import { MainSiteNavItem } from "@/components/MainSiteNavItem";

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
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isPastBuilds = pathname === "/past-builds";

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-black/10">
      <div className="bg-navy text-cream text-center text-xs tracking-[0.2em] uppercase py-2 px-4">
        1957&ndash;1979 Crew Cab Builds | Frame-Off Restorations | Built to
        Order
      </div>

      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <a href={MAIN_SITE} className="block">
          <Image
            src="/ccc-logo.png"
            alt="Classic Crew Cabs"
            width={160}
            height={123}
            className="h-16 w-auto sm:h-20"
            priority
          />
        </a>

        <div className="flex items-center gap-6">
          <a
            href={`${MAIN_SITE}/pages/contact`}
            className="bg-red text-cream font-semibold uppercase tracking-wide text-xs sm:text-sm px-4 py-2.5 hover:bg-red-dark transition-colors"
          >
            {isPastBuilds ? "Contact Us About a Build" : "Start Your Build"}
          </a>
          <a
            href={ACCOUNT_URL}
            aria-label="Account (on main site)"
            className="text-navy hover:text-red transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </a>
          <a
            href={CART_URL}
            aria-label="Cart (on main site)"
            className="text-navy hover:text-red transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </a>
        </div>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-navy/10 px-6 py-3 sm:px-10">
        {MAIN_NAV.map((item) => (
          <MainSiteNavItem key={item.label} node={item} />
        ))}
      </nav>

      {!isLanding && (
        <div className="flex items-center justify-center gap-8 border-t border-navy/10 bg-cream px-6 py-4 sm:px-10">
          <NavLink href="/for-sale" label="For Sale" />
          <NavLink href="/past-builds" label="Past Builds" />
        </div>
      )}
    </header>
  );
}
