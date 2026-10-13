import Link from "next/link";
import { headers } from "next/headers";
import NavLinks from "./NavLinks";
import UserInfo from "./UserInfo";
import TodayDate from "./TodayDate";
import { getCategories } from "@/lib/api";
import { auth } from "@/lib/auth";

const Header = async () => {
  const [categories, session] = await Promise.all([
    getCategories(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const user = session?.user
    ? { name: session.user.name, image: session.user.image ?? null }
    : null;

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex flex-col">
            <span className="text-xl font-bold text-brand-dark sm:text-2xl">
              🛒 বাজার দর
            </span>
            <TodayDate />
          </Link>

          <UserInfo user={user} />
        </div>

        <NavLinks categories={categories} />
      </div>
    </header>
  );
};

export default Header;