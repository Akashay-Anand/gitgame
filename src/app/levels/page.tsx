"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { t } from "@/lib/copy";

const LEVEL_IDS = ["1", "2", "3"] as const;
const XP_TARGET = 1000;

/** Background images for level nodes (unlocked state). Optional – gradient used if missing. */
const LEVEL_NODE_IMAGES: Record<string, string> = {
  "1":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDT_oXcrWLsjUFjFCPh9jwGw_wybJNAUbsuisJ4kZERjbsWem_rj69hSRneU8gs5ZBJ7MUCPvreq1eEnFtm92nXJitSv7T9lntdJp0XNHJ_6UUhDk_u5u_MpO2LWjHyLHJr_ILTqU5fy8tXv0PVN-tr_AXtje7fiZbQcxoevxRhslMyU1sMC6Uk_hbcmFEHqJRZco0yGJUggvGHXInRS7hySAtZYKvAJKlu4ycHj7eeG5l1CfZwz25qNYHvwtokvHl2muL1ArMDCkA",
  "2":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAwsGdQlM99WQRzj3-8Wbfld2k3aSBq94tFUmxFclsTf_xhz_lpwdq9t57gPT1sTIaHiKqC4nwxoLXGPTwwv2cWT01jjylfS2cMsxy5Yg-ZoevOAzZ5EwJrKep6saaE94H0xoiLqAzgKpPdbO2AWOKSK0lJ3A3yPe5s5Iek-4_liJmgIFZmajJFC6AE5OwtaMeUGz9kcrj78-QPs-MHjl0X0qLoD-gIs9RB-rr8on8HU_VGobT1nJDqipOIh8XZK_xstl1z0QLUgfY",
  "3":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBIZmvLQ3e8brCJZ4G_vvuXbu12SqunSNvdI6mcR-L4eTKBAZVFJ8s_bDLpRP2QoPhFW0077xT0CCZRf_YTMIiGRECB0DH1jAWXGQIeHOaLZBpBA53Vgk6dzA6GgH0Yqa4EcNazRSYqimjulICcuoaquUc5giI3s3cvEghPbA8ImFKM2NnWyaEu_hmQUXiNyTjMo84_fv81HW5KKGsveKIDlJnsG5LELq2LZSChdJ6H8ky9GG01K0VpdauHn68CNbkaorVMDRQ_MA4",
};

function isLevelUnlocked(
  levelId: string,
  completedLevels: Record<string, boolean>
): boolean {
  if (levelId === "1") return true;
  const prev = String(Number(levelId) - 1);
  return Boolean(completedLevels[prev]);
}

function getCurrentLocationName(
  currentLevel: string,
  completedLevels: Record<string, boolean>
): string {
  const map: Record<string, string> = {
    "1": "levelMap.starterCottage",
    "2": "levelMap.neonForest",
    "3": "levelMap.branching",
  };
  return t(map[currentLevel] || "levelMap.starterCottage");
}

