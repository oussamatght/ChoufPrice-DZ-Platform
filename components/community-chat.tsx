"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import type { ChatMessage } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr, enUS, ar } from "date-fns/locale"

interface CommunityChatProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onDeleteMessage?: (messageId: string) => void
  isConnected?: boolean
}

export function CommunityChat({ messages, onSendMessage, onDeleteMessage, isConnected = false }: CommunityChatProps) {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t, locale } = useLanguage()

  const dateLocale = locale === "ar" ? ar : locale === "en" ? enUS : fr

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    onSendMessage(newMessage.trim())
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="h-[400px] flex flex-col" dir={locale === "ar" ? "rtl" : "ltr"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="h-4 w-4 text-primary" />
          </div>
          {t("chat.title")}
          <div className={`h-2 w-2 rounded-full shrink-0 ${isConnected ? "bg-green-500" : "bg-red-500"}`} title={isConnected ? "Connected" : "Disconnected"} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto px-4 scroll-smooth">
          <div className="space-y-3 pb-4 pt-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-8">
                {t("chat.noMessages") || "No messages yet"}
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.userId === user?.id
                return (
                  <div key={msg.id} className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                      <AvatarFallback
                        className={`text-xs font-medium ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                      >
                        {msg.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 max-w-[calc(100%-2.5rem)] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`flex items-center gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs font-medium">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true, locale: dateLocale })}
                        </span>
                        {isOwn && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onDeleteMessage?.(msg.id)}
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div
                        className={`inline-block px-3 py-2 rounded-2xl text-sm break-words ${
                          isOwn ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder={user ? (t("chat.placeholder.auth") || "Type a message...") : (t("chat.placeholder.guest") || "Sign in to chat")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!user}
              className="flex-1 h-10"
            />
            <Button
              onClick={handleSend}
              disabled={!user || !newMessage.trim() || !isConnected}
              size="icon"
              className="h-10 w-10 shrink-0"
              title={!isConnected ? "Connecting..." : "Send message"}
            >
              <Send className="h-4 w-4" aria-label={t("chat.send") || "Send"}/>
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-muted-foreground mt-2 text-center">Connecting to chat...</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
