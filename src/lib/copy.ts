/**
 * Translation helpers. Use useT() in client components so the UI updates when language changes.
 */

import { getMessage } from "@/lib/i18n";
import { useLocaleStore } from "@/store/localeStore";

/** Get translated string (current locale from store). Use useT() in components so they re-render on locale change. */
export function t(key: string, params?: Record<string, string | number>): string {
  return getMessage(key, useLocaleStore.getState().locale, params);
}

/** Use in client components so they re-render when locale changes. Returns t(key, params?). */
export function useT(): (key: string, params?: Record<string, string | number>) => string {
  const locale = useLocaleStore((s) => s.locale);
  return (key: string, params?: Record<string, string | number>) =>
    getMessage(key, locale, params);
}
