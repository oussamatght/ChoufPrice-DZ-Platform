"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { algeriaCities } from "@/data/algeria-cities"
import { products, categoryLabels } from "@/data/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { PriceReport, PriceCategory } from "@/types"

interface AddPriceFormProps {
  onAddPrice: (report: Omit<PriceReport, "id" | "upvotes" | "downvotes">) => void
}

export function AddPriceForm({ onAddPrice }: AddPriceFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedCommune, setSelectedCommune] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PriceCategory | "">("")
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState("")
  const [reporterName, setReporterName] = useState("")

  const selectedCityData = algeriaCities.find((c) => c.name === selectedCity)
  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productName || !price || !selectedCity) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const cityData = algeriaCities.find((c) => c.name === selectedCity)
      if (!cityData) return

      const product = products.find((p) => p.name === productName)
      const priceNum = Number.parseInt(price)
      const avgPrice = product?.averagePrice || priceNum
      const isAbnormal = priceNum > avgPrice * 1.25 || priceNum < avgPrice * 0.75

      const newReport: Omit<PriceReport, "id" | "upvotes" | "downvotes"> = {
        productName,
        price: priceNum,
        city: selectedCity,
        commune: selectedCommune || undefined,
        reporterName: reporterName || user?.name || "Anonyme",
        reporterId: user?.id || "anonymous",
        timestamp: new Date(),
        latitude: cityData.latitude + (Math.random() - 0.5) * 0.05,
        longitude: cityData.longitude + (Math.random() - 0.5) * 0.05,
        isAbnormal,
        category: product?.category || "food",
      }

      onAddPrice(newReport)
      toast.success("Prix ajouté avec succès!")

      // Reset form
      setProductName("")
      setPrice("")
      setSelectedCommune("")
      setReporterName("")
    } catch {
      toast.error("Erreur lors de l'ajout du prix")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          Ajouter un Prix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Catégorie
              </Label>
              <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as PriceCategory)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                Produit <span className="text-destructive">*</span>
              </Label>
              <Select value={productName} onValueChange={setProductName}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.slice(0, 50).map((product) => (
                    <SelectItem key={product.id} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Prix (DZD) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="ex: 250"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                Ville <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(v) => {
                  setSelectedCity(v)
                  setSelectedCommune("")
                }}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {algeriaCities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commune" className="text-sm font-medium">
                Commune
              </Label>
              <Select value={selectedCommune} onValueChange={setSelectedCommune} disabled={!selectedCity}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Optionnel..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedCityData?.communes.map((commune) => (
                    <SelectItem key={commune} value={commune}>
                      {commune}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporter" className="text-sm font-medium">
              Votre nom <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="reporter"
              placeholder="ex: Ahmed B."
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="h-10"
            />
          </div>

          <Button type="submit" className="w-full h-11 font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Soumettre le Prix
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
