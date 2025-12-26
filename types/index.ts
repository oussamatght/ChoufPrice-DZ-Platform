export interface User {
  id: string
  email: string
  name: string
  isAnonymous: boolean
  createdAt: Date
}

export interface PriceReport {
  id: string
  productName: string
  price: number
  city: string
  commune?: string
  reporterName?: string
  reporterId: string
  timestamp: Date
  latitude: number
  longitude: number
  isAbnormal: boolean
  upvotes: number
  downvotes: number
  category: string
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
}

export interface City {
  name: string
  latitude: number
  longitude: number
  communes: string[]
}

export interface Product {
  id: string
  name: string
  category: string
  averagePrice: number
  unit: string
}

export type PriceCategory =
  | "food"
  | "beverages"
  | "household"
  | "electronics"
  | "clothing"
  | "health"
  | "fuel"
  | "construction"
  | "agriculture"
  | "services"
