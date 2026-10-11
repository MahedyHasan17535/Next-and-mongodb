"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="skeleton h-20 w-20 rounded-full"></div>
        <div className="skeleton h-5 w-40"></div>
        <div className="skeleton h-4 w-56"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="card mx-auto w-full max-w-md items-center gap-2 bg-white border border-line p-6">
        <h1 className="text-xl font-bold text-brand-dark">আমার প্রোফাইল</h1>

        <div className="avatar avatar-placeholder">
          <div className="ring-brand ring-offset-base-100 w-20 rounded-full ring-2 ring-offset-2 bg-brand-soft text-brand-dark text-2xl">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={user.name} src={user.image} />
            ) : (
              <span>{user?.name?.charAt(0)}</span>
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold">{user?.name}</h2>
        <p className="text-neutral-600">{user?.email}</p>

        <Link
          href={"/profile/update"}
          className="btn mt-3 border-none bg-brand text-white hover:bg-brand-dark"
        >
          তথ্য আপডেট করুন
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;