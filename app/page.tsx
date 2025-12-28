"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/context/auth-context"
import { useChat } from "@/hooks/use-chat"
import { useLanguage } from "@/context/language-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PriceList } from "@/components/price-list"
import { AddPriceForm } from "@/components/add-price-form"
import { CategoryFilter } from "@/components/category-filter"
import { CommunityChat } from "@/components/community-chat"
import { PriceAlerts } from "@/components/price-alerts"
import { StatsOverview } from "@/components/stats-overview"
import { priceReports as initialReports } from "@/data/products"
import type { PriceReport } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamic import for PriceMap to avoid SSR issues with Leaflet
const PriceMap = dynamic(() => import("@/components/price-map").then((mod) => ({ default: mod.PriceMap })), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
      <Skeleton className="w-full h-full" />
    </div>
  ),
})

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user, token } = useAuth()
  const { t, locale } = useLanguage()
  const { messages: chatMessages, send: handleSendMessage, deleteMessage: handleDeleteMessage, isConnected } = useChat(token || undefined)
  const [reports, setReports] = useState<PriceReport[]>(initialReports)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedReport, setSelectedReport] = useState<PriceReport | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

  // Fetch dynamic reports from backend and merge with static ones (keep static)
  useEffect(() => {
    const fetchDynamicReports = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports`)
        if (!res.ok) return
        const data = await res.json()
        const dynamicReports: PriceReport[] = (data.reports || []).map((r: any) => ({
          id: r.id,
          productName: r.productName,
          price: r.price,
          category: r.category,
          location: r.location,
          storeName: r.storeName,
          isAbnormal: !!r.isAbnormal,
          upvotes: r.upvotes ?? 0,
          downvotes: r.downvotes ?? 0,
        }))

        setReports((prev) => {
          const byId = new Map<string, PriceReport>()
          prev.forEach((p) => byId.set(p.id, p))
          dynamicReports.forEach((d) => byId.set(d.id, d))
          return Array.from(byId.values())
        })
      } catch (err) {
        console.warn("[Dashboard] Failed to fetch backend reports", err)
      }
    }
    fetchDynamicReports()
    const interval = setInterval(fetchDynamicReports, 60_000)
    return () => clearInterval(interval)
  }, [API_BASE])

  const handleAddPrice = useCallback(async (newReport: Omit<PriceReport, "id" | "upvotes" | "downvotes">) => {
    // Try backend create, fallback to local append on error
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productName: newReport.productName,
          price: newReport.price,
          category: newReport.category,
          location: newReport.location,
          storeName: (newReport as any).storeName || "",
        }),
      })
      if (res.ok) {
        const created = await res.json()
        const report: PriceReport = {
          id: created.id,
          productName: created.productName,
          price: created.price,
          category: created.category,
          location: created.location,
          storeName: created.storeName,
          isAbnormal: !!created.isAbnormal,
          upvotes: created.upvotes ?? 0,
          downvotes: created.downvotes ?? 0,
        }
        setReports((prev) => [report, ...prev])
        return
      }
    } catch (err) {
      console.warn("[Dashboard] Backend create failed, falling back", err)
    }
    const fallback: PriceReport = {
      ...newReport,
      id: `price-${Date.now()}`,
      upvotes: 0,
      downvotes: 0,
    }
    setReports((prev) => [fallback, ...prev])
  }, [API_BASE, token])

  const handleVote = useCallback(async (reportId: string, type: "up" | "down") => {
    // Try backend vote, fallback to local counters
    try {
      const res = await fetch(`${API_BASE}/api/reports/${reportId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ voteType: type }),
      })
      if (res.ok) {
        const updated = await res.json()
        setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, upvotes: updated.upvotes, downvotes: updated.downvotes } : r)))
        return
      }
    } catch (err) {
      console.warn("[Dashboard] Backend vote failed, falling back", err)
    }
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            upvotes: type === "up" ? report.upvotes + 1 : report.upvotes,
            downvotes: type === "down" ? report.downvotes + 1 : report.downvotes,
          }
        }
        return report
      }),
    )
  }, [API_BASE, token])

  const handleSelectReport = useCallback((report: PriceReport) => {
    setSelectedReport(report)
  }, [])

  const handleDismissAlert = useCallback(() => {}, [])

  // Memoize filtered reports for performance
  const filteredReports = useMemo(() => {
    return selectedCategory ? reports.filter((r) => r.category === selectedCategory) : reports
  }, [reports, selectedCategory])

  const categoryCounts = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc[report.category] = (acc[report.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [reports])

  const alerts = useMemo(() => reports.filter((r) => r.isAbnormal).slice(0, 10), [reports])

  if (authLoading || !isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
            <Skeleton className="h-[400px]" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container px-4 py-4 md:py-6 max-w-7xl mx-auto">
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t("dashboard.subtitle")}</p>
          </div>

          {/* Stats Overview */}
          <StatsOverview reports={reports} t={t} />

          {/* Alerts - Collapsible on mobile */}
          {alerts.length > 0 && <PriceAlerts alerts={alerts} onDismiss={handleDismissAlert} t={t} />}

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />

          {/* Main Content Grid - Stack on mobile, side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Map - Full width on mobile, 3 cols on desktop */}
            <div className="lg:col-span-3 order-1">
              <PriceMap reports={filteredReports} selectedCategory={selectedCategory} onSelectReport={handleSelectReport} />
            </div>

            {/* Price List - Full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2 order-2">
              <PriceList
                reports={filteredReports}
                onVote={handleVote}
                selectedReport={selectedReport}
              />
            </div>
          </div>

          {/* Add Price and Chat - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <AddPriceForm onAddPrice={handleAddPrice} />
            <CommunityChat messages={chatMessages} onSendMessage={handleSendMessage} onDeleteMessage={handleDeleteMessage} isConnected={isConnected} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
