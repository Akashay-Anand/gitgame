"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/copy";
import { useGameStore } from "@/store/gameStore";
import { MusicToggle } from "@/components/MusicToggle";

export default function HomePage() {
  const t = useT();
  const xp = useGameStore((s) => s.xp);
  const badges = useGameStore((s) => s.badges);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <MusicToggle variant="light" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          {t("app.name")}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {t("app.tagline")}
        </p>
        {(xp > 0 || badges.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-4 mb-6 text-sm"
          >
            {xp > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {xp} {t("progression.xp")}
              </span>
            )}
            {badges.length > 0 && (
              <span className="text-slate-500 dark:text-slate-400" title={t("progression.firstStepsDesc")}>
                🏅 {t("progression.firstSteps")}
              </span>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/play"
            className="px-6 py-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
          >
            {t("home.startPlaying")}
          </Link>
          <Link
            href="/levels"
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {t("home.viewLevels")}
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
