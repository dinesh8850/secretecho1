"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";
import { AuthResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-semibold text-lg mb-4 tracking-tight">
            SE
          </div>
          <h1 className="text-white text-xl font-medium">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to SecretEcho</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:border-zinc-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:border-zinc-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition mt-2"
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-sm text-zinc-600 mt-5 text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-white hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
