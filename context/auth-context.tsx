"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("choufprice_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split("@")[0],
        isAnonymous: false,
        createdAt: new Date(),
      }

      setUser(newUser)
      localStorage.setItem("choufprice_user", JSON.stringify(newUser))
      localStorage.setItem("choufprice_token", `jwt-token-${Date.now()}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        isAnonymous: false,
        createdAt: new Date(),
      }

      setUser(newUser)
      localStorage.setItem("choufprice_user", JSON.stringify(newUser))
      localStorage.setItem("choufprice_token", `jwt-token-${Date.now()}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginAnonymous = useCallback(async (name?: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser: User = {
        id: `anon-${Date.now()}`,
        email: "",
        name: name || `Anonyme_${Math.floor(Math.random() * 10000)}`,
        isAnonymous: true,
        createdAt: new Date(),
      }

      setUser(newUser)
      localStorage.setItem("choufprice_user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("choufprice_user")
    localStorage.removeItem("choufprice_token")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginAnonymous,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
