"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { useT } from "@/lib/copy";
import { XP_TARGET, isLevelUnlocked, getCurrentLocationKey } from "@/lib/levels";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LevelNode } from "@/components/levels";

export default function LevelsPage() {
  const t = useT();
  const completedLevels = useGameStore((s) => s.completedLevels);
  const xp = useGameStore((s) => s.xp);
  const badges = useGameStore((s) => s.badges);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const setLevel = useGameStore((s) => s.setLevel);

  const xpProgress = Math.min(1, xp / XP_TARGET);
  const levelTier = Math.floor(xp / 100) + 1;

  return (
    <div className="dark bg-background-dark text-white min-h-screen flex flex-col font-display">
      <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-3 bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:border-primary/50 transition-colors"
          >
            <span className="text-primary">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                account_tree
              </span>
            </span>
            <span className="text-lg font-bold leading-tight">{t("app.name")}</span>
          </Link>
          <div className="flex flex-col gap-1 w-48 sm:w-64 bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>{t("levels.levelTier", { tier: levelTier })}</span>
              <span className="text-primary">
                {xp}/{XP_TARGET} {t("progression.xp")}
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(xpProgress * 100)}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <LanguageSwitch />
          <div className="flex items-center gap-2 bg-background-dark/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-yellow-400 text-2xl">
              local_fire_department
            </span>
            <span className="font-bold tabular-nums">{badges.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden starfield relative scroll-smooth cursor-grab active:cursor-grabbing min-h-0">
        <div className="absolute inset-0 nebula w-[300%] h-full pointer-events-none min-w-[300%]" />
        <div className="absolute top-1/4 left-1/4 size-64 sm:size-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 size-64 sm:size-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex min-w-[280vw] sm:min-w-[300vw] h-full items-center px-8 sm:px-20 md:px-40 py-24">
          <div
            className="absolute top-[55%] left-[12%] w-[28%] h-[2px] circuit-line -rotate-[10deg] hidden sm:block"
            aria-hidden
          />
          <LevelNode
            levelId="1"
            labelKey="levelMap.one"
            unlocked
            completed={completedLevels["1"]}
            isCurrent={currentLevel === "1"}
            onSelect={() => setLevel("1")}
            className="relative z-10 mt-16"
          />

          <div
            className={`absolute top-[48%] left-[38%] w-[32%] h-[2px] -rotate-[5deg] hidden sm:block ${
              isLevelUnlocked("2", completedLevels) ? "circuit-line" : "circuit-line-locked"
            }`}
            aria-hidden
          />
          <LevelNode
            levelId="2"
            labelKey="levelMap.two"
            unlocked={isLevelUnlocked("2", completedLevels)}
            completed={completedLevels["2"]}
            isCurrent={currentLevel === "2"}
            onSelect={() => setLevel("2")}
            className="relative z-10 ml-64 sm:ml-80 md:ml-96 -mt-24 sm:-mt-32"
          />

          <div
            className="absolute top-[42%] left-[68%] w-[14%] h-[2px] circuit-line-locked -rotate-[25deg] hidden sm:block"
            aria-hidden
          />
          <div
            className="absolute top-[58%] left-[68%] w-[14%] h-[2px] circuit-line-locked rotate-[25deg] hidden sm:block"
            aria-hidden
          />
          <LevelNode
            levelId="3"
            labelKey="levelMap.three"
            unlocked={false}
            completed={false}
            isCurrent={false}
            onSelect={() => {}}
            className="relative z-10 ml-auto mr-[15%]"
          />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 flex items-center justify-center pointer-events-none">
        <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 flex flex-col items-end gap-1 bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 py-3 rounded-xl border border-white/10 pointer-events-auto">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            {t("levels.currentLocation")}
          </p>
          <p className="arcade-text text-base sm:text-xl font-bold text-primary">
            {t(getCurrentLocationKey(currentLevel))}
          </p>
        </div>
      </footer>

      <div className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        <Link
          href="/"
          className="size-12 rounded-full bg-background-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary/50 transition-colors group"
          aria-label={t("nav.home")}
        >
          <span className="material-symbols-outlined text-xl group-hover:text-white">
            home
          </span>
        </Link>
        <Link
          href="/play"
          className="size-12 rounded-full bg-background-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary/50 transition-colors group"
          aria-label={t("nav.play")}
        >
          <span className="material-symbols-outlined text-xl group-hover:text-white">
            play_circle
          </span>
        </Link>
      </div>
    </div>
  );
}
