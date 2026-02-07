"use client";

import { motion } from "framer-motion";
import { t } from "@/lib/copy";

export interface QuestObjective {
  id: string;
  labelKey: string;
  completed: boolean;
}

interface QuestPanelProps {
  titleKey: string;
  subtitleKey: string;
  hintKey: string;
  objectives: QuestObjective[];
  allComplete: boolean;
  /** When true, show celebration state */
  showComplete?: boolean;
}

export function QuestPanel({
  titleKey,
  subtitleKey,
  hintKey,
  objectives,
  allComplete,
  showComplete = false,
}: QuestPanelProps) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
      aria-label="Quest"
    >
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Quest
          </span>
          {showComplete && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-medium text-green-600 dark:text-green-400"
            >
              ✓ {t("quest.level1.questComplete")}
            </motion.span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-0.5">
          {t(titleKey)}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {t(subtitleKey)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          {t(hintKey)}
        </p>
        <ul className="space-y-2" role="list">
          {objectives.map((obj, i) => (
            <motion.li
              key={obj.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 text-sm"
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                  obj.completed
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-400"
                }`}
                aria-hidden
              >
                {obj.completed ? "✓" : "○"}
              </span>
              <span
                className={
                  obj.completed
                    ? "text-slate-500 dark:text-slate-400 line-through"
                    : "text-slate-800 dark:text-slate-200"
                }
              >
                {t(obj.labelKey)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
