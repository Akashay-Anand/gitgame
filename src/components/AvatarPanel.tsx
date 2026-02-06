"use client";

import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/copy";
import type { AvatarMood } from "@/store/gameStore";

const MAX_VISIBLE_MESSAGES = 5;

const MOOD_EMOJI: Record<AvatarMood, string> = {
  idle: "🦊",
  encouraging: "💪",
  success: "✨",
  celebrating: "🎉",
  levelComplete: "🏆",
};

function getMoodMessage(mood: AvatarMood): string {
  return t(`avatar.mood.${mood}`);
}

export function AvatarPanel() {
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const avatarMood = useGameStore((s) => s.avatarMood);

  const visibleMessages = avatarMessages.slice(-MAX_VISIBLE_MESSAGES);
  const moodMessage = getMoodMessage(avatarMood);
  const isCelebrating = avatarMood === "celebrating" || avatarMood === "levelComplete";

  return (
    <section
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
      aria-label="Avatar guidance"
    >
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <motion.div
            key={avatarMood}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
              isCelebrating
                ? "bg-amber-400 dark:bg-amber-500"
                : "bg-slate-200 dark:bg-slate-600"
            }`}
            aria-hidden
          >
            {MOOD_EMOJI[avatarMood]}
          </motion.div>
          <div>
            <span className="font-medium text-slate-800 dark:text-slate-200 block">
              {t("avatar.title")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {moodMessage}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 min-h-[120px] flex flex-col justify-end">
        {visibleMessages.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">
            {t("avatar.waiting")}
          </p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence mode="popLayout">
              {visibleMessages.map((msg) => (
                <motion.li
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-700 dark:text-slate-300 text-sm"
                >
                  {msg.text}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
