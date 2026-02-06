"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { Level1 } from "@/components/levels";

function LevelRouter() {
  const currentLevel = useGameStore((s) => s.currentLevel);

  switch (currentLevel) {
    case "1":
      return <Level1 />;
    default:
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Level {currentLevel} is not available yet.
          </p>
          <Link
            href="/levels"
            className="text-slate-900 dark:text-white font-medium underline hover:no-underline"
          >
            View available levels
          </Link>
        </div>
      );
  }
}

export default function PlayPage() {
  const currentLevel = useGameStore((s) => s.currentLevel);

  return (
    <main className="min-h-screen p-6 sm:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              GitQuest
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
              Level {currentLevel}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            ← Home
          </Link>
        </div>

        <LevelRouter />
      </motion.div>
    </main>
  );
}
