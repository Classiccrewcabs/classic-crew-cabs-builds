export const MAIN_SITE = "https://classiccrewcabs.com";

export type NavNode = {
  label: string;
  href?: string;
  children?: NavNode[];
};

export const MAIN_NAV: NavNode[] = [
  { label: "Home", href: `${MAIN_SITE}/` },
  {
    label: "Parts",
    children: [
      {
        label: "1967-1972 Bumpside",
        href: `${MAIN_SITE}/collections/1967-1972-bumpside`,
      },
      {
        label: "1973-1979 Dentside",
        href: `${MAIN_SITE}/collections/1973-1979-dentside`,
      },
    ],
  },
  { label: "Build Levels", href: `${MAIN_SITE}/pages/build-services` },
  {
    label: "For Sale / Past Builds",
    href: "https://builds.classiccrewcabs.com",
  },
  {
    label: "More",
    children: [
      { label: "Contact Us", href: `${MAIN_SITE}/pages/contact` },
      { label: "About Us", href: `${MAIN_SITE}/pages/about-us` },
      { label: "Merch", href: `${MAIN_SITE}/products/patch-hat` },
    ],
  },
];

export const ACCOUNT_URL =
  "https://classiccrewcabs.com/customer_authentication/redirect?locale=en&region_country=US";
export const CART_URL = `${MAIN_SITE}/cart`;
