import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "zh";

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "zh",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === "en" ? "zh" : "en" })),
    }),
    {
      name: "midnight-registry-i18n",
    }
  )
);
