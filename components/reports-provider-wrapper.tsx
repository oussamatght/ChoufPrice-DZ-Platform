"use client"

import { useAuth } from "@/context/auth-context"
import { ReportsProvider } from "@/context/reports-context"

export function ReportsProviderWrapper({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return <ReportsProvider token={token}>{children}</ReportsProvider>
}
