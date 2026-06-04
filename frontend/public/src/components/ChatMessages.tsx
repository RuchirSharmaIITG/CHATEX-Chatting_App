import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import React, { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) {
        return false;
      }
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);

  return (
    <div className="flex-1 overflow-hidden font-sans">
      <div className="h-full max-h-[calc(100vh-215px)] overflow-y-auto p-2 space-y-4 custom-scroll">
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50 mt-10">
            <p className="text-gray-400 dark:text-zinc-500 font-medium text-lg">
              Select a conversation to start chatting
            </p>
          </div>
        ) : (
          <>
            {uniqueMessages.map((e, i) => {
              const isSentByMe = e.sender === loggedInUser?._id;
              const uniqueKey = `${e._id}-${i}`;

              return (
                <div
                  className={`flex flex-col gap-1.5 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                  key={uniqueKey}
                >
                  <div
                    className={`px-4 py-3 max-w-sm transition-colors duration-200 shadow-sm ${
                      isSentByMe
                        ? "bg-indigo-600 dark:bg-emerald-600 text-white rounded-2xl rounded-br-sm"
                        : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {e.messageType === "image" && e.image && (
                      <div className="relative group mb-2">
                        <img
                          src={e.image.url}
                          alt="shared image"
                          className="max-w-full h-auto rounded-xl border border-black/10 dark:border-white/10 bg-white"
                        />
                      </div>
                    )}

                    {e.text && <p className="leading-relaxed">{e.text}</p>}
                  </div>

                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-zinc-500 ${
                      isSentByMe ? "pr-1 flex-row-reverse" : "pl-1"
                    }`}
                  >
                    <span>{moment(e.createdAt).format("hh:mm A")}</span>

                    {isSentByMe && (
                      <div className="flex items-center">
                        {e.seen ? (
                          <div className="flex items-center gap-1 text-indigo-500 dark:text-emerald-400">
                            <CheckCheck className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        ) : (
                          <Check
                            className="w-4 h-4 text-gray-300 dark:text-zinc-600"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
