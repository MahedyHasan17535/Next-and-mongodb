"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleUpdateProfile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newUserData = Object.fromEntries(formData.entries()) as {
      name: string;
    };

    if (!newUserData.name.trim()) {
      toast.error("নাম লিখুন!");
      return;
    }

    const { error } = await authClient.updateUser({
      ...newUserData,
    });

    if (error) {
      toast.error(error.message || "তথ্য আপডেট করা যায়নি!");
      return;
    }

    toast.success("তথ্য সফলভাবে আপডেট হয়েছে!");
    router.push("/profile");
  };

  if (isPending) {
    return (
      <div className="mt-8 mx-auto max-w-md">
        <div className="skeleton h-48 w-full"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="card w-full max-w-md bg-white border border-line p-6">
        <h1 className="text-xl font-bold text-brand-dark text-center">তথ্য আপডেট করুন</h1>

        <form onSubmit={handleUpdateProfile}>
          <fieldset className="fieldset rounded-box w-full">
            <label className="label">নাম</label>
            <input
              name="name"
              type="text"
              defaultValue={user?.name}
              className="input w-full"
              placeholder="Name"
            />

            <button
              type="submit"
              className="btn border-none text-white bg-brand hover:bg-brand-dark mt-4"
            >
              Update Information
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;