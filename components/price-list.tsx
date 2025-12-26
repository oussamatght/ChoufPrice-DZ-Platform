"use client"

import { useState } from "react"
import type { PriceReport } from "@/types"
import { categoryColors, categoryLabels } from "@/data/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, ThumbsDown, MapPin, Clock, Search, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface PriceListProps {
  reports: PriceReport[]
  onVote: (reportId: string, type: "up" | "down") => void
  selectedReport: PriceReport | null
}

export function PriceList({ reports, onVote, selectedReport }: PriceListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReports = reports.filter(
    (report) =>
      report.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="h-[400px] md:h-[500px] lg:h-[550px] flex flex-col">
      <CardHeader className="pb-3 space-y-3">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Prix Récents
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher produit ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 px-4 pb-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Aucun résultat trouvé</p>
              </div>
            ) : (
              filteredReports.slice(0, 50).map((report) => (
                <div
                  key={report.id}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedReport?.id === report.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-sm truncate">{report.productName}</h4>
                        {report.isAbnormal && (
                          <Badge variant="destructive" className="text-xs gap-1 h-5">
                            <AlertTriangle className="h-3 w-3" />
                            Anormal
                          </Badge>
                        )}
                      </div>
                      <p
                        className="text-lg font-bold mt-0.5"
                        style={{ color: categoryColors[report.category as keyof typeof categoryColors] }}
                      >
                        {report.price.toLocaleString("fr-DZ")} DZD
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {report.city}
                          {report.commune && `, ${report.commune}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true, locale: fr })}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs h-5"
                          style={{
                            borderColor: categoryColors[report.category as keyof typeof categoryColors],
                            color: categoryColors[report.category as keyof typeof categoryColors],
                          }}
                        >
                          {categoryLabels[report.category as keyof typeof categoryLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Voting */}
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Ce prix est correct?</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 hover:bg-success/10 hover:text-success"
                        onClick={() => onVote(report.id, "up")}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {report.upvotes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onVote(report.id, "down")}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        {report.downvotes}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