export default function LevelsPage() {
  const completedLevels = useGameStore((s) => s.completedLevels);
  const xp = useGameStore((s) => s.xp);
  const badges = useGameStore((s) => s.badges);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const setLevel = useGameStore((s) => s.setLevel);

  const xpProgress = Math.min(1, xp / XP_TARGET);
  const levelTier = Math.floor(xp / 100) + 1;

  return (
    <div className="dark bg-background-dark text-white min-h-screen flex flex-col font-display">
      {/* Top HUD */}
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
            <span className="text-lg font-bold leading-tight">
              {t("app.name")}
            </span>
          </Link>
          <div className="flex flex-col gap-1 w-48 sm:w-64 bg-background-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>Level {levelTier}</span>
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
          <div className="flex items-center gap-2 bg-background-dark/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-yellow-400 text-2xl">
              local_fire_department
            </span>
            <span className="font-bold tabular-nums">{badges.length}</span>
          </div>
        </div>
      </header>

      {/* Main World Map */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden starfield relative scroll-smooth cursor-grab active:cursor-grabbing min-h-0">
        <div className="absolute inset-0 nebula w-[300%] h-full pointer-events-none min-w-[300%]" />
        <div className="absolute top-1/4 left-1/4 size-64 sm:size-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 size-64 sm:size-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex min-w-[280vw] sm:min-w-[300vw] h-full items-center px-8 sm:px-20 md:px-40 py-24">
          {/* Circuit Path 1 → 2 */}
          <div
            className="absolute top-[55%] left-[12%] w-[28%] h-[2px] circuit-line -rotate-[10deg] hidden sm:block"
            aria-hidden
          />
          {/* Node 1: git init */}
          <LevelNode
            levelId="1"
            labelKey="levelMap.one"
            unlocked={true}
            completed={completedLevels["1"]}
            isCurrent={currentLevel === "1"}
            onSelect={() => setLevel("1")}
            className="relative z-10 mt-16"
          />

          {/* Circuit Path 2 → 3 */}
          <div
            className={`absolute top-[48%] left-[38%] w-[32%] h-[2px] -rotate-[5deg] hidden sm:block ${
              isLevelUnlocked("2", completedLevels) ? "circuit-line" : "circuit-line-locked"
            }`}
            aria-hidden
          />
          {/* Node 2: git add & commit */}
          <LevelNode
            levelId="2"
            labelKey="levelMap.two"
            unlocked={isLevelUnlocked("2", completedLevels)}
            completed={completedLevels["2"]}
            isCurrent={currentLevel === "2"}
            onSelect={() => setLevel("2")}
            className="relative z-10 ml-64 sm:ml-80 md:ml-96 -mt-24 sm:-mt-32"
          />

          {/* Branching paths to 3 */}
          <div
            className="absolute top-[42%] left-[68%] w-[14%] h-[2px] circuit-line-locked -rotate-[25deg] hidden sm:block"
            aria-hidden
          />
          <div
            className="absolute top-[58%] left-[68%] w-[14%] h-[2px] circuit-line-locked rotate-[25deg] hidden sm:block"
            aria-hidden
          />
          {/* Node 3: Locked */}
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

      {/* Bottom HUD */}
      <footer className="fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 flex items-center justify-center pointer-events-none">
        <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 flex flex-col items-end gap-1 bg-background-dark/80 backdrop-blur-md px-4 sm:px-6 py-3 rounded-xl border border-white/10 pointer-events-auto">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            {t("levels.currentLocation")}
          </p>
          <p className="arcade-text text-base sm:text-xl font-bold text-primary">
            {getCurrentLocationName(currentLevel, completedLevels)}
          </p>
        </div>
      </footer>

      {/* Side nav */}
      <div className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        <Link
          href="/"
          className="size-12 rounded-full bg-background-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary/50 transition-colors group"
          aria-label="Home"
        >
          <span className="material-symbols-outlined text-xl group-hover:text-white">
            home
          </span>
        </Link>
        <Link
          href="/play"
          className="size-12 rounded-full bg-background-dark/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary/50 transition-colors group"
          aria-label="Play"
        >
          <span className="material-symbols-outlined text-xl group-hover:text-white">
            play_circle
          </span>
        </Link>
      </div>
    </div>
  );
}

interface LevelNodeProps {
  levelId: string;
  labelKey: string;
  unlocked: boolean;
  completed: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  className?: string;
}

function LevelNode({
  levelId,
  labelKey,
  unlocked,
  completed,
  isCurrent,
  onSelect,
  className = "",
}: LevelNodeProps) {
  const content = (
    <div className={`group ${className}`}>
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-100 group-hover:scale-110 transition-transform whitespace-nowrap z-20">
        <span
          className={`arcade-text font-bold text-xs sm:text-sm px-3 py-1 rounded border bg-black/60 ${
            unlocked ? "border-white/20" : "border-white/20 opacity-50"
          }`}
        >
          {t(labelKey)}
        </span>
      </div>
      <div
        className={`relative size-32 sm:size-40 rounded-2xl sm:rounded-3xl bg-contain bg-no-repeat bg-center drop-shadow-[0_0_20px_rgba(37,140,244,0.3)] ${
          unlocked
            ? "border-2 border-primary/50"
            : "grayscale contrast-125 opacity-40 border border-white/10"
        }`}
        style={
          LEVEL_NODE_IMAGES[levelId]
            ? {
                backgroundImage:
                  unlocked
                    ? `linear-gradient(to bottom right, rgba(37, 140, 244, 0.2), rgba(30, 58, 138, 0.3)), url("${LEVEL_NODE_IMAGES[levelId]}")`
                    : `url("${LEVEL_NODE_IMAGES[levelId]}")`,
              }
            : unlocked
              ? {
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(37, 140, 244, 0.3), rgba(30, 58, 138, 0.4))",
                }
              : undefined
        }
      >
        {unlocked && isCurrent && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="size-10 sm:size-12 rounded-full bg-primary/90 border-2 border-white flex items-center justify-center text-lg">
              🦊
            </div>
            <div className="size-2 bg-primary rounded-full animate-ping mt-1" />
          </div>
        )}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-4xl sm:text-5xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)">
              lock
            </span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        {unlocked ? (
          <span
            className="material-symbols-outlined text-primary text-2xl sm:text-3xl block"
            aria-label={completed ? t("levels.completed") : t("levels.play")}
          >
            {completed ? "check_circle" : "play_circle"}
          </span>
        ) : (
          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">
            {t("levels.locked")}
          </p>
        )}
      </div>
    </div>
  );

  if (unlocked) {
    return (
      <Link href="/play" onClick={onSelect} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
