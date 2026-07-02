"use client";

import { Message } from "@/types/message";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar — only for AI */}
        {!isUser && (
          <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            SE
          </div>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-white text-black rounded-br-sm"
              : "bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
