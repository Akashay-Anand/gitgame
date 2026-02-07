/**
 * Locale and getLocale for Lingo.dev i18n.
 * Translation strings live in i18n/[locale].json; copy.ts uses getLocale() to pick the right file.
 * @see https://www.lingo.dev
 */

export type Locale = "en" | "hi";

export const defaultLocale: Locale = "en";

export const supportedLocales: Locale[] = ["en", "hi"];

/** Translation key type for type-safe i18n */
export type TranslationKey = string;

/**
 * Current locale. Defaults to "en"; can later be driven by URL, cookie, or Lingo context.
 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  // TODO: read from cookie, searchParams, or Lingo context when adding language switcher
  return defaultLocale;
}
