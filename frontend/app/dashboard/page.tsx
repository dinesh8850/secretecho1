"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { Message } from "@/types/message";

const speak = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.name.includes("Samantha") ||
      v.name.includes("Google US English") ||
      v.name.includes("Karen") ||
      (v.lang === "en-US" && v.localService)
  );
  if (preferred) utterance.voice = preferred;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
};

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Tracks whether the LAST message was sent via voice.
  // If true → AI reply should be spoken aloud.
  // If false (typed) → AI reply is silent.
  const voiceModeRef = useRef(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) { router.push("/login"); return; }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const response = await api.get<{ messages: Message[] }>("/messages");
        setMessages(response.data.messages);
      } catch {
        router.push("/login");
      }
    };
    fetchHistory();
  }, [token, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m._id === message._id)) return prev;

      // Only speak if the user's last message came from voice input
      if (message.sender === "ai" && voiceModeRef.current) {
        speak(message.text);
        voiceModeRef.current = false; // reset after speaking
      }

      return [...prev, message];
    });
  }, []);

  useSocket(token, handleNewMessage);

  // Regular typed send — voice mode off
  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !token) return;
    voiceModeRef.current = false;
    setIsLoading(true);
    const textToSend = inputText.trim();
    setInputText("");
    try {
      await api.post("/messages", { text: textToSend });
    } catch {
      setInputText(textToSend);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice send — voice mode on, AI will speak its reply
  const handleVoiceSend = async () => {
    if (!inputText.trim() || isLoading || !token) return;
    voiceModeRef.current = true; // ← this is the key flag
    setIsLoading(true);
    const textToSend = inputText.trim();
    setInputText("");
    try {
      await api.post("/messages", { text: textToSend });
    } catch {
      voiceModeRef.current = false;
      setInputText(textToSend);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    window.speechSynthesis?.cancel();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-black">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-black text-xs font-semibold">
            SE
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">SecretEcho</p>
            <p className="text-green-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-white text-sm font-medium">
              SE
            </div>
            <p className="text-zinc-600 text-sm text-center">
              Say something — type or tap the mic
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatBubble key={message._id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                SE
              </div>
              <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSend={handleSend}
        onVoiceSend={handleVoiceSend}
        disabled={isLoading}
      />
    </div>
  );
}
