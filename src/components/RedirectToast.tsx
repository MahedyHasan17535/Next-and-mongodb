"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const RedirectToast = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (redirect === "login-required") {
      toast.error("এই পেজ দেখতে হলে আগে সাইন ইন করতে হবে!", { id: "login-required" });
    }
  }, [redirect]);

  return null;
};

export default RedirectToast;