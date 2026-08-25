import type { Metadata } from "next";
import { SplashChoice } from "@/components/SplashChoice";

export const metadata: Metadata = {
  title: "Trucks For Sale",
  description:
    "Current inventory of restored crew cab trucks for sale from Classic Crew Cabs.",
};

export default function ForSaleSplashPage() {
  return (
    <SplashChoice
      eyebrow="Trucks For Sale"
      options={[
        {
          href: "/for-sale/turn-key",
          label: "Turn-Key",
          sublabel: "Ready to Drive",
        },
        {
          href: "/for-sale/project",
          label: "Projects",
          sublabel: "Total Project Trucks",
        },
      ]}
    />
  );
}
