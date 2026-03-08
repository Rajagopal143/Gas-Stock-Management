"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<{ username: string; password: string }>();

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    if (!response.ok) return setError("Invalid credentials");
    router.push("/dashboard");
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded-xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold">Login</h1>
        <Input placeholder="Username" {...register("username")} />
        <Input type="password" placeholder="Password" {...register("password")} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
