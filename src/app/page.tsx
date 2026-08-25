import { SplashChoice } from "@/components/SplashChoice";

export default function LandingPage() {
  return (
    <SplashChoice
      eyebrow="Classic Crew Cabs"
      options={[
        {
          href: "/for-sale",
          label: "For Sale",
          sublabel: "Current Inventory",
        },
        {
          href: "/past-builds",
          label: "Past Builds",
          sublabel: "Restoration Showcase",
        },
      ]}
    />
  );
}
