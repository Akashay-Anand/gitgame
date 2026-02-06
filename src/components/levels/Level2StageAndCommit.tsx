"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { AvatarPanel } from "@/components/AvatarPanel";
import { RepoStatePanel } from "@/components/RepoStatePanel";
import { QuestPanel } from "@/components/QuestPanel";
import { QuestCompleteOverlay } from "@/components/QuestCompleteOverlay";
import { t } from "@/lib/copy";
import { XP_PER_QUEST } from "@/store/gameStore";
import type { WorkingDirectoryFile } from "@/store/gameStore";

const LEVEL_ID = "2";

const DEFAULT_WORKING_FILES: WorkingDirectoryFile[] = [
  { name: "README.md", status: "modified" },
];

export function Level2StageAndCommit() {
  const repository = useGameStore((s) => s.repository);
  const stageFile = useGameStore((s) => s.stageFile);
  const unstageFile = useGameStore((s) => s.unstageFile);
  const commit = useGameStore((s) => s.commit);
  const setWorkingDirectory = useGameStore((s) => s.setWorkingDirectory);
  const addAvatarMessage = useGameStore((s) => s.addAvatarMessage);
  const setAvatarMood = useGameStore((s) => s.setAvatarMood);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const completedLevels = useGameStore((s) => s.completedLevels);

  const welcomeShown = useRef(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [showQuestCompleteOverlay, setShowQuestCompleteOverlay] = useState(false);

  const workingDirectory = repository.workingDirectory ?? [];
  const stagedFiles = repository.stagedFiles ?? [];
  const commits = repository.commits ?? [];

  // Seed working directory when entering Level 2 with empty repo state (first time)
  useEffect(() => {
    if (
      repository.initialized &&
      workingDirectory.length === 0 &&
      commits.length === 0
    ) {
      setWorkingDirectory(DEFAULT_WORKING_FILES);
    }
  }, [repository.initialized, workingDirectory.length, commits.length, setWorkingDirectory]);

  useEffect(() => {
    if (welcomeShown.current || avatarMessages.length > 0) return;
    welcomeShown.current = true;
    setAvatarMood("encouraging");
    addAvatarMessage({
      text: t("quest.level2.welcome"),
      key: "quest.level2.welcome",
    });
  }, [addAvatarMessage, avatarMessages.length, setAvatarMood]);

  const handleStage = (fileName: string) => {
    setAvatarMood("success");
    stageFile(fileName);
    addAvatarMessage({
      text: t("quest.level2.staged"),
      key: "quest.level2.staged",
    });
  };

  const handleUnstage = (fileName: string) => {
    unstageFile(fileName);
  };

  const handleCommit = () => {
    const msg = commitMessage.trim();
    if (!msg) return;
    if (stagedFiles.length === 0) return;
    setAvatarMood("success");
    commit(msg);
    setCommitMessage("");
    addAvatarMessage({
      text: t("quest.level2.success"),
      key: "quest.level2.success",
    });
    if (!completedLevels[LEVEL_ID]) {
      markLevelComplete(LEVEL_ID);
      setShowQuestCompleteOverlay(true);
    }
  };

  const objectiveStageComplete =
    DEFAULT_WORKING_FILES.every((f) => stagedFiles.includes(f.name)) ||
    (stagedFiles.length > 0 && workingDirectory.every((f) => stagedFiles.includes(f.name)));
  const objectiveCommitComplete = commits.length >= 1;
  const objectives = [
    {
      id: "stage",
      labelKey: "quest.level2.objectiveStage",
      completed: objectiveStageComplete,
    },
    {
      id: "commit",
      labelKey: "quest.level2.objectiveCommit",
      completed: objectiveCommitComplete,
    },
  ];
  const allComplete = objectives.every((o) => o.completed);
  const questJustCompleted = completedLevels[LEVEL_ID] && allComplete;

  const canCommit = stagedFiles.length > 0 && commitMessage.trim().length > 0;

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
              titleKey="quest.level2.title"
              subtitleKey="quest.level2.subtitle"
              hintKey="quest.level2.hint"
              objectives={objectives}
              allComplete={allComplete}
              showComplete={questJustCompleted}
            />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <AvatarPanel />
            <RepoStatePanel />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap items-start">
          {workingDirectory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {workingDirectory.map((f) => (
                <motion.button
                  key={f.name}
                  type="button"
                  onClick={() => handleStage(f.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                  {t("quest.level2.buttonStage")} {f.name}
                </motion.button>
              ))}
            </div>
          )}
          {stagedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {stagedFiles.map((f) => (
                <motion.button
                  key={f}
                  type="button"
                  onClick={() => handleUnstage(f)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t("quest.level2.buttonUnstage")} {f}
                </motion.button>
              ))}
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder={t("quest.level2.commitPlaceholder")}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm min-w-[180px]"
                onKeyDown={(e) => e.key === "Enter" && handleCommit()}
              />
              <motion.button
                type="button"
                onClick={handleCommit}
                disabled={!canCommit}
                whileHover={canCommit ? { scale: 1.02 } : {}}
                whileTap={canCommit ? { scale: 0.98 } : {}}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("quest.level2.buttonCommit")}
              </motion.button>
            </div>
          )}
        </div>
        {questJustCompleted && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
          >
            <span aria-hidden>✓</span> {t("quest.level2.questComplete")}
          </motion.span>
        )}
      </motion.div>

      <QuestCompleteOverlay
        show={showQuestCompleteOverlay}
        xpEarned={XP_PER_QUEST}
        onDismiss={() => setShowQuestCompleteOverlay(false)}
      />
    </>
  );
}
