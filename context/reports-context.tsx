"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { PriceReport } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

interface ReportsContextType {
  reports: PriceReport[]
  isLoading: boolean
  error: string | null
  fetchReports: (filters?: { category?: string; wilaya?: string }) => Promise<void>
  createReport: (data: Omit<PriceReport, "id" | "upvotes" | "downvotes">) => Promise<void>
  voteReport: (reportId: string, voteType: "up" | "down") => Promise<void>
  deleteReport: (reportId: string) => Promise<void>
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children, token }: { children: React.ReactNode; token?: string | null }) {
  const [reports, setReports] = useState<PriceReport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async (filters?: { category?: string; wilaya?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append("category", filters.category)
      if (filters?.wilaya) params.append("wilaya", filters.wilaya)

      const res = await fetch(`${API_BASE}/api/reports?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch reports")

      const data = await res.json()
      setReports(data.reports || [])
    } catch (err) {
      console.error("[ReportsContext] fetch error", err)
      setError(err instanceof Error ? err.message : "Failed to fetch reports")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: Omit<PriceReport, "id" | "upvotes" | "downvotes">) => {
    if (!token) throw new Error("Authentication required")

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create report")

      const newReport = await res.json()
      setReports((prev) => [newReport, ...prev])
    } catch (err) {
      console.error("[ReportsContext] create error", err)
      setError(err instanceof Error ? err.message : "Failed to create report")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const voteReport = useCallback(async (reportId: string, voteType: "up" | "down") => {
    if (!token) throw new Error("Authentication required")

    try {
      const res = await fetch(`${API_BASE}/api/reports/${reportId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      })

      if (!res.ok) throw new Error("Failed to vote")

      const updated = await res.json()
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, upvotes: updated.upvotes, downvotes: updated.downvotes }
            : r
        )
      )
    } catch (err) {
      console.error("[ReportsContext] vote error", err)
      throw err
    }
  }, [token])

  const deleteReport = useCallback(async (reportId: string) => {
    if (!token) throw new Error("Authentication required")

    try {
      const res = await fetch(`${API_BASE}/api/reports/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to delete report")

      setReports((prev) => prev.filter((r) => r.id !== reportId))
    } catch (err) {
      console.error("[ReportsContext] delete error", err)
      throw err
    }
  }, [token])

  // Auto-fetch on mount
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return (
    <ReportsContext.Provider
      value={{
        reports,
        isLoading,
        error,
        fetchReports,
        createReport,
        voteReport,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (!context) {
    throw new Error("useReports must be used within ReportsProvider")
  }
  return context
}
