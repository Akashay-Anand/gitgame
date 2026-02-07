/**
 * Single place for i18n config. To add a language:
 * 1. Add a row to LOCALES below
 * 2. Add: import <code>Messages from "../../i18n/<code>.json"
 * 3. Add <code>: <code>Messages to the messages object
 * @see https://www.lingo.dev
 */

import enMessages from "../../i18n/en.json";
import hiMessages from "../../i18n/hi.json";

export const LOCALES = [
  { code: "en" as const, label: "English" },
  { code: "hi" as const, label: "हिन्दी" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];
export const localeCodes = LOCALES.map((l) => l.code);
export const defaultLocale: Locale = "en";

// Message bundles: add new locale import + entry here when adding a language
type NestedValue = string | { [key: string]: NestedValue };
const messages: Record<Locale, NestedValue> = {
  en: enMessages as NestedValue,
  hi: hiMessages as NestedValue,
};

function get(obj: NestedValue, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedValue = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, NestedValue>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

/** Get message for a locale; falls back to English if missing. */
export function getMessage(
  key: string,
  locale: Locale,
  params?: Record<string, string | number>
): string {
  const value =
    get(messages[locale], key) ?? get(messages.en, key) ?? key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}
