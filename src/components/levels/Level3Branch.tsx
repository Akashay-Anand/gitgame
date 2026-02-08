"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { AvatarPanel } from "@/components/AvatarPanel";
import { RepoStatePanel } from "@/components/RepoStatePanel";
import { QuestPanel } from "@/components/QuestPanel";
import { QuestCompleteOverlay } from "@/components/QuestCompleteOverlay";
import { useT } from "@/lib/copy";
import { XP_PER_QUEST } from "@/store/gameStore";

const LEVEL_ID = "3";

export function Level3Branch() {
  const t = useT();
  const repository = useGameStore((s) => s.repository);
  const createBranch = useGameStore((s) => s.createBranch);
  const switchBranch = useGameStore((s) => s.switchBranch);
  const ensureBranchCommits = useGameStore((s) => s.ensureBranchCommits);
  const addAvatarMessage = useGameStore((s) => s.addAvatarMessage);
  const setAvatarMood = useGameStore((s) => s.setAvatarMood);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const completedLevels = useGameStore((s) => s.completedLevels);

  const welcomeShown = useRef(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [showQuestCompleteOverlay, setShowQuestCompleteOverlay] = useState(false);

  const branches = repository.branches ?? [];
  const currentBranch =
    repository.currentBranch ??
    repository.branches?.find((b) => b.isHead)?.name ??
    "main";

  // Ensure branch-specific commits when entering Level 3 (e.g. from L2).
  useEffect(() => {
    if (repository.initialized) ensureBranchCommits();
  }, [repository.initialized, ensureBranchCommits]);

  useEffect(() => {
    if (welcomeShown.current || avatarMessages.length > 0) return;
    welcomeShown.current = true;
    setAvatarMood("encouraging");
    addAvatarMessage({
      text: t("quest.level3.welcome"),
      key: "quest.level3.welcome",
    });
  }, [addAvatarMessage, avatarMessages.length, setAvatarMood, t]);

  const handleCreateBranch = () => {
    const name = newBranchName.trim();
    if (!name) return;
    const exists = branches.some(
      (b) => b.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setAvatarMood("idle");
      addAvatarMessage({
        text: t("quest.level3.errorDuplicateBranch", { name }),
        key: "quest.level3.errorDuplicateBranch",
      });
      return;
    }
    createBranch(name);
    setNewBranchName("");
    setAvatarMood("success");
    addAvatarMessage({
      text: t("quest.level3.branchCreated", { name }),
      key: "quest.level3.branchCreated",
    });
  };

  const handleSwitchBranch = (branchName: string) => {
    if (branchName === currentBranch) return;
    switchBranch(branchName);
    setAvatarMood("success");
    addAvatarMessage({
      text: t("quest.level3.switchedBranch", { name: branchName }),
      key: "quest.level3.switchedBranch",
    });
    if (!completedLevels[LEVEL_ID]) {
      const hasCreatedBranch = branches.length >= 2;
      const nowOnNonMain = branchName !== "main";
      if (hasCreatedBranch && nowOnNonMain) {
        markLevelComplete(LEVEL_ID);
        setAvatarMood("levelComplete");
        addAvatarMessage({
          text: t("quest.level3.success"),
          key: "quest.level3.success",
        });
        setShowQuestCompleteOverlay(true);
      }
    }
  };

  const hasCreatedBranch = branches.length >= 2;
  const hasSwitchedToNewBranch =
    hasCreatedBranch && currentBranch !== "main";
  const objectives = [
    {
      id: "create",
      labelKey: "quest.level3.objectiveCreate",
      completed: hasCreatedBranch,
    },
    {
      id: "switch",
      labelKey: "quest.level3.objectiveSwitch",
      completed: hasSwitchedToNewBranch,
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
              titleKey="quest.level3.title"
              subtitleKey="quest.level3.subtitle"
              hintKey="quest.level3.hint"
              objectives={objectives}
              allComplete={allComplete}
              showComplete={questJustCompleted}
              questCompleteKey="quest.level3.questComplete"
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <AvatarPanel />
            <RepoStatePanel />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
            aria-label={t("quest.level3.branchListLabel")}
          >
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              {t("quest.level3.branchListLabel")}
            </h4>
            <ul className="flex flex-wrap gap-2 mb-4">
              {branches.map((b) => (
                <motion.li key={b.name}>
                  <motion.button
                    type="button"
                    onClick={() => handleSwitchBranch(b.name)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                      b.name === currentBranch
                        ? "bg-primary/20 border-primary text-primary dark:text-primary"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {b.isHead && (
                      <span className="mr-1.5 text-green-600 dark:text-green-400" aria-hidden>
                        ●
                      </span>
                    )}
                    {b.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder={t("quest.level3.createPlaceholder")}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm min-w-[140px]"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleCreateBranch()
                }
              />
              <motion.button
                type="button"
                onClick={handleCreateBranch}
                disabled={!newBranchName.trim()}
                whileHover={newBranchName.trim() ? { scale: 1.02 } : {}}
                whileTap={newBranchName.trim() ? { scale: 0.98 } : {}}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("quest.level3.buttonCreateBranch")}
              </motion.button>
            </div>
          </section>

          {questJustCompleted && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
            >
              <span aria-hidden>✓</span> {t("quest.level3.questComplete")}
            </motion.span>
          )}
        </div>
      </motion.div>

      <QuestCompleteOverlay
        show={showQuestCompleteOverlay}
        xpEarned={XP_PER_QUEST}
        onDismiss={() => setShowQuestCompleteOverlay(false)}
        nextLevelId="4"
        titleKey="quest.level3.questComplete"
      />
    </>
  );
}
