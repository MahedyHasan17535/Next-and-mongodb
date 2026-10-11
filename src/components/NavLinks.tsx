"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/api";

const NavLinks = ({ categories }: { categories: Category[] }) => {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
      active
        ? "bg-brand text-white"
        : "text-ink hover:bg-brand-soft hover:text-brand-dark"
    }`;

  return (
    <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:justify-center">
      <Link href={"/"} className={linkClass(pathname === "/")}>
        হোম
      </Link>

      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={linkClass(pathname === `/category/${c.slug}`)}
        >
          {c.title}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;