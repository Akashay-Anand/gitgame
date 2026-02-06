"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { AvatarPanel } from "@/components/AvatarPanel";
import { RepoStatePanel } from "@/components/RepoStatePanel";

const LEVEL_ID = "1";

export function Level1() {
  const initRepository = useGameStore((s) => s.initRepository);
  const addAvatarMessage = useGameStore((s) => s.addAvatarMessage);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const repository = useGameStore((s) => s.repository);
  const avatarMessages = useGameStore((s) => s.avatarMessages);
  const welcomeShown = useRef(false);

  useEffect(() => {
    if (welcomeShown.current || avatarMessages.length > 0) return;
    welcomeShown.current = true;
    addAvatarMessage({
      text: "Welcome! Your first task is to create a new Git repository. Run git init to initialize one in this folder.",
      key: "level1.welcome",
    });
  }, [addAvatarMessage, avatarMessages.length]);

  const handleInit = () => {
    if (repository.initialized) {
      addAvatarMessage({
        text: "This folder is already a Git repository. You've completed this level!",
        key: "level1.already",
      });
      return;
    }
    initRepository("my-project");
    addAvatarMessage({
      text: "Nice! You've initialized a repository. Git created a .git folder and set up the default branch \"main\". Level complete!",
      key: "level1.success",
    });
    markLevelComplete(LEVEL_ID);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Level 1: Initialize a repository
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Use <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">git init</code> to
          turn this folder into a Git repository.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AvatarPanel />
        <RepoStatePanel />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="button"
          onClick={handleInit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2.5 rounded-lg font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {repository.initialized ? "Already initialized" : "Run git init"}
        </motion.button>
        {repository.initialized && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
          >
            <span aria-hidden>✓</span> Level complete
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
