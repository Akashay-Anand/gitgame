"use client";

import { useState, useRef, useEffect } from "react";
import { useLocaleStore } from "@/store/localeStore";
import { LOCALES } from "@/lib/i18n";

export function LanguageSwitch() {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-background-dark/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="material-symbols-outlined text-white/80 text-xl" aria-hidden>
          translate
        </span>
        <span className="text-sm font-bold min-w-[4rem] text-left">
          {LOCALES.find((l) => l.code === locale)?.label ?? locale}
        </span>
        <span
          className={`material-symbols-outlined text-white/60 text-lg transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1.5 min-w-[10rem] py-1 rounded-xl border border-white/10 bg-background-dark/95 backdrop-blur-md shadow-xl z-50"
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
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center justify-between ${
                  locale === code
                    ? "bg-primary/20 text-primary"
                    : "text-white/90 hover:bg-white/10"
                }`}
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
