import Link from "next/link";
import NavLinks from "./NavLinks";
import { getCategories } from "@/lib/api";

const Header = async () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const categories = await getCategories();

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold text-brand-dark sm:text-2xl">
              🛒 বাজার দর
            </span>
            <span className="text-xs text-neutral-500">{date}</span>
          </Link>

          {/* temporary, replaced by UserInfo in Phase 7 */}
          <div className="flex items-center gap-2 text-sm">
            <Link href={"/signin"} className="btn btn-ghost btn-sm sm:btn-md">
              সাইন ইন
            </Link>
            <Link
              href={"/signup"}
              className="btn btn-sm sm:btn-md border-none bg-brand font-semibold text-white hover:bg-brand-dark"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <NavLinks categories={categories} />
      </div>
    </header>
  );
};

export default Header;