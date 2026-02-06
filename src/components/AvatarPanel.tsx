"use client";

import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";

const MAX_VISIBLE_MESSAGES = 5;

export function AvatarPanel() {
  const avatarMessages = useGameStore((s) => s.avatarMessages);

  const visibleMessages = avatarMessages.slice(-MAX_VISIBLE_MESSAGES);

  return (
    <section
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
      aria-label="Avatar guidance"
    >
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center text-lg"
            aria-hidden
          >
            🦊
          </div>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Git Guide
          </span>
        </div>
      </div>
      <div className="p-4 min-h-[120px] flex flex-col justify-end">
        {visibleMessages.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">
            Waiting for instructions…
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
