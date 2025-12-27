"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { fallbackLocale, type Locale, translate } from "@/lib/i18n"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return fallbackLocale
    const stored = localStorage.getItem("choufprice_locale") as Locale | null
    if (stored && ["fr", "en", "ar"].includes(stored)) return stored
    return fallbackLocale
  })

  const setLocale = (value: Locale) => {
    setLocaleState(value)
    if (typeof window !== "undefined") {
      localStorage.setItem("choufprice_locale", value)
    }
  }

  useEffect(() => {
    if (typeof document === "undefined") return
    document.documentElement.lang = locale
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translate(locale, key),
    }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
