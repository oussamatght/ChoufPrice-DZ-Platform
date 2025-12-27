"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle2, Shield, Zap } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, isAuthenticated } = useAuth()
  const { t, locale } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error(t("auth.register.required"))
      return
    }

    if (password !== confirmPassword) {
      toast.error(t("auth.register.mismatch"))
      return
    }

    if (password.length < 6) {
      toast.error(t("auth.register.short"))
      return
    }

    try {
      await register(email, password, name)
      toast.success(t("auth.register.success"))
      setTimeout(() => router.push("/"), 100)
    } catch {
      toast.error(t("auth.register.error"))
    }
  }

  return (
    <div className="min-h-screen flex" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:60px_60px]"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur">
              <MapPin className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ChoufPrice</h1>
              <p className="text-primary-foreground/80 text-lg">DZ</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight text-balance" translate="no" suppressHydrationWarning>
            {t("hero.title")}
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t("hero.feature1.title")}</h3>
                <p className="text-sm text-primary-foreground/70">{t("hero.feature1.desc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t("hero.feature2.title")}</h3>
                <p className="text-sm text-primary-foreground/70">{t("hero.feature2.desc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t("hero.feature3.title")}</h3>
                <p className="text-sm text-primary-foreground/70">{t("hero.feature3.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              ChoufPrice<span className="text-primary">DZ</span>
            </span>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{t("auth.register.title")}</CardTitle>
              <CardDescription className="text-muted-foreground">{t("auth.register.subtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("form.name")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("form.name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t("form.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.placeholderEmail")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t("form.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("form.password.placeholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t("auth.register.confirm")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("form.password.placeholder")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.register.button") + "..."}
                    </>
                  ) : (
                    t("auth.register.button")
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center pt-2">
              <p className="text-sm text-muted-foreground">
                {t("auth.login.subtitle")}{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  {t("nav.login")}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
