"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import type { User } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginAnonymous: (name?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from storage then validate with backend
  useEffect(() => {
    const storedUser = localStorage.getItem("choufprice_user")
    const storedToken = localStorage.getItem("choufprice_token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }

    const fetchMe = async () => {
      if (!storedToken) {
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        if (!res.ok) {
          throw new Error("unauthorized")
        }
        const data = await res.json()
        const me: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          isAnonymous: false,
          createdAt: new Date(data.createdAt),
        }
        setUser(me)
        localStorage.setItem("choufprice_user", JSON.stringify(me))
      } catch (err) {
        // If token invalid, clear
        setUser(null)
        setToken(null)
        localStorage.removeItem("choufprice_user")
        localStorage.removeItem("choufprice_token")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("Login failed")

      const data = await res.json()
      const newUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        isAnonymous: false,
        createdAt: new Date(),
      }

      setUser(newUser)
      setToken(data.token)
      localStorage.setItem("choufprice_user", JSON.stringify(newUser))
      localStorage.setItem("choufprice_token", data.token)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })
      if (!res.ok) throw new Error("Register failed")

      // Auto login after register
      await login(email, password)
    } finally {
      setIsLoading(false)
    }
  }, [login])

  const loginAnonymous = useCallback(async (name?: string) => {
    // Keep anonymous client-only
    setIsLoading(true)
    try {
      const newUser: User = {
        id: `anon-${Date.now()}`,
        email: "",
        name: name || `Anonyme_${Math.floor(Math.random() * 10000)}`,
        isAnonymous: true,
        createdAt: new Date(),
      }

      setUser(newUser)
      setToken(null)
      localStorage.setItem("choufprice_user", JSON.stringify(newUser))
      localStorage.removeItem("choufprice_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("choufprice_user")
    localStorage.removeItem("choufprice_token")
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      loginAnonymous,
      logout,
      isAuthenticated: !!user,
    }),
    [user, token, isLoading, login, register, loginAnonymous, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
