"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import type { GitCommit } from "@/store/gameStore";
import { AvatarPanel } from "@/components/AvatarPanel";
import { RepoStatePanel } from "@/components/RepoStatePanel";
import { QuestPanel } from "@/components/QuestPanel";
import { QuestCompleteOverlay } from "@/components/QuestCompleteOverlay";
import { useT } from "@/lib/copy";
import { XP_PER_QUEST } from "@/store/gameStore";

const LEVEL_ID = "4";

function hasMergeCommit(
  branchCommits: Record<string, GitCommit[]> | undefined,
  commits: GitCommit[]
): boolean {
  if (branchCommits) {
    for (const list of Object.values(branchCommits)) {
      if (list.some((c) => (c.parentIds?.length ?? 0) >= 2)) return true;
    }
  }
  return commits.some((c) => (c.parentIds?.length ?? 0) >= 2);
}

export function Level4Merge() {
  const t = useT();
  const repository = useGameStore((s) => s.repository);
  const mergeState = useGameStore((s) => s.mergeState);
  const mergeBranches = useGameStore((s) => s.mergeBranches);
  const resolveMerge = useGameStore((s) => s.resolveMerge);
  const ensureBranchCommits = useGameStore((s) => s.ensureBranchCommits);
  const addAvatarMessage = useGameStore((s) => s.addAvatarMessage);
  const setAvatarMood = useGameStore((s) => s.setAvatarMood);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const completedLevels = useGameStore((s) => s.completedLevels);

  const welcomeShown = useRef(false);
  const completionShown = useRef(false);
  const conflictMessageShown = useRef(false);
  const [sourceBranch, setSourceBranch] = useState("");
  const [targetBranch, setTargetBranch] = useState("");
  const [showQuestCompleteOverlay, setShowQuestCompleteOverlay] = useState(false);

  const branches = repository.branches ?? [];
  const branchCommits = repository.branchCommits ?? { main: repository.commits ?? [] };

  useEffect(() => {
    if (repository.initialized) ensureBranchCommits();
  }, [repository.initialized, ensureBranchCommits]);

  useEffect(() => {
    if (welcomeShown.current || avatarMessages.length > 0) return;
    welcomeShown.current = true;
    setAvatarMood("encouraging");
    addAvatarMessage({
      text: t("quest.level4.welcome"),
      key: "quest.level4.welcome",
    });
  }, [addAvatarMessage, avatarMessages.length, setAvatarMood, t]);

  const handleMerge = () => {
    const source = sourceBranch.trim();
    const target = targetBranch.trim();
    if (!source || !target) return;
    if (source === target) {
      addAvatarMessage({
        text: t("quest.level4.errorSameBranch"),
        key: "quest.level4.errorSameBranch",
      });
      return;
    }
    const sourceCommits = branchCommits[source] ?? [];
    if (sourceCommits.length === 0) {
      addAvatarMessage({
        text: t("quest.level4.errorNoCommits", { branch: source }),
        key: "quest.level4.errorNoCommits",
      });
      return;
    }
    setAvatarMood("encouraging");
    mergeBranches(source, target);
    // Note: mergeState updates on next render; conflict UI shows when mergeState.conflict is set.
    // No-conflict merge creates merge commit immediately; completion is detected in useEffect below.
    addAvatarMessage({
      text: t("quest.level4.mergeInitiated", { source, target }),
      key: "quest.level4.mergeInitiated",
    });
  };

  // After mergeBranches, mergeState is updated in the next tick; check conflict in UI from state.
  const conflict = mergeState?.conflict ?? null;
  const inMergeConflict = Boolean(conflict);

  useEffect(() => {
    if (inMergeConflict && conflict && !conflictMessageShown.current) {
      conflictMessageShown.current = true;
      addAvatarMessage({
        text: t("quest.level4.conflictDetected"),
        key: "quest.level4.conflictDetected",
      });
    }
    if (!inMergeConflict) conflictMessageShown.current = false;
  }, [inMergeConflict, conflict, addAvatarMessage, t]);

  const handleResolve = (strategy: "keepCurrent" | "useIncoming") => {
    resolveMerge(strategy);
    setAvatarMood("levelComplete");
    addAvatarMessage({
      text: t("quest.level4.mergeResolved"),
      key: "quest.level4.mergeResolved",
    });
    if (!completedLevels[LEVEL_ID]) {
      markLevelComplete(LEVEL_ID);
      setShowQuestCompleteOverlay(true);
    }
  };

  const mergeComplete = hasMergeCommit(
    repository.branchCommits,
    repository.commits ?? []
  );

  // When a merge commit appears (no-conflict merge or after resolve), mark level complete once.
  useEffect(() => {
    if (mergeComplete && !completedLevels[LEVEL_ID] && !completionShown.current) {
      completionShown.current = true;
      setAvatarMood("levelComplete");
      addAvatarMessage({
        text: t("quest.level4.mergeSuccess"),
        key: "quest.level4.mergeSuccess",
      });
      markLevelComplete(LEVEL_ID);
      setShowQuestCompleteOverlay(true);
    }
  }, [mergeComplete, completedLevels, markLevelComplete, addAvatarMessage, setAvatarMood, t]);

  const objectives = [
    {
      id: "merge",
      labelKey: "quest.level4.objectiveMerge",
      completed: mergeComplete,
    },
  ];
  const allComplete = objectives.every((o) => o.completed);
  const questJustCompleted = completedLevels[LEVEL_ID] && allComplete;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <QuestPanel
              titleKey="quest.level4.title"
              subtitleKey="quest.level4.subtitle"
              hintKey="quest.level4.hint"
              objectives={objectives}
              allComplete={allComplete}
              showComplete={questJustCompleted}
              questCompleteKey="quest.level4.questComplete"
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <AvatarPanel />
            <RepoStatePanel />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {inMergeConflict && conflict && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-amber-400 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-4"
              aria-label={t("quest.level4.conflictTitle")}
            >
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                {t("quest.level4.conflictTitle")}
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                {t("quest.level4.conflictExplanation", {
                  source: conflict.sourceBranch,
                  target: conflict.targetBranch,
                })}
              </p>
              <ul className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                {conflict.conflictingFiles.map((f) => (
                  <li key={f} className="font-mono">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  type="button"
                  onClick={() => handleResolve("keepCurrent")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 hover:opacity-90"
                >
                  {t("quest.level4.keepCurrent")}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleResolve("useIncoming")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:opacity-90"
                >
                  {t("quest.level4.useIncoming")}
                </motion.button>
              </div>
            </motion.section>
          )}

          {!inMergeConflict && (
            <section
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
              aria-label={t("quest.level4.mergeSectionLabel")}
            >
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                {t("quest.level4.mergeSectionLabel")}
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  {t("quest.level4.mergeInto")}
                </label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="">{t("quest.level4.selectTarget")}</option>
                  {branches.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {t("quest.level4.fromBranch")}
                </span>
                <select
                  value={sourceBranch}
                  onChange={(e) => setSourceBranch(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                >
                  <option value="">{t("quest.level4.selectSource")}</option>
                  {branches.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  onClick={handleMerge}
                  disabled={!sourceBranch || !targetBranch}
                  whileHover={sourceBranch && targetBranch ? { scale: 1.02 } : {}}
                  whileTap={sourceBranch && targetBranch ? { scale: 0.98 } : {}}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("quest.level4.buttonMerge")}
                </motion.button>
              </div>
            </section>
          )}

          {questJustCompleted && !inMergeConflict && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
            >
              <span aria-hidden>✓</span> {t("quest.level4.questComplete")}
            </motion.span>
          )}
        </div>
      </motion.div>

      <QuestCompleteOverlay
        show={showQuestCompleteOverlay}
        xpEarned={XP_PER_QUEST}
        onDismiss={() => setShowQuestCompleteOverlay(false)}
        isLastLevel
        titleKey="quest.level4.questComplete"
      />
    </>
  );
}
