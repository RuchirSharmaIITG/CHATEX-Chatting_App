"use client";
import { useAppData, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import {
  ArrowLeft,
  Save,
  User,
  UserCircle,
  Sun,
  Moon,
  Camera,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");
  const [isUploadingPic, setIsUploadingPic] = useState(false);

  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/user`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      toast.success(data.message);
      setUser(data.user);
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPic(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${user_service}/api/v1/update/profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 15,
          secure: false,
          path: "/",
        });
      }

      setUser(data.user);
      toast.success("Profile picture updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload picture");
    } finally {
      setIsUploadingPic(false);
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] p-4 transition-colors duration-300 relative font-sans">
      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-4 right-4 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          type="button"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      )}

      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/chat")}
            className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-zinc-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Profile Settings
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-1">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg transition-colors duration-300 overflow-hidden">
          <div className="bg-gray-50/50 dark:bg-zinc-900/50 p-8 border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="flex items-center gap-6">
              {/* Clickable Avatar Container */}
              <div className="relative group">
                <label
                  htmlFor="profilePicUpload"
                  className="cursor-pointer block relative rounded-full overflow-hidden w-20 h-20 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-gray-200 dark:border-zinc-700 transition-all"
                >
                  <input
                    id="profilePicUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePicUpload}
                    disabled={isUploadingPic}
                  />

                  {isUploadingPic ? (
                    <Loader2 className="w-8 h-8 text-indigo-500 dark:text-emerald-500 animate-spin" />
                  ) : user?.profilePic?.url ? (
                    <img
                      src={user.profilePic.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                  )}

                  {/* Camera Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </label>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 z-10"></div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                  {user?.name || "User"}
                </h2>

                {/* Visual Indicator: Status & Clickable Text */}
                <div className="flex items-center gap-3">
                  <p className="text-gray-500 dark:text-zinc-400 text-sm">
                    Active now
                  </p>
                  <span
                    className="text-xs text-indigo-600 dark:text-emerald-400 bg-indigo-50 dark:bg-emerald-500/10 hover:bg-indigo-100 dark:hover:bg-emerald-500/20 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                    onClick={() =>
                      document.getElementById("profilePicUpload")?.click()
                    }
                  >
                    Change Photo
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">
                  Display Name
                </label>

                {isEdit ? (
                  <form onSubmit={submitHandler} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/20 focus:border-indigo-500 dark:focus:border-emerald-500 transition-all duration-300"
                      />
                      <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500" />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all shadow-sm shadow-indigo-600/20 dark:shadow-emerald-900/20 flex-1 sm:flex-none active:scale-[0.98]"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={editHandler}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-semibold rounded-lg transition-colors flex-1 sm:flex-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
                    <span className="text-gray-900 dark:text-white font-medium text-lg">
                      {user?.name || "Not set"}
                    </span>
                    <button
                      onClick={editHandler}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-semibold rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
