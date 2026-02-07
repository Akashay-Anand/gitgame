import { getLocale } from "@/lib/i18n";

// Lingo.dev bucket files: source of truth for translations (CI updates i18n/hi.json from i18n/en.json)
import enMessages from "../../i18n/en.json";
import hiMessages from "../../i18n/hi.json";

type NestedValue = string | { [key: string]: NestedValue };

const messages: Record<string, NestedValue> = {
  en: enMessages as NestedValue,
  hi: hiMessages as NestedValue,
};

function get(obj: NestedValue, path: string): string | undefined {
  const keys = path.split(".");
  let current: NestedValue = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    current = (current as Record<string, NestedValue>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Get localized copy by key. Keys are dot paths, e.g. "quest.level1.title".
 * Loads from i18n/[locale].json (Lingo.dev buckets); falls back to English if key is missing in target locale.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = getLocale();
  const value =
    get(messages[locale], key) ?? get(messages.en, key);
  if (value === undefined) return key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}

/** English messages (from Lingo source bucket); for type or fallback use. */
export const en = enMessages;
