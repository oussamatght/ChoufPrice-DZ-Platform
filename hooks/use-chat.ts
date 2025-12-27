"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import type { ChatMessage } from "@/types"

export function useChat(token?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()
  const reconnectAttemptsRef = useRef(0)

  const connect = useCallback(() => {
    // Don't reconnect if already connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const base = process.env.NEXT_PUBLIC_API_BASE_WS || "ws://localhost:4000"
    const url = `${base}/ws/chat${token ? `?token=${token}` : ""}`

    console.log(`[useChat] Connecting to ${url}`)

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        reconnectAttemptsRef.current = 0
        console.log("[useChat] WebSocket connected")
      }

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          console.log("[useChat] Received:", payload.type, payload)

          if (payload.type === "history") {
            // Load full history on initial connect
            console.log("[useChat] Setting history:", payload.messages?.length || 0, "messages")
            setMessages(payload.messages || [])
          } else if (payload.type === "message" && payload.message) {
            // Add new incoming message
            console.log("[useChat] New message:", payload.message)
            setMessages((prev) => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some((m) => m.id === payload.message.id)
              if (exists) {
                console.log("[useChat] Message already exists, skipping duplicate")
                return prev
              }
              return [...prev, payload.message]
            })
          } else if (payload.type === "error") {
            console.warn("[useChat] Server error:", payload.message)
          }
        } catch (err) {
          console.error("[useChat] Failed to parse message:", err, event.data)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("[useChat] WebSocket disconnected, attempting to reconnect...")
        
        // Attempt to reconnect with exponential backoff
        reconnectAttemptsRef.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`[useChat] Reconnecting (attempt ${reconnectAttemptsRef.current})...`)
          connect()
        }, delay)
      }

      ws.onerror = (err) => {
        console.error("[useChat] WebSocket error:", err)
        setIsConnected(false)
      }
    } catch (err) {
      console.error("[useChat] Failed to create WebSocket:", err)
      setIsConnected(false)
    }
  }, [token])

  // Connect on mount and when token changes
  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [connect])

  const send = useCallback((text: string) => {
    const ws = wsRef.current
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("[useChat] WebSocket not ready, message not sent")
      console.warn(`[useChat] ws=${!!ws}, readyState=${ws?.readyState}`)
      return
    }

    try {
      const payload = { type: "message", text }
      console.log("[useChat] Sending:", payload)
      ws.send(JSON.stringify(payload))
    } catch (err) {
      console.error("[useChat] Failed to send message:", err)
    }
  }, [])

  const deleteMessage = useCallback((messageId: string) => {
    const ws = wsRef.current
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("[useChat] WebSocket not ready, cannot delete message")
      return
    }

    try {
      const payload = { type: "delete", messageId }
      console.log("[useChat] Deleting message:", payload)
      ws.send(JSON.stringify(payload))
      // Optimistically remove from local state
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    } catch (err) {
      console.error("[useChat] Failed to delete message:", err)
    }
  }, [])

  return { messages, send, deleteMessage, isConnected }
}
