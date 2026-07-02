"use client";

import { useState, useEffect, useRef } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceSend: () => void; // ← new: called when send was triggered by voice
  disabled: boolean;
}

export default function ChatInput({ value, onChange, onSend, onVoiceSend, disabled }: ChatInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceTriggeredRef = useRef(false); // tracks if current input came from mic

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      voiceTriggeredRef.current = true; // mark as voice input
      onChange(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      voiceTriggeredRef.current = false;
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => { recognition.stop(); };
  }, [onChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      voiceTriggeredRef.current = false;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Auto-send after voice transcription fills the input
  useEffect(() => {
    if (value && !isListening && !disabled && voiceTriggeredRef.current) {
      const timer = setTimeout(() => {
        voiceTriggeredRef.current = false;
        onVoiceSend(); // ← use voice-specific callback so dashboard knows
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [value, isListening, disabled, onVoiceSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      voiceTriggeredRef.current = false;
      onSend(); // regular send — no voice flag
    }
  };

  return (
    <div className="flex gap-3 px-4 py-3 border-t border-zinc-800 bg-zinc-950 items-center">
      <button
        onClick={toggleListening}
        disabled={disabled}
        title={isListening ? "Stop listening" : "Speak a message"}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition border ${
          isListening
            ? "bg-red-500 border-red-400 animate-pulse"
            : "bg-zinc-800 border-zinc-700 hover:border-zinc-500"
        } disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        {isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )}
      </button>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={isListening ? "Listening..." : "Type or speak a message..."}
        className={`flex-1 bg-zinc-800 border text-white placeholder-zinc-600 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500 disabled:opacity-50 transition ${
          isListening ? "border-red-500" : "border-zinc-700"
        }`}
      />

      <button
        onClick={() => { voiceTriggeredRef.current = false; onSend(); }}
        disabled={disabled || !value.trim()}
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  );
}
