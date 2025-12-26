"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Lock, Loader2, UserCircle, Eye, EyeOff, TrendingUp, Users, Bell } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginAnonymous, isLoading, isAuthenticated } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs")
      return
    }

    try {
      await login(email, password)
      toast.success("Connexion réussie!")
      router.push("/")
    } catch {
      toast.error("Erreur de connexion")
    }
  }

  const handleAnonymous = async () => {
    try {
      await loginAnonymous()
      toast.success("Connecté en tant qu'anonyme")
      router.push("/")
    } catch {
      toast.error("Erreur de connexion")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
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

          <h2 className="text-4xl font-bold mb-6 leading-tight text-balance">
            Suivez les prix en temps réel à travers l'Algérie
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
            La plateforme communautaire pour surveiller et partager les prix des produits dans toutes les wilayas.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Prix en Direct</h3>
                <p className="text-sm text-primary-foreground/70">Mises à jour en temps réel par la communauté</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Communauté Active</h3>
                <p className="text-sm text-primary-foreground/70">Des milliers de contributeurs à travers le pays</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Alertes Prix</h3>
                <p className="text-sm text-primary-foreground/70">Soyez notifié des prix anormaux</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
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
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connectez-vous pour accéder à votre compte
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se Connecter"
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  ou
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 font-medium bg-transparent"
                onClick={handleAnonymous}
                disabled={isLoading}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Continuer en Anonyme
              </Button>
            </CardContent>

            <CardFooter className="justify-center pt-2">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
