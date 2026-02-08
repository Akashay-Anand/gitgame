"use client";

import { useRef, useState, useEffect } from "react";

const STORAGE_KEY = "gitquest-music-playing";
const MUSIC_SRC = "/audio/bg-music.mp3";

interface MusicToggleProps {
  /** "dark" for dark headers (levels), "light" for light headers (play, home). */
  variant?: "dark" | "light";
}

export function MusicToggle({ variant = "dark" }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    // Play by default; only respect stored preference if user has set it before
    const shouldPlay = stored === null ? true : stored === "true";
    setIsPlaying(shouldPlay);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audioRef.current = audio;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
    localStorage.setItem(STORAGE_KEY, String(isPlaying));
  }, [isPlaying, mounted]);

  const toggle = () => setIsPlaying((p) => !p);

  if (!mounted) return null;

  const buttonClass =
    variant === "light"
      ? "flex items-center justify-center size-10 rounded-full bg-slate-700/90 hover:bg-slate-600 border border-slate-600 text-white transition-colors"
      : "flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors";

  return (
    <button
      type="button"
      onClick={toggle}
      className={buttonClass}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      <span className="material-symbols-outlined text-xl">
        {isPlaying ? "pause" : "play_arrow"}
      </span>
    </button>
  );
}

export type MusicToggleVariant = "dark" | "light";
