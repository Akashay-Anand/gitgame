import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LevelId = string;

export interface GitBranch {
  name: string;
  isHead: boolean;
}

export interface GitCommit {
  id: string;
  message: string;
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
  /** Commit history (empty after init) */
  commits: GitCommit[];
  /** Staged file paths (for future git add / commit levels) */
  stagedFiles: string[];
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
};

const initialState: GameState = {
  currentLevel: "1",
  completedLevels: {},
  repository: { ...defaultRepoState },
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
              stagedFiles: [],
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
        xp: state.xp,
        badges: state.badges,
      }),
    }
  )
);
