import { en } from "@/copy/en";

type NestedValue = string | { [key: string]: NestedValue };

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
 * Ready to swap with Lingo or another i18n provider.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const value = get(en as NestedValue, key);
  if (value === undefined) return key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}

export { en };
