"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Locale, locales, t as translate, isRtl } from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  rtl: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_KEY = "ryven_locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  };

  const t = (key: string) => translate(locale, key as any);
  const rtl = isRtl(locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, rtl }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be within LocaleProvider");
  return ctx;
}
