"use client";

import type { NavNode } from "@/lib/main-site-nav";

export function MainSiteNavItem({
  node,
  depth = 0,
}: {
  node: NavNode;
  depth?: number;
}) {
  if (!node.children || node.children.length === 0) {
    return (
      <a
        href={node.href}
        className={
          depth === 0
            ? "text-xs sm:text-sm font-semibold uppercase tracking-wide text-navy/70 hover:text-navy transition-colors"
            : "block px-4 py-2 text-xs uppercase tracking-wide text-navy/70 hover:bg-navy/5 hover:text-navy whitespace-nowrap"
        }
      >
        {node.label}
      </a>
    );
  }

  if (depth === 0) {
    return (
      <details className="group relative">
        <summary className="list-none cursor-pointer flex items-center gap-1 text-xs sm:text-sm font-semibold uppercase tracking-wide text-navy/70 hover:text-navy transition-colors">
          {node.label}
          <span className="text-[0.6rem] transition-transform group-open:rotate-180">
            &#9662;
          </span>
        </summary>
        <div className="absolute left-0 top-full z-20 mt-2 min-w-[180px] border border-navy/10 bg-white py-2 shadow-lg">
          {node.children.map((child) => (
            <MainSiteNavItem key={child.label} node={child} depth={1} />
          ))}
        </div>
      </details>
    );
  }

  return (
    <details className="group/sub">
      <summary className="list-none cursor-pointer flex items-center justify-between gap-2 px-4 py-2 text-xs uppercase tracking-wide text-navy/70 hover:bg-navy/5 hover:text-navy whitespace-nowrap">
        {node.label}
        <span className="text-[0.6rem] transition-transform group-open/sub:rotate-180">
          &#9662;
        </span>
      </summary>
      <div className="bg-navy/5 py-1">
        {node.children.map((child) => (
          <MainSiteNavItem key={child.label} node={child} depth={2} />
        ))}
      </div>
    </details>
  );
}
