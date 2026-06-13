"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/town", label: "Town", icon: "fa-map-location-dot" },
  { href: "/pets", label: "Pets", icon: "fa-paw" },
  { href: "/tasks", label: "Tasks", icon: "fa-clipboard-list" },
  { href: "/inventory", label: "Bag", icon: "fa-box-open" },
  { href: "/shop", label: "Shop", icon: "fa-store" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={pathname === link.href ? "is-active" : ""}>
          <i className={`fa-solid ${link.icon}`} aria-hidden="true" />
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
