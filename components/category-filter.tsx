"use client"

import { categoryColors, categoryLabels } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { PriceCategory } from "@/types"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  categoryCounts: Record<string, number>
}

export function CategoryFilter({ selectedCategory, onSelectCategory, categoryCounts }: CategoryFilterProps) {
  const categories = Object.keys(categoryLabels) as PriceCategory[]
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:backdrop-blur-none">
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 min-w-max pb-2 md:pb-0 md:flex-wrap md:min-w-0">
          {/* All button */}
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(null)}
            className="h-8 px-3 text-xs font-medium whitespace-nowrap"
          >
            Tous
            <Badge
              variant={selectedCategory === null ? "secondary" : "outline"}
              className="ml-1.5 h-4 px-1 text-[10px]"
            >
              {totalCount}
            </Badge>
          </Button>

          {/* Category buttons */}
          {categories.map((category) => {
            const isSelected = selectedCategory === category
            const color = categoryColors[category]
            const count = categoryCounts[category] || 0

            return (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => onSelectCategory(category)}
                className="h-8 px-3 text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: isSelected ? color : "transparent",
                  borderColor: color,
                  color: isSelected ? "white" : color,
                }}
              >
                {categoryLabels[category]}
                <Badge
                  variant="outline"
                  className="ml-1.5 h-4 px-1 text-[10px] border-current"
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "transparent",
                    color: isSelected ? "white" : color,
                  }}
                >
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
