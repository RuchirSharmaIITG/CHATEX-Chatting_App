"use client";
import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

const VerifyOtp = () => {
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUsers,
  } = useAppData();

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const email: string = searchParams.get("email") || "";

  // Theme setup
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>,
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const patedData = e.clipboardData.getData("text");
    const digits = patedData.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please Enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify`, {
        email,
        otp: otpString,
      });
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) redirect("/chat");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#09090b] transition-colors duration-300 font-sans">
      {/* Left/Top Branding Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-[#09090b] border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center p-10 relative overflow-hidden">
        {/* Soft floating background blobs for modern feel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 dark:bg-emerald-500/10 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-500/10 dark:bg-teal-500/10 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

        <div className="bg-indigo-600 dark:bg-emerald-500 p-5 rounded-3xl shadow-lg shadow-indigo-200 dark:shadow-emerald-900/20 mb-8 z-10 transition-colors duration-300">
          <Lock size={48} className="text-white" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center z-10 mb-4 transition-colors duration-300">
          Security{" "}
          <span className="text-indigo-600 dark:text-emerald-400">Check</span>
        </h1>

        <p className="text-gray-500 dark:text-zinc-400 text-center max-w-md z-10 text-lg transition-colors duration-300">
          We've sent a 6-digit verification code to <br />
          <span className="font-semibold text-gray-900 dark:text-white">
            {email}
          </span>
        </p>
      </div>

      {/* Right/Bottom Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-8 relative">
        {/* Back Button */}
        <button
          className="absolute top-6 left-6 p-2.5 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400 flex items-center justify-center"
          onClick={() => router.push("/login")}
          type="button"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-gray-600 dark:text-zinc-400"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="w-full max-w-md space-y-8 mt-12 md:mt-0">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
              Enter Code
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 transition-colors duration-300">
              Paste or type the OTP to verify your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div className="flex justify-center md:justify-start space-x-2 sm:space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-gray-200 dark:border-zinc-800 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/20 transition-all duration-300 shadow-sm"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 transition-colors duration-300">
                <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 dark:shadow-emerald-900/20 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Complete Verification</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center md:text-left border-t border-gray-100 dark:border-zinc-800 pt-6">
            <p className="text-gray-500 dark:text-zinc-400 text-sm mb-3">
              Didn't receive the code?
            </p>
            {timer > 0 ? (
              <p className="text-gray-500 dark:text-zinc-400 text-sm">
                Resend code in{" "}
                <span className="font-bold text-indigo-600 dark:text-emerald-400">
                  00:{timer < 10 ? `0${timer}` : timer}
                </span>
              </p>
            ) : (
              <button
                className="text-indigo-600 dark:text-emerald-400 hover:text-indigo-700 dark:hover:text-emerald-300 font-bold text-sm disabled:opacity-50 transition-colors"
                disabled={resendLoading}
                onClick={handleResendOtp}
                type="button"
              >
                {resendLoading ? "Sending new code..." : "Resend Code Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
