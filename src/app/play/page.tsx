"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { Level1, Level2StageAndCommit } from "@/components/levels";
import { t } from "@/lib/copy";

function LevelRouter() {
  const currentLevel = useGameStore((s) => s.currentLevel);

  switch (currentLevel) {
    case "1":
      return <Level1 />;
    case "2":
      return <Level2StageAndCommit />;
    default:
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t("levels.levelUnavailable", { level: currentLevel })}
          </p>
          <Link
            href="/levels"
            className="text-slate-900 dark:text-white font-medium underline hover:no-underline"
          >
            {t("levels.viewAvailableLevels")}
          </Link>
        </div>
      );
  }
}

export default function PlayPage() {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const xp = useGameStore((s) => s.xp);

  return (
    <main className="min-h-screen p-6 sm:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("play.title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
              {t("nav.level")} {currentLevel}
              {xp > 0 && (
                <span className="ml-2 text-amber-600 dark:text-amber-400">
                  · {xp} {t("progression.xp")}
                </span>
              )}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.back")}
          </Link>
        </div>

        <LevelRouter />
      </motion.div>
    </main>
  );
}
