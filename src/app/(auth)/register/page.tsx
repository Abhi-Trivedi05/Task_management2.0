"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { loginState } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      loginState(data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative overflow-hidden">
      {/* Decorative blurred circles behind the form */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm relative z-10 transition-transform duration-500 hover:scale-[1.02]">
        <h2 className="mt-10 text-center text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join us today to manage your tasks effectively
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm glass-card p-8 relative z-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-slate-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-600 hover:text-primary-500 hover:underline transition-all"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
