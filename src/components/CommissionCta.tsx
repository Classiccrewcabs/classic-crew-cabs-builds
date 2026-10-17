const CONTACT_URL = "https://classiccrewcabs.com/pages/contact";

export function CommissionCta() {
  return (
    <div className="bg-gray-100 rounded-2xl px-6 py-10 sm:px-12 sm:py-12 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
        Want a Classic Ford Crew Cab Like This?
      </h2>
      <p className="mt-4 text-navy/80 leading-relaxed max-w-2xl mx-auto">
        Classic Crew Cabs specializes in frame-off restorations of 1967–1979
        Ford crew cab trucks, with an extensive inventory of trucks available
        for commissioned builds.
      </p>
      <p className="mt-4 font-bold text-navy">Your dream crew cab starts here.</p>
      <a
        href={CONTACT_URL}
        className="mt-6 inline-block bg-red text-cream font-semibold uppercase tracking-wide text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4 hover:bg-red-dark transition-colors"
      >
        Commission Your Build &rarr;
      </a>
    </div>
  );
}
