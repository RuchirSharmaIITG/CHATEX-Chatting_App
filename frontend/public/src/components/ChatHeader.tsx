import { User } from "@/context/AppContext";
import { Menu, UserCircle, Sun, Moon } from "lucide-react";
import React from "react";
import { useTheme } from "next-themes";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
}: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* mobile menu toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          className="p-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
        </button>
      </div>

      {/* floating chat header container */}
      <div className="mb-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-gray-100/50 dark:border-zinc-800/50 p-4 px-6 flex justify-between items-center transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-800">
                  {user?.profilePic?.url ? (
                    <img
                      src={user.profilePic.url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
                  )}
                </div>
                {/* online user setup */}
                {isOnlineUser && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>

              {/* user info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate tracking-tight">
                    {user.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-emerald-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 bg-indigo-500 dark:bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 bg-indigo-500 dark:bg-emerald-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-indigo-600 dark:text-emerald-400 font-semibold">
                        typing...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isOnlineUser
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-500 dark:text-zinc-500"
                        }`}
                      >
                        {isOnlineUser ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-400 dark:text-zinc-500 tracking-tight">
                  No chat selected
                </h2>
                <p className="text-sm text-gray-400 dark:text-zinc-600 mt-0.5">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switching Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500 animate-pulse" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
