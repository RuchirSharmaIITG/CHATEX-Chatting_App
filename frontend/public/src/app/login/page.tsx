"use client";
import Loading from "@/components/Loading";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import { ArrowRight, Loader2, Mail, Sun, Moon } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { isAuth, loading: userLoading } = useAppData();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });

      toast.success(data.message);
      router.push(`/verify?email=${email}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Unable to connect to the server.",
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return redirect("/chat");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#09090b] transition-colors duration-300 font-sans">
      {/* Left/Top Branding Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-[#09090b] border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center p-10 relative overflow-hidden">
        {/* Soft floating background blobs for modern feel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 dark:bg-emerald-500/10 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-500/10 dark:bg-teal-500/10 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

        <div className="bg-indigo-600 dark:bg-emerald-500 p-5 rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-emerald-900/20 mb-8 z-10 transition-colors duration-300">
          <Mail size={48} className="text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center z-10 mb-4 transition-colors duration-300">
          Welcome to{" "}
          <span className="text-indigo-600 dark:text-emerald-400">Chatex</span>
        </h1>

        <p className="text-gray-500 dark:text-zinc-400 text-center max-w-md z-10 text-lg transition-colors duration-300">
          Connect, collaborate, and communicate seamlessly. Start your journey
          by entering your email.
        </p>
      </div>

      {/* Right/Bottom Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-8 relative">
        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              Sign In
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 transition-colors duration-300">
              Enter your email to receive a secure login code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 transition-colors duration-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/20 focus:border-indigo-500 dark:focus:border-emerald-500 transition-all duration-300"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 dark:shadow-emerald-900/20 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Continue with Email</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
