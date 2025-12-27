"use client"

import type { PriceReport } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Package, TrendingUp, AlertTriangle } from "lucide-react"

interface StatsOverviewProps {
  reports: PriceReport[]
  t: (key: string) => string
}

export function StatsOverview({ reports, t }: StatsOverviewProps) {
  const stats = {
    totalReports: reports.length,
    cities: new Set(reports.map((r) => r.city)).size,
    products: new Set(reports.map((r) => r.productName)).size,
    abnormalPrices: reports.filter((r) => r.isAbnormal).length,
  }

  const statItems = [
    {
      label: t("stats.totalReports"),
      value: stats.totalReports.toLocaleString("fr-DZ"),
      icon: Package,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: t("stats.cities"),
      value: stats.cities,
      icon: MapPin,
      bgColor: "bg-info/10",
      iconColor: "text-info",
    },
    {
      label: t("stats.products"),
      value: stats.products,
      icon: TrendingUp,
      bgColor: "bg-success/10",
      iconColor: "text-success",
    },
    {
      label: t("stats.abnormalPrices"),
      value: stats.abnormalPrices,
      icon: AlertTriangle,
      bgColor: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold tabular-nums">{item.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
