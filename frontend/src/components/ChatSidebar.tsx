import { User } from "@/context/AppContext";
import {
  CornerDownRight,
  CornerUpLeft,
  LogOut,
  MessagesSquare,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User[] | null;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => void;
  createChat: (user: User) => void;
  onlineUsers: string[];
  activeTypingChats?: string[];
}

const ChatSidebar = ({
  sidebarOpen,
  setShowAllUsers,
  setSidebarOpen,
  showAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
  onlineUsers,
  activeTypingChats,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-3xl border-r border-gray-100 dark:border-zinc-800 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col font-sans`}
    >
      {/* header */}
      <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
        <div className="sm:hidden flex justify-end mb-0">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-emerald-400 dark:to-emerald-600 rounded-full shadow-md shadow-indigo-600/30 dark:shadow-emerald-900/40 shrink-0">
              <MessagesSquare
                className="w-5 h-5 text-white"
                strokeWidth={2.5}
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {showAllUsers ? "New Chat" : "Chatex"}
            </h2>
          </div>

          <button
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all shadow-sm shrink-0 ${
              showAllUsers
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                : "bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700"
            }`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden px-4 py-4">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search Users..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-emerald-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* users list */}
            <div className="space-y-2 overflow-y-auto h-full pb-4 custom-scroll">
              {users
                ?.filter(
                  (u) =>
                    u._id !== (loggedInUser as any)?._id &&
                    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((u) => (
                  <button
                    key={u._id}
                    className="w-full text-left p-4 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 hover:bg-white/60 dark:hover:bg-zinc-900/50 transition-all"
                    onClick={() => createChat(u)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {u.profilePic?.url ? (
                          <img
                            src={u.profilePic.url}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-900"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                          </div>
                        )}

                        {onlineUsers.includes(u._id) && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#09090b]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {u.name}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-2 overflow-y-auto h-full pb-4 custom-scroll">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe =
                latestMessage?.sender === (loggedInUser as any)?._id;
              const unseenCount = chat.chat.unseenCount || 0;
              const isThisUserTyping = activeTypingChats?.includes(
                chat.chat._id,
              );

              return (
                <button
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-700 dark:from-emerald-500 dark:to-emerald-700 shadow-lg shadow-indigo-500/30 dark:shadow-emerald-900/40 text-white transform scale-[1.02]"
                      : "hover:bg-white/60 dark:hover:bg-zinc-800/50 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden ring-2 ring-transparent">
                        {chat.user.profilePic?.url ? (
                          <img
                            src={chat.user.profilePic.url}
                            alt={chat.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserCircle className="w-7 h-7 text-gray-400 dark:text-zinc-500" />
                        )}
                      </div>

                      {onlineUsers.includes(chat.user._id) && (
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ${isSelected ? "ring-indigo-600 dark:ring-emerald-600" : "ring-white dark:ring-[#09090b]"}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-bold truncate ${
                            isSelected
                              ? "text-white"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {chat.user.name}
                        </span>
                        {unseenCount > 0 && (
                          <div className="bg-rose-500 text-white text-xs font-bold rounded-lg min-w-[22px] h-5.5 flex items-center justify-center px-2 shadow-sm shrink-0">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </div>
                        )}
                      </div>

                      {/*Logic to display typing indicator OR the latest message */}
                      {isThisUserTyping ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm truncate flex-1 font-medium italic animate-pulse ${
                              isSelected
                                ? "text-indigo-200 dark:text-emerald-200"
                                : "text-indigo-500 dark:text-emerald-500"
                            }`}
                          >
                            Typing...
                          </span>
                        </div>
                      ) : latestMessage ? (
                        <div className="flex items-center gap-2">
                          {isSentByMe ? (
                            <CornerUpLeft
                              size={14}
                              className={`shrink-0 ${
                                isSelected
                                  ? "text-indigo-200 dark:text-emerald-200"
                                  : "text-indigo-500 dark:text-emerald-500"
                              }`}
                            />
                          ) : (
                            <CornerDownRight
                              size={14}
                              className={`shrink-0 ${
                                isSelected
                                  ? "text-indigo-200 dark:text-emerald-200"
                                  : "text-gray-400 dark:text-zinc-500"
                              }`}
                            />
                          )}
                          <span
                            className={`text-sm truncate flex-1 font-medium ${isSelected ? "text-indigo-50 dark:text-emerald-50" : "text-gray-500 dark:text-zinc-400"}`}
                          >
                            {latestMessage.text}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-5 bg-white/50 dark:bg-zinc-900/50 rounded-lg mb-4 shadow-sm border border-gray-100 dark:border-zinc-800">
              <MessagesSquare className="w-8 h-8 text-gray-400 dark:text-zinc-500" />
            </div>
            <p className="text-gray-900 dark:text-white font-bold">
              No messages yet
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Start a new chat to begin connecting
            </p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-2">
        <Link
          href={"/profile"}
          className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-indigo-100 dark:group-hover:ring-emerald-900 transition-all shrink-0">
            {(loggedInUser as any)?.profilePic?.url ? (
              <img
                src={(loggedInUser as any).profilePic.url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
            )}
          </div>
          <span className="font-semibold text-gray-700 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
            Profile Settings
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 transition-colors group"
        >
          <div className="p-1.5 bg-rose-100/50 dark:bg-rose-500/20 rounded-md group-hover:bg-rose-200 dark:group-hover:bg-rose-500/30 transition-colors shrink-0">
            <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <span className="font-semibold truncate">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
