export const MAIN_SITE = "https://classiccrewcabs.com";

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
};

export const MAIN_NAV: NavNode[] = [
  { label: "Home", href: `${MAIN_SITE}/` },
  { label: "About Us", href: `${MAIN_SITE}/pages/about-us` },
  { label: "Trucks", href: "https://builds.classiccrewcabs.com" },
  {
    label: "Parts",
    children: [
      {
        label: "Interior",
        children: [
          {
            label: "Headliners",
            href: `${MAIN_SITE}/collections/headliners-1`,
          },
          {
            label: "Dakota Digital",
            href: `${MAIN_SITE}/collections/dakota-digital-guage-sets`,
          },
          {
            label: "Power Window Kit's",
            href: `${MAIN_SITE}/collections/power-window-kits`,
          },
          {
            label: "Power Locks / Remote Entry",
            href: `${MAIN_SITE}/collections/power-locks`,
          },
        ],
      },
      {
        label: "Exterior",
        children: [
          { label: "Emblems", href: `${MAIN_SITE}/collections/emblems` },
          { label: "Hub Caps", href: `${MAIN_SITE}/collections/hub-caps` },
          { label: "Body Parts", href: `${MAIN_SITE}/collections/body-parts` },
        ],
      },
    ],
  },
  {
    label: "Logo Store",
    children: [{ label: "Hats", href: `${MAIN_SITE}/collections/hats` }],
  },
  { label: "Contact Us", href: `${MAIN_SITE}/pages/contact` },
  {
    label: "Builds",
    children: [
      {
        label: "Build Services",
        href: `${MAIN_SITE}/pages/build-services`,
      },
      { label: "Build Process", href: `${MAIN_SITE}/pages/build-process` },
    ],
  },
];

export const ACCOUNT_URL =
  "https://classiccrewcabs.com/customer_authentication/redirect?locale=en&region_country=US";
export const CART_URL = `${MAIN_SITE}/cart`;
