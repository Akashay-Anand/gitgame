/** Level / progression constants shared across levels page and game logic. */
export const XP_TARGET = 1000;

/** i18n key for current location label by level id (levelMap.*). */
export const LEVEL_LOCATION_KEYS: Record<string, string> = {
  "1": "levelMap.starterCottage",
  "2": "levelMap.neonForest",
  "3": "levelMap.branching",
};

export function isLevelUnlocked(
  levelId: string,
  completedLevels: Record<string, boolean>
): boolean {
  if (levelId === "1") return true;
  const prev = String(Number(levelId) - 1);
  return Boolean(completedLevels[prev]);
}

export function getCurrentLocationKey(levelId: string): string {
  return LEVEL_LOCATION_KEYS[levelId] ?? "levelMap.starterCottage";
}
