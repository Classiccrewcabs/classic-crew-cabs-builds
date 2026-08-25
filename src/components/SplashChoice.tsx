import Link from "next/link";

export type SplashOption = {
  href: string;
  label: string;
  sublabel: string;
};

export function SplashChoice({
  eyebrow,
  options,
}: {
  eyebrow: string;
  options: SplashOption[];
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
      <p className="text-navy/50 text-xs sm:text-sm uppercase tracking-[0.3em] mb-8">
        {eyebrow}
      </p>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 w-full max-w-3xl">
        {options.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="group flex-1 border-2 border-navy px-8 py-16 text-center hover:bg-navy transition-colors"
          >
            <span className="block text-3xl sm:text-4xl font-extrabold uppercase tracking-wide text-navy group-hover:text-cream transition-colors">
              {option.label}
            </span>
            <span className="block mt-3 text-sm uppercase tracking-wide text-navy/60 group-hover:text-cream/80 transition-colors">
              {option.sublabel}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
