"use client";

import { useState, useRef, useEffect } from "react";
import { useLocaleStore } from "@/store/localeStore";
import { LOCALES } from "@/lib/i18n";

export type LanguageSwitchVariant = "dark" | "light";

interface LanguageSwitchProps {
  /** "dark" for dark backgrounds (levels page), "light" for light backgrounds (play page). */
  variant?: LanguageSwitchVariant;
}

export function LanguageSwitch({ variant = "dark" }: LanguageSwitchProps) {
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isLight = variant === "light";
  const buttonClass = isLight
    ? "flex items-center gap-2 bg-slate-200 dark:bg-slate-700 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-colors text-slate-800 dark:text-slate-200"
    : "flex items-center gap-2 bg-background-dark/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-colors";
  const iconClass = isLight
    ? "material-symbols-outlined text-slate-600 dark:text-slate-300 text-xl"
    : "material-symbols-outlined text-white/80 text-xl";
  const chevronClass = isLight
    ? `material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg transition-transform ${open ? "rotate-180" : ""}`
    : `material-symbols-outlined text-white/60 text-lg transition-transform ${open ? "rotate-180" : ""}`;
  const dropdownClass = isLight
    ? "absolute right-0 top-full mt-1.5 min-w-[10rem] py-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-xl z-50"
    : "absolute right-0 top-full mt-1.5 min-w-[10rem] py-1 rounded-xl border border-white/10 bg-background-dark/95 backdrop-blur-md shadow-xl z-50";
  const optionClass = (selected: boolean) =>
    selected
      ? isLight
        ? "bg-primary/20 text-primary"
        : "bg-primary/20 text-primary"
      : isLight
        ? "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
        : "text-white/90 hover:bg-white/10";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={buttonClass}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className={iconClass} aria-hidden>
          translate
        </span>
        <span className="text-sm font-bold min-w-[4rem] text-left">
          {LOCALES.find((l) => l.code === locale)?.label ?? locale}
        </span>
        <span className={chevronClass} aria-hidden>
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className={dropdownClass}
          aria-label="Language options"
        >
          {LOCALES.map(({ code, label }) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center justify-between ${optionClass(
                  locale === code
                )}`}
              >
                {label}
                {locale === code && (
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
