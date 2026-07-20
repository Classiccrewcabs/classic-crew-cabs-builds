export function SiteFooter() {
  return (
    <footer className="bg-navy text-cream mt-auto">
      <div className="px-6 py-8 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs tracking-wide uppercase">
        <p>&copy; {new Date().getFullYear()} Classic Crew Cabs</p>
        <a
          href="https://classiccrewcabs.com"
          className="text-cream/80 hover:text-cream"
        >
          classiccrewcabs.com
        </a>
      </div>
    </footer>
  );
}
