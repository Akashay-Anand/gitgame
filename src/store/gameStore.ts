import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LevelId = string;

export interface GitBranch {
  name: string;
  isHead: boolean;
}

export type WorkingDirectoryFileStatus = "modified" | "untracked";

export interface WorkingDirectoryFile {
  name: string;
  status: WorkingDirectoryFileStatus;
}

export interface GitCommit {
  id: string;
  message: string;
  /** Files included in this commit (optional for backward compatibility) */
  files?: string[];
  /** Parent commit id (if any). For merge commits, use parentIds. */
  parentId?: string;
  /** Merge commit: two parents (target head, source head) */
  parentIds?: string[];
}

export interface RepositoryState {
  /** Simulated repo path or name for the level */
  path: string;
  /** Optional: branch or ref the level is on */
  branch?: string;
  /** Whether the repo has been initialized (git init) */
  initialized: boolean;
  /** Branches; after init, has at least "main" */
  branches: GitBranch[];
  /** Commit history (empty after init). Used when branchCommits not set (L1/L2). */
  commits: GitCommit[];
  /** Commit history per branch (L3+). When set, commits for current branch = branchCommits[currentBranch]. */
  branchCommits?: Record<string, GitCommit[]>;
  /** Current branch name (L3+). Derivable from branches[].isHead but stored for clarity. */
  currentBranch?: string;
  /** Staged file paths (git add) */
  stagedFiles: string[];
  /** Working directory: files with change status (modified, untracked) */
  workingDirectory: WorkingDirectoryFile[];
}

/** Merge conflict state (Level 4). When set, merge is paused until user resolves. */
export interface MergeConflictState {
  sourceBranch: string;
  targetBranch: string;
  conflictingFiles: string[];
}

/** In-progress merge state: either no conflict (merge can complete) or conflict (needs resolution). */
export interface MergeState {
  sourceBranch: string;
  targetBranch: string;
  conflict: MergeConflictState | null;
}

export interface AvatarMessage {
  id: string;
  text: string;
  /** For future i18n: translation key */
  key?: string;
  timestamp?: number;
}

export type AvatarMood = "idle" | "encouraging" | "success" | "celebrating" | "levelComplete";

export interface BadgeProgress {
  id: string;
  unlockedAt: number;
}

export interface GameState {
  /** Current level id (e.g. "1", "2") */
  currentLevel: LevelId;
  /** Level completion: levelId -> completed */
  completedLevels: Record<LevelId, boolean>;
  /** Repository state for the current level */
  repository: RepositoryState;
  /** Active merge state (Level 4). Null when not merging. */
  mergeState: MergeState | null;
  /** Messages from the in-game avatar / guide */
  avatarMessages: AvatarMessage[];
  /** Player XP (earned from completing quests) */
  xp: number;
  /** Unlocked badges */
  badges: BadgeProgress[];
  /** Avatar emotional state for UI feedback */
  avatarMood: AvatarMood;
}

export const XP_PER_QUEST = 100;
const BADGE_FIRST_STEPS = "first_steps";

export interface GameActions {
  setLevel: (levelId: LevelId) => void;
  markLevelComplete: (levelId: LevelId) => void;
  setRepository: (repo: Partial<RepositoryState>) => void;
  /** Level 1: initialize repository (git init) */
  initRepository: (path?: string) => void;
  /** Stage a file (git add) */
  stageFile: (path: string) => void;
  /** Unstage a file */
  unstageFile: (path: string) => void;
  /** Create a commit from staged files (git commit) */
  commit: (message: string) => void;
  /** Seed working directory for Level 2 (modified/untracked files) */
  setWorkingDirectory: (files: WorkingDirectoryFile[]) => void;
  /** Level 3: create a new branch (no-op if name already exists). */
  createBranch: (branchName: string) => void;
  /** Level 3: switch current branch. Commits after switch only affect the new branch. */
  switchBranch: (branchName: string) => void;
  /** Level 4: merge source into target. Sets mergeState; may set conflict. */
  mergeBranches: (sourceBranch: string, targetBranch: string) => void;
  /** Level 4: resolve conflict by keeping target version or using source version, then complete merge. */
  resolveMerge: (strategy: "keepCurrent" | "useIncoming") => void;
  /** Level 3/4: ensure repo has branchCommits (migrate from flat commits if needed). */
  ensureBranchCommits: () => void;
  addAvatarMessage: (message: Omit<AvatarMessage, "id" | "timestamp">) => void;
  clearAvatarMessages: () => void;
  setAvatarMood: (mood: AvatarMood) => void;
  grantXp: (amount: number) => void;
  unlockBadge: (id: string) => void;
  resetProgress: () => void;
}

const defaultRepoState: RepositoryState = {
  path: "",
  branch: "main",
  initialized: false,
  branches: [],
  commits: [],
  stagedFiles: [],
  workingDirectory: [],
};

const initialState: GameState = {
  currentLevel: "1",
  completedLevels: {},
  repository: { ...defaultRepoState },
  mergeState: null,
  avatarMessages: [],
  xp: 0,
  badges: [],
  avatarMood: "idle",
};

