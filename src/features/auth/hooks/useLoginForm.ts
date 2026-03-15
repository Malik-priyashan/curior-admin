"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid phone number or password. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  return {
    phone,
    setPhone,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
