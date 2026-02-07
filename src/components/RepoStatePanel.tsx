"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { t } from "@/lib/copy";

export function RepoStatePanel() {
  const repository = useGameStore((s) => s.repository);

  const initialized = repository.initialized ?? false;
  const branches = repository.branches ?? [];
  const workingDirectory = repository.workingDirectory ?? [];
  const commits = repository.commits ?? [];
  const stagedFiles = repository.stagedFiles ?? [];

  return (
    <motion.section
      layout
      initial={false}
      animate={{
        boxShadow: initialized
          ? "0 0 0 2px rgba(34, 197, 94, 0.3)"
          : "0 0 0 0px transparent",
      }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden font-mono text-sm"
      aria-label="Repository state"
    >
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {t("repo.title")}
        </span>
        {repository.path && (
          <span className="ml-2 text-slate-500 dark:text-slate-400">
            /{repository.path}
          </span>
        )}
      </div>
      <div className="p-4 space-y-4">
        {!initialized ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400"
          >
            <span className="text-lg" aria-hidden>
              📁
            </span>
            <span>{t("repo.notAGitRepo")}</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("repo.branches")}
              </h4>
              <ul className="space-y-1">
                {branches.map((b) => (
                  <motion.li
                    key={b.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    {b.isHead && (
                      <span
                        className="text-green-600 dark:text-green-400"
                        title={t("repo.currentBranch")}
                      >
                        ●
                      </span>
                    )}
                    <span
                      className={
                        b.isHead
                          ? "text-slate-900 dark:text-white font-medium"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      {b.name}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
            {workingDirectory.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {t("repo.workingDir")}
                </h4>
                <ul className="space-y-1">
                  {workingDirectory.map((f) => (
                    <li key={f.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="text-amber-600 dark:text-amber-400 text-xs">
                        {f.status === "modified" ? t("repo.modified") : t("repo.untracked")}
                      </span>
                      <span>{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stagedFiles.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {t("repo.staged")}
                </h4>
                <ul className="space-y-1">
                  {stagedFiles.map((f) => (
                    <li key={f} className="text-slate-600 dark:text-slate-300">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {t("repo.commits")}
              </h4>
              {commits.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">
                  {t("repo.noCommitsYet")}
                </p>
              ) : (
                <ul className="space-y-1">
                  {commits.map((c) => (
                    <li
                      key={c.id}
                      className="text-slate-600 dark:text-slate-300"
                    >
                      <span className="text-slate-400 dark:text-slate-500">
                        {c.id.slice(0, 7)}
                      </span>{" "}
                      {c.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
