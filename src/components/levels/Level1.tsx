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

const LEVEL_ID = "1";

export function Level1() {
  const t = useT();
  const initRepository = useGameStore((s) => s.initRepository);
  const addAvatarMessage = useGameStore((s) => s.addAvatarMessage);
  const setAvatarMood = useGameStore((s) => s.setAvatarMood);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const repository = useGameStore((s) => s.repository);
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const welcomeShown = useRef(false);
  const [showQuestCompleteOverlay, setShowQuestCompleteOverlay] = useState(false);

  useEffect(() => {
    if (welcomeShown.current || avatarMessages.length > 0) return;
    welcomeShown.current = true;
    setAvatarMood("encouraging");
    addAvatarMessage({
      text: t("quest.level1.welcome"),
      key: "quest.level1.welcome",
    });
  }, [addAvatarMessage, avatarMessages.length, setAvatarMood]);

  const handleInit = () => {
    if (repository.initialized) {
      setAvatarMood("levelComplete");
      addAvatarMessage({
        text: t("quest.level1.already"),
        key: "quest.level1.already",
      });
      return;
    }
    setAvatarMood("success");
    initRepository("my-project");
    addAvatarMessage({
      text: t("quest.level1.success"),
      key: "quest.level1.success",
    });
    markLevelComplete(LEVEL_ID);
    setShowQuestCompleteOverlay(true);
  };

  const objectives = [
    {
      id: "init",
      labelKey: "quest.level1.objectiveInit",
      completed: repository.initialized ?? false,
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
              titleKey="quest.level1.title"
              subtitleKey="quest.level1.subtitle"
              hintKey="quest.level1.hint"
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

        <div className="flex flex-wrap items-center gap-4">
          <motion.button
            type="button"
            onClick={handleInit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {repository.initialized
              ? t("quest.level1.buttonAlreadyInit")
              : t("quest.level1.buttonInit")}
          </motion.button>
          {repository.initialized && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
            >
              <span aria-hidden>✓</span> {t("quest.level1.questComplete")}
            </motion.span>
          )}
        </div>
      </motion.div>

      <QuestCompleteOverlay
        show={showQuestCompleteOverlay}
        xpEarned={XP_PER_QUEST}
        onDismiss={() => setShowQuestCompleteOverlay(false)}
      />
    </>
  );
}
