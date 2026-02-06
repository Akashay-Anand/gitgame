"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { t } from "@/lib/copy";

const LEVEL_IDS = ["1", "2", "3"] as const;
const LEVEL_NAMES: Record<string, string> = {
  "1": "levelList.one",
  "2": "levelList.two",
  "3": "levelList.three",
};

function isLevelUnlocked(levelId: string, completedLevels: Record<string, boolean>): boolean {
  if (levelId === "1") return true;
  const prev = String(Number(levelId) - 1);
  return Boolean(completedLevels[prev]);
}

export default function LevelsPage() {
  const completedLevels = useGameStore((s) => s.completedLevels);
  const xp = useGameStore((s) => s.xp);
  const badges = useGameStore((s) => s.badges);

  return (
    <main className="min-h-screen p-6 sm:p-8 bg-slate-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("levels.title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              {t("levels.description")}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {t("nav.back")}
          </Link>
        </div>

        <div className="flex gap-4 mb-8 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold tabular-nums">{xp}</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {t("progression.xp")}
            </span>
          </div>
          {badges.length > 0 && (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-600 pl-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t("progression.badges")}
              </span>
              <span className="text-lg" title={t("progression.firstStepsDesc")}>
                🏅
              </span>
            </div>
          )}
        </div>

        <ul className="space-y-3">
          {LEVEL_IDS.map((levelId, i) => {
            const unlocked = isLevelUnlocked(levelId, completedLevels);
            const completed = completedLevels[levelId];
            const nameKey = LEVEL_NAMES[levelId];

            return (
              <motion.li
                key={levelId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border overflow-hidden ${
                  unlocked
                    ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {unlocked ? (
                      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                        {levelId}
                      </span>
                    ) : (
                      <span
                        className="flex-shrink-0 w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400"
                        aria-label={t("levels.locked")}
                      >
                        🔒
                      </span>
                    )}
                    <span
                      className={
                        unlocked
                          ? "font-medium text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      {t(nameKey)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {completed && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ {t("levels.completed")}
                      </span>
                    )}
                    {unlocked ? (
                      <Link
                        href="/play"
                        onClick={() => useGameStore.getState().setLevel(levelId)}
                        className="text-sm font-medium text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {t("levels.play")}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400">
                        {t("levels.locked")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </main>
  );
}
