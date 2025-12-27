"use client"

import { useState } from "react"
import type { PriceReport } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, X, MapPin, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface PriceAlertsProps {
  alerts: PriceReport[]
  onDismiss: (id: string) => void
  t: (key: string) => string
}

export function PriceAlerts({ alerts, onDismiss, t }: PriceAlertsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id))

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
    onDismiss(id)
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <Card className="border-destructive/30 bg-destructive/5 w-full overflow-scroll">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center gap-2 text-destructive flex-wrap">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <span>{t("alerts.title")}</span>
          <Badge variant="destructive" className="ml-auto shrink-0">
            {visibleAlerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-4 md:px-6">
        <ScrollArea className="max-h-[180px] md:max-h-[220px] w-full [&_[role=scrollbar]]:hidden">
          <div className="space-y-2">
            {visibleAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-card border border-destructive/20 overflow-hidden"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 shrink-0">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                    <span className="font-medium text-xs md:text-sm truncate">{alert.productName}</span>
                    <Badge variant="destructive" className="text-xs h-5 shrink-0">
                      {alert.price.toLocaleString("fr-DZ")} DZD
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 flex-wrap">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{alert.city}</span>
                    <span className="mx-0.5 hidden sm:inline">·</span>
                    <span className="text-xs">{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: fr })}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
