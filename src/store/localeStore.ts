import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Locale,
  defaultLocale,
  localeCodes,
} from "@/lib/i18n";

const STORAGE_KEY = "lingo-locale";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: defaultLocale,
      setLocale: (locale: Locale) =>
        set({ locale: localeCodes.includes(locale) ? locale : defaultLocale }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({ locale: state.locale }),
    }
  )
);
