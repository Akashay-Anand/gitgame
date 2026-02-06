"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export default function LevelsPage() {
  const completedLevels = useGameStore((s) => s.completedLevels);

  return (
    <main className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4">Levels</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Future levels will be listed here. Progress is saved in the game store.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="font-mono text-sm bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
              Level 1
            </span>
            {completedLevels["1"] ? (
              <span className="text-green-600 dark:text-green-400">✓ Done</span>
            ) : (
              <span className="text-slate-500">Not started</span>
            )}
          </li>
        </ul>
      </motion.div>
    </main>
  );
}
