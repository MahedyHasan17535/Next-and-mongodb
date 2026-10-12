"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserInfoProps {
  user: { name: string; image: string | null } | null;
}

const UserInfo = ({ user }: UserInfoProps) => {
  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {user ? (
        <>
          <Link href={"/profile"} className="flex items-center gap-2">
            <div className="avatar avatar-placeholder">
              <div className="ring-brand ring-offset-base-100 w-9 rounded-full ring-2 ring-offset-2 bg-brand-soft text-brand-dark">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={user.name} src={user.image} />
                ) : (
                  <span>{user.name?.charAt(0)}</span>
                )}
              </div>
            </div>
            <span className="hidden font-semibold sm:block">{user.name}</span>
          </Link>

          <button onClick={handleSignout} className="btn btn-error btn-xs sm:btn-sm">
            সাইন আউট
          </button>
        </>
      ) : (
        <>
          <Link href={"/signin"}>
            <button className="btn btn-ghost btn-sm sm:btn-md text-ink hover:text-brand-dark">
              সাইন ইন
            </button>
          </Link>
          <Link href={"/signup"}>
            <button className="btn btn-sm sm:btn-md border-none bg-brand font-semibold text-white hover:bg-brand-dark">
              সাইন আপ
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default UserInfo;