import { Loader2, Paperclip, SendHorizonal, X } from "lucide-react";
import React, { useState } from "react";

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) return null;
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 pt-4 transition-all duration-300 mt-2 relative"
    >
      {imageFile && (
        <div className="relative w-fit">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border-2 border-indigo-100 dark:border-emerald-900/30 shadow-sm"
          />
          <button
            type="button"
            className="absolute -top-2 -right-2 bg-gray-900 dark:bg-white rounded-lg p-1.5 shadow-md hover:scale-110 transition-transform"
            onClick={() => setImageFile(null)}
          >
            <X
              className="w-3.5 h-3.5 text-white dark:text-gray-900"
              strokeWidth={3}
            />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-2 rounded-xl border border-gray-100/50 dark:border-zinc-800/50 shadow-sm">
        <label className="cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg p-3 transition-all shrink-0">
          <Paperclip size={22} className="text-gray-500 dark:text-zinc-400" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </label>

        <input
          type="text"
          className="flex-1 bg-transparent px-2 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 outline-none transition-all"
          placeholder={imageFile ? "Add a caption..." : "Type your message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          disabled={(!imageFile && !message) || isUploading}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-emerald-500 dark:to-emerald-600 w-12 h-12 rounded-full transition-all flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-md shadow-indigo-500/20 dark:shadow-emerald-900/20 active:scale-95 shrink-0"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizonal className="w-5 h-5 -ml-0.5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