const STORAGE_KEY = "gitquest-progress";

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      setLevel: (levelId) =>
        set((state) => ({ ...state, currentLevel: levelId })),

      markLevelComplete: (levelId) =>
        set((state) => {
          const completedLevels = {
            ...state.completedLevels,
            [levelId]: true,
          };
          const xp = state.xp + XP_PER_QUEST;
          const badges = state.badges.some((b) => b.id === BADGE_FIRST_STEPS)
            ? state.badges
            : [...state.badges, { id: BADGE_FIRST_STEPS, unlockedAt: Date.now() }];
          return {
            ...state,
            completedLevels,
            xp,
            badges,
            avatarMood: "celebrating" as const,
          };
        }),

      setRepository: (repo) =>
        set((state) => ({
          ...state,
          repository: { ...state.repository, ...repo },
        })),

      initRepository: (path = "my-project") =>
        set((state) => {
          if (state.repository.initialized) return state;
          return {
            ...state,
            repository: {
              ...state.repository,
              path: path || state.repository.path,
              branch: "main",
              initialized: true,
              branches: [{ name: "main", isHead: true }],
              commits: [],
              branchCommits: { main: [] },
              currentBranch: "main",
              stagedFiles: [],
              workingDirectory: state.repository.workingDirectory ?? [],
            },
          };
        }),

      stageFile: (path) =>
        set((state) => {
          const repo = state.repository;
          const workingDir = repo.workingDirectory ?? [];
          if (repo.stagedFiles.includes(path)) return state;
          if (!workingDir.some((f) => f.name === path)) return state;
          return {
            ...state,
            repository: {
              ...repo,
              stagedFiles: [...repo.stagedFiles, path],
            },
          };
        }),

      unstageFile: (path) =>
        set((state) => ({
          ...state,
          repository: {
            ...state.repository,
            stagedFiles: state.repository.stagedFiles.filter((p) => p !== path),
          },
        })),

      commit: (message) =>
        set((state) => {
          const repo = state.repository;
          if (repo.stagedFiles.length === 0) return state;
          const currentBranch = repo.currentBranch ?? (repo.branches?.find((b) => b.isHead)?.name ?? "main");
          const branchCommits = repo.branchCommits ?? {};
          const commitsForBranch = branchCommits[currentBranch] ?? repo.commits ?? [];
          const headCommit = commitsForBranch[commitsForBranch.length - 1];
          const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
          const newCommit: GitCommit = {
            id,
            message,
            files: [...repo.stagedFiles],
            parentId: headCommit?.id ?? undefined,
          };
          const workingDir = (repo.workingDirectory ?? []).filter(
            (f) => !repo.stagedFiles.includes(f.name)
          );
          const nextBranchCommits = { ...branchCommits, [currentBranch]: [...commitsForBranch, newCommit] };
          return {
            ...state,
            repository: {
              ...repo,
              branchCommits: nextBranchCommits,
              // When using branchCommits, keep flat commits unchanged for backward compat; else append.
              commits: repo.branchCommits ? (repo.commits ?? []) : [...(repo.commits ?? []), newCommit],
              stagedFiles: [],
              workingDirectory: workingDir,
            },
          };
        }),

      setWorkingDirectory: (files) =>
        set((state) => ({
          ...state,
          repository: {
            ...state.repository,
            workingDirectory: files,
          },
        })),

      // Level 3: ensure repo has branchCommits (e.g. when entering L3 from L2 with flat commits).
      ensureBranchCommits: () =>
        set((state) => {
          const repo = state.repository;
          if (repo.branchCommits && Object.keys(repo.branchCommits).length > 0) return state;
          const currentBranch = repo.currentBranch ?? repo.branches?.find((b) => b.isHead)?.name ?? "main";
          const existing = (repo.branchCommits ?? {})[currentBranch] ?? repo.commits ?? [];
          const branchCommits: Record<string, GitCommit[]> = {};
          for (const b of repo.branches ?? []) {
            branchCommits[b.name] = b.name === currentBranch ? existing : [];
          }
          if (repo.branches?.length === 0) branchCommits.main = existing;
          return {
            ...state,
            repository: {
              ...repo,
              branchCommits: Object.keys(branchCommits).length > 0 ? branchCommits : { main: existing },
              currentBranch: repo.branches?.length ? currentBranch : "main",
            },
          };
        }),

      createBranch: (branchName) =>
        set((state) => {
          const repo = state.repository;
          const name = branchName.trim();
          if (!name) return state;
          const exists = (repo.branches ?? []).some((b) => b.name.toLowerCase() === name.toLowerCase());
          if (exists) return state;
          const currentBranch = repo.currentBranch ?? repo.branches?.find((b) => b.isHead)?.name ?? "main";
          const branchCommits = repo.branchCommits ?? { main: repo.commits ?? [] };
          const sourceCommits = branchCommits[currentBranch] ?? [];
          const newBranches = [...(repo.branches ?? []), { name, isHead: false }];
          return {
            ...state,
            repository: {
              ...repo,
              branches: newBranches,
              branchCommits: { ...branchCommits, [name]: [...sourceCommits] },
              currentBranch: repo.currentBranch ?? currentBranch,
            },
          };
        }),

      switchBranch: (branchName) =>
        set((state) => {
          const repo = state.repository;
          const exists = (repo.branches ?? []).some((b) => b.name === branchName);
          if (!exists) return state;
          const branches = (repo.branches ?? []).map((b) =>
            b.name === branchName ? { ...b, isHead: true } : { ...b, isHead: false }
          );
          return {
            ...state,
            repository: {
              ...repo,
              branches,
              currentBranch: branchName,
            },
          };
        }),

      mergeBranches: (sourceBranch, targetBranch) =>
        set((state) => {
          const repo = state.repository;
          const branchCommits = repo.branchCommits ?? { main: repo.commits ?? [] };
          const targetCommits = branchCommits[targetBranch] ?? [];
          const sourceCommits = branchCommits[sourceBranch] ?? [];
          const targetHead = targetCommits[targetCommits.length - 1];
          const sourceHead = sourceCommits[sourceCommits.length - 1];
          if (!sourceHead) return state;
          // Simple conflict: same file changed in both branches.
          const sourceFiles = new Set<string>();
          sourceCommits.forEach((c) => (c.files ?? []).forEach((f) => sourceFiles.add(f)));
          const targetFiles = new Set<string>();
          targetCommits.forEach((c) => (c.files ?? []).forEach((f) => targetFiles.add(f)));
          const conflictingFiles = [...sourceFiles].filter((f) => targetFiles.has(f));
          const conflict: MergeConflictState | null =
            conflictingFiles.length > 0
              ? { sourceBranch, targetBranch, conflictingFiles }
              : null;

          if (!conflict) {
            // No conflict: create merge commit on target and clear merge state.
            const mergeCommit: GitCommit = {
              id: `merge-${Date.now().toString(36)}`,
              message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
              parentIds: [targetHead?.id ?? "", sourceHead.id].filter(Boolean),
              files: [...new Set([...(targetHead?.files ?? []), ...(sourceHead.files ?? [])])],
            };
            const newTargetCommits = [...targetCommits, mergeCommit];
            return {
              ...state,
              mergeState: null,
              repository: {
                ...repo,
                branchCommits: { ...branchCommits, [targetBranch]: newTargetCommits },
              },
            };
          }
          return {
            ...state,
            mergeState: { sourceBranch, targetBranch, conflict },
          };
        }),

      resolveMerge: (strategy) =>
        set((state) => {
          const merge = state.mergeState;
          if (!merge) return state;
          const repo = state.repository;
          const branchCommits = repo.branchCommits ?? { main: repo.commits ?? [] };
          const targetCommits = branchCommits[merge.targetBranch] ?? [];
          const sourceCommits = branchCommits[merge.sourceBranch] ?? [];
          const targetHead = targetCommits[targetCommits.length - 1];
          const sourceHead = sourceCommits[sourceCommits.length - 1];
          const mergeCommitId = `merge-${Date.now().toString(36)}`;
          const mergeCommit: GitCommit = {
            id: mergeCommitId,
            message: `Merge branch '${merge.sourceBranch}' into ${merge.targetBranch}`,
            parentIds: [targetHead?.id ?? "", sourceHead?.id ?? ""].filter(Boolean),
            files: merge.conflict ? (strategy === "useIncoming" ? [...(sourceHead?.files ?? [])] : [...(targetHead?.files ?? [])]) : [...new Set([...(targetHead?.files ?? []), ...(sourceHead?.files ?? [])])],
          };
          const newTargetCommits = [...targetCommits, mergeCommit];
          return {
            ...state,
            mergeState: null,
            repository: {
              ...repo,
              branchCommits: { ...branchCommits, [merge.targetBranch]: newTargetCommits },
              currentBranch: repo.currentBranch ?? merge.targetBranch,
            },
          };
        }),

      addAvatarMessage: (message) =>
        set((state) => ({
          ...state,
          avatarMessages: [
            ...state.avatarMessages,
            {
              ...message,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              timestamp: Date.now(),
            },
          ],
        })),

      clearAvatarMessages: () => set((state) => ({ ...state, avatarMessages: [] })),

      setAvatarMood: (avatarMood) => set((state) => ({ ...state, avatarMood })),

      grantXp: (amount) =>
        set((state) => ({ ...state, xp: state.xp + amount })),

      unlockBadge: (id) =>
        set((state) => {
          if (state.badges.some((b) => b.id === id)) return state;
          return {
            ...state,
            badges: [...state.badges, { id, unlockedAt: Date.now() }],
          };
        }),

      resetProgress: () =>
        set({
          ...initialState,
          repository: { ...defaultRepoState },
          xp: 0,
          badges: [],
          avatarMood: "idle",
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} })),
      partialize: (state) => ({
        currentLevel: state.currentLevel,
        completedLevels: state.completedLevels,
        repository: state.repository,
        mergeState: state.mergeState,
        xp: state.xp,
        badges: state.badges,
      }),
    }
  )
);
