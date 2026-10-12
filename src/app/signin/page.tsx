"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import RedirectToast from "@/components/RedirectToast";
import toast from "react-hot-toast";

const SignInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    if (!user.email || !user.password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড দিন!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
      });

      if (error) {
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড ভুল!");
        return;
      }

      if (data) {
        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast.error("সার্ভারের সাথে সংযোগ করা যাচ্ছে না!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Google সাইন ইন চালু নেই!");
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "GitHub সাইন ইন চালু নেই!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <Suspense>
        <RedirectToast />
      </Suspense>

      <div className="card w-full max-w-md bg-white border border-line p-6">
        <h2 className="text-2xl font-bold text-brand-dark text-center">সাইন ইন</h2>
        <form onSubmit={onSubmit}>
          <fieldset className="fieldset rounded-box w-full">
            <label className="label">ইমেইল</label>
            <input
              name="email"
              type="email"
              className="input w-full"
              placeholder="you@example.com"
            />

            <label className="label">পাসওয়ার্ড</label>
            <input
              name="password"
              type="password"
              className="input w-full"
              placeholder="Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn border-none text-white bg-brand hover:bg-brand-dark mt-4"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
            </button>
          </fieldset>
        </form>

        <div className="divider">অথবা</div>

        <button onClick={handleGoogleSignIn} className="btn w-full">
          Google দিয়ে চালিয়ে যান
        </button>
        <button onClick={handleGithubSignIn} className="btn w-full mt-2">
          GitHub দিয়ে চালিয়ে যান
        </button>

        <p className="mt-4 text-center text-sm">
          অ্যাকাউন্ট নেই?{" "}
          <Link href={"/signup"} className="font-semibold text-brand-dark hover:underline">
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;