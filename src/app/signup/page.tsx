"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const router = useRouter();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
    };

    if (!user.name || !user.email || !user.password) {
      toast.error("সবগুলো ঘর পূরণ করুন!");
      return;
    }

    if (user.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
      return;
    }

    const { data, error } = await authClient.signUp.email({
      ...user,
    });

    if (data) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।");
      router.push("/signin");
    }

    if (error) {
      toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি!");
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="card w-full max-w-md bg-white border border-line p-6">
        <h2 className="text-2xl font-bold text-brand-dark text-center">সাইন আপ</h2>
        <form onSubmit={onSubmit}>
          <fieldset className="fieldset rounded-box w-full">
            <label className="label">নাম</label>
            <input
              name="name"
              type="text"
              className="input w-full"
              placeholder="যেমন: রহিম উদ্দিন"
            />

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
              placeholder="কমপক্ষে ৮ অক্ষর"
            />

            <button
              type="submit"
              className="btn border-none text-white bg-brand hover:bg-brand-dark mt-4"
            >
              সাইন আপ করুন
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
          অ্যাকাউন্ট আছে?{" "}
          <Link href={"/signin"} className="font-semibold text-brand-dark hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;