"use client"

import { useEffect, useRef, useState } from "react"
import type { PriceReport } from "@/types"
import { categoryColors } from "@/data/products"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { MapPin, Loader2, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PriceMapProps {
  reports: PriceReport[]
  selectedCategory: string | null
  onSelectReport: (report: PriceReport) => void
}

export function PriceMap({ reports, selectedCategory, onSelectReport }: PriceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const clusterGroupRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [retryCount, setRetryCount] = useState(0)

  const initializeMap = async () => {
    if (mapRef.current) return

    try {
      setStatus("loading")

      // Inject Leaflet CSS if not present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Inject Leaflet.markercluster CSS
      if (!document.getElementById("markercluster-css")) {
        const link = document.createElement("link")
        link.id = "markercluster-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.css"
        document.head.appendChild(link)
        const link2 = document.createElement("link")
        link2.id = "markercluster-default-css"
        link2.rel = "stylesheet"
        link2.href = "https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.Default.css"
        document.head.appendChild(link2)
      }

      await new Promise((r) => setTimeout(r, 200))

      // Dynamic import of Leaflet and MarkerCluster
      const L = (await import("leaflet")).default
      await import("leaflet.markercluster")
      leafletRef.current = L

      if (!mapContainer.current) {
        throw new Error("Map container not found")
      }

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      // Create map
      const map = L.map(mapContainer.current, {
        center: [28.0339, 1.6596],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map)

      // Create marker cluster group with custom styling
      const markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 120,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 16,
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        removeOutsideVisibleBounds: true,
        animate: true,
        iconCreateFunction: function(cluster: any) {
          const count = cluster.getChildCount()
          let size = 'small'
          let radius = 40
          
          if (count > 100) {
            size = 'large'
            radius = 60
          } else if (count > 50) {
            size = 'medium'
            radius = 50
          }
          
          return L.divIcon({
            html: `<div style="
              background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
              width: ${radius}px;
              height: ${radius}px;
              border-radius: 50%;
              border: 3px solid #fff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${radius > 50 ? '18px' : '16px'};
              font-weight: bold;
              color: #000;
            ">${count}</div>`,
            className: 'marker-cluster marker-cluster-' + size,
            iconSize: L.point(radius, radius),
          })
        }
      })

      clusterGroupRef.current = markerClusterGroup
      mapRef.current = map
      map.addLayer(markerClusterGroup)

      // Wait for map to be ready
      map.whenReady(() => {
        setTimeout(() => {
          map.invalidateSize()
          setStatus("ready")
        }, 100)
      })
    } catch (err) {
      console.error("[v0] Map initialization error:", err)
      setStatus("error")
    }
  }

  // Initialize map on mount
  useEffect(() => {
    initializeMap()

    return () => {
      try {
        if (mapRef.current) {
          if (clusterGroupRef.current) {
            clusterGroupRef.current.clearLayers()
            mapRef.current.removeLayer(clusterGroupRef.current)
          }
          mapRef.current.remove()
          mapRef.current = null
          clusterGroupRef.current = null
          leafletRef.current = null
        }
      } catch (err) {
        console.error("[v0] Cleanup error:", err)
      }
    }
  }, [retryCount])

  // Update markers when data changes
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !clusterGroupRef.current || !leafletRef.current) return

    try {
      const L = leafletRef.current
      
      // Clear existing markers
      clusterGroupRef.current.clearLayers()

      const filteredReports = selectedCategory ? reports.filter((r) => r.category === selectedCategory) : reports

      // Process markers in batches for better performance with massive datasets
      const batchSize = 10000
      let processed = 0

      const processBatch = () => {
        const batch = filteredReports.slice(processed, processed + batchSize)
        
        batch.forEach((report) => {
          const color = categoryColors[report.category as keyof typeof categoryColors] || "#22c55e"
          const isAbnormal = report.isAbnormal

          // Simplified icon for performance
          const icon = L.divIcon({
            html: `<div style="background:${isAbnormal ? "#dc2626" : color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)">${isAbnormal ? "!" : ""}</div>`,
            className: "custom-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          const marker = L.marker([report.latitude, report.longitude], { icon })

          marker.bindPopup(`
            <div style="min-width: 160px;">
              <strong style="font-size: 13px; display: block; margin-bottom: 4px;">${report.productName}</strong>
              <span style="font-size: 15px; font-weight: 700; color: ${isAbnormal ? "#dc2626" : color};">
                ${report.price.toLocaleString("fr-DZ")} DZD
              </span>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">${report.city}</div>
              <div style="font-size: 10px; color: #999;">
                ${formatDistanceToNow(new Date(report.timestamp), { addSuffix: true, locale: fr })}
              </div>
            </div>
          `)

          marker.on("click", () => onSelectReport(report))
          clusterGroupRef.current.addLayer(marker)
        })

        processed += batchSize

        // Continue processing if there are more markers
        if (processed < filteredReports.length) {
          setTimeout(processBatch, 0)
        }
      }

      // Start batch processing
      processBatch()
    } catch (err) {
      console.error("[v0] Error updating markers:", err)
    }
  }, [status, reports, selectedCategory, onSelectReport])

  const displayedCount = selectedCategory
    ? reports.filter((r) => r.category === selectedCategory).length
    : reports.length

  const handleRetry = () => {
    if (mapRef.current) {
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers()
      }
      mapRef.current.remove()
      mapRef.current = null
      clusterGroupRef.current = null
      leafletRef.current = null
    }
    setRetryCount((c) => c + 1)
  }

  return (
    <Card className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden border">
      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-50">
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
            <p className="text-xs text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-50">
          <div className="text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm text-muted-foreground">Erreur de chargement</p>
            <Button size="sm" variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend - hidden on small mobile */}
      {status === "ready" && (
        <div className="hidden sm:block absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm p-2 rounded-md shadow border z-[1000] text-[10px]">
          <div className="font-medium mb-1">Légende</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Prix anormal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Prix normal</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats badge */}
      {status === "ready" && (
        <div className="absolute top-2 right-2 z-[1000]">
          <Badge variant="secondary" className="text-[10px] bg-card/90 backdrop-blur-sm border shadow-sm px-2 py-0.5">
            <MapPin className="h-3 w-3 mr-1" />
            {displayedCount}
          </Badge>
        </div>
      )}
    </Card>
  )
}
