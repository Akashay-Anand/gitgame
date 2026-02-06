/**
 * i18n placeholder for Lingo.dev integration.
 * Replace with Lingo SDK when ready:
 * @see https://www.lingo.dev
 */

export type Locale = "en";

export const defaultLocale: Locale = "en";

export const supportedLocales: Locale[] = [defaultLocale];

/** Translation key type for type-safe i18n later */
export type TranslationKey = string;

/**
 * Placeholder: returns the key as text until Lingo is integrated.
 * Usage: t("level.title") or t("avatar.welcome")
 */
export function t(key: TranslationKey, _params?: Record<string, string | number>): string {
  return key;
}

/**
 * Get current locale (for future Lingo integration).
 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  // Could read from cookie or Lingo context
  return defaultLocale;
}
