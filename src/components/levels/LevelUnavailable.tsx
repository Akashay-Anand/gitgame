"use client";

import Link from "next/link";
import { useT } from "@/lib/copy";

interface LevelUnavailableProps {
  levelId: string;
}

export function LevelUnavailable({ levelId }: LevelUnavailableProps) {
  const t = useT();
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center">
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        {t("levels.levelUnavailable", { level: levelId })}
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
