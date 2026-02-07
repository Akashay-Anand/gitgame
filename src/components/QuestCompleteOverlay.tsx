"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/copy";

interface QuestCompleteOverlayProps {
  show: boolean;
  xpEarned: number;
  onDismiss?: () => void;
}

export function QuestCompleteOverlay({ show, xpEarned, onDismiss }: QuestCompleteOverlayProps) {
  const t = useT();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          aria-modal="true"
          aria-label="Quest complete"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 shadow-2xl p-8 max-w-sm w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 12 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center text-4xl"
            >
              🏆
            </motion.div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t("quest.level1.questComplete")}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-amber-600 dark:text-amber-400 font-medium mb-6"
            >
              {t("progression.xpEarned", { amount: String(xpEarned) })}
            </motion.p>
            {onDismiss && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={onDismiss}
                className="px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90"
              >
                Continue
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
