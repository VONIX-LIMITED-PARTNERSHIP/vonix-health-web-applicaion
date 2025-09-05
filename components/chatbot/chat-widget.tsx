"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, ChevronDown, ChevronUp, Loader2 } from "lucide-react" //change Minimize2, Maximize2 to ChevronDown, ChevronUp respectively
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface Message { // Interface is a TypeScript feature that defines the shape of an object.
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  typing?: boolean
}

const QUICK_REPLIES = ["วิธีใช้งานแอพ", "ทำแบบประเมินยังไง", "ดูผลลัพธ์ที่ไหน", "อยากคุยเรื่องสุขภาพ"]

export function ChatWidget() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showInstructions, setShowInstructions] = useState(false) //for the popup instruction about the chatbot for the new users


   // Load messages from localStorage when the widget mounts
   useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Restore timestamps as Date objects
        const restored = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        setMessages(restored)
      } catch (e) {
        console.error("Failed to parse saved chat messages:", e)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Check if current page is an assessment page
  const isAssessmentPage = pathname?.includes("/assessment/") || pathname?.includes("/guest-assessment")

  // Auto scroll to bottom when new message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Focus input when chat opens or after interaction
  useEffect(() => {
    if (isOpen && !isMinimized && hasInteracted && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized, hasInteracted])

  // Show notification when chat is closed and bot sends message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!isOpen && lastMessage?.sender === "bot") {
      setHasNewMessage(true)
    }
  }, [messages, isOpen])

  // Close chat when navigating to assessment pages
  useEffect(() => {
    if (isAssessmentPage && isOpen) {
      setIsOpen(false)
    }
  }, [isAssessmentPage, isOpen])



  const generateBotResponse = async (
    userMessage: string,
    conversation: { role: "user" | "assistant"; content: string }[],
  ): Promise<string> => {
    const userName = profile?.full_name || user?.email?.split("@")[0] || "คุณ"

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation, userName, userId: user?.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response from AI assistant.")
      }

      const data = await response.json()
      return data.response
    } catch (err) {
      console.log("Error sharing:", err)
      return "ขอโทษครับ เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้งนะครับ 😅"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    // Set hasInteracted to true when a message is sent
    setHasInteracted(true)

    // Optimistically render the user message
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {

      type AIMessage = { role: "user" | "assistant"; content: string }

      const conversationForAI: AIMessage[] =  [...messages, userMessage].map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }))

      const botResponse = await generateBotResponse(userMessage.content, conversationForAI)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "ขอโทษครับ เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้งนะครับ 😅",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    setHasInteracted(true) // Set hasInteracted to true when a quick reply is clicked
    setInputValue(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isOpen) {
      // Closing → clear localStorage + state
      localStorage.removeItem("chatMessages") 
      setMessages([]) 
    }
    else {
      // Show instructions only if not seen before
      const seen = localStorage.getItem("chatInstructionsSeen")
      if (!seen) {
        setShowInstructions(true)
        localStorage.setItem("chatInstructionsSeen", "true")
      }
      setHasNewMessage(false)
    }
    setIsOpen(!isOpen)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  // Don't render chat widget on assessment pages
  if (isAssessmentPage) {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          onClick={toggleChat}
          className={cn(
            // "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-2 border-white/20",
            !isOpen? "h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 pulse-glow":"hidden",
          )}
        >
          {!isOpen &&  <MessageCircle className="h-6 w-6 text-white" />}

          {/* New message indicator */}
          {hasNewMessage && !isOpen && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        // when minimized, position at bottom-right corner
        <div className={cn("fixed right-0 sm:right-2 z-[99] w-96 h-[700px] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] rounded-xl flex flex-col transition-all duration-300",isMinimized ? "h-[60px] bottom-0 right-0 p-0" : "h-[600px] top-1")}>
          <Card className="h-full bg-card dark:bg-card-foreground backdrop-blur-xl shadow-2xl flex flex-col border-2 border border-white/10 overflow-hidden">
            {/* Header */}
            <CardHeader className="py-2 ps-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg flex flex-row items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-4 ">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-3 border-white/30 shadow-lg">
                    <AvatarImage src="/chatbot-avatar-v2.png" />
                    <AvatarFallback className="bg-white/20 text-white text-lg font-bold backdrop-blur-sm">
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-wide">ผู้ช่วยอัจฉริยะ</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-white/90">
                    {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> */}
                    <span className="font-medium">พร้อมช่วยเหลือ 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimize}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-white dark:bg-[#12131a]">
                  {/* Instruction about button X and ChevronUp */}
                  {showInstructions && (
                    <div className="px-4 py-3 mb-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200 rounded-lg text-sm shadow-sm flex items-start justify-between">
                      <span>
                        ℹ️ <strong>วิธีใช้งาน:</strong>  
                        กด <ChevronUp className="inline-block h-4 w-4 mx-1" /> เพื่อลดขนาด (ประวัติยังคงอยู่)  
                        และกด <X className="inline-block h-4 w-4 mx-1" /> เพื่อปิดแชทและลบประวัติ
                      </span>
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="ml-2 text-xs font-semibold underline"
                      >
                        ปิด
                      </button>
                    </div>
                  )}

                  <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "flex items-start space-x-3 max-w-[85%]",
                              message.sender === "user" ? "flex-row-reverse space-x-reverse" : "",
                            )}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              {message.sender === "bot" ? (
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              ) : (
                                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div
                              className={cn(
                                "rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-md",
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-200 dark:shadow-blue-900/50"
                                  : "bg-gray-100 text-gray-800 dark:bg-[#1e1e2f] dark:text-gray-100 border border-gray-700/60",
                              )}
                            >
                              <div className="whitespace-pre-wrap font-medium">{message.content}</div>
                              <div
                                className={cn(
                                  "text-xs mt-3 opacity-75 font-medium",
                                  message.sender === "user" ? "text-white/80" : "text-muted-foreground",
                                )}
                              >
                                {message.timestamp.toLocaleTimeString("th-TH", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="flex items-start space-x-3 max-w-[85%]">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted dark:bg-secondary border border-border rounded-2xl px-4 py-3 shadow-sm">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Quick Replies - Only visible if not interacted yet */}
                  {!hasInteracted && (
                    <div className="px-6 py-4 bg-accent/20 dark:bg-gray-700/40 text-white border-t border-border flex-shrink-0">
                      <div className="text-sm text-foreground mb-3 font-semibold">💡 คำถามยอดนิยม</div>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_REPLIES.map((reply, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-xs px-3 py-2 rounded-xl bg-secondary dark:bg-secondary border border-border text-center justify-center h-auto text-secondary-foreground font-medium shadow-sm hover:shadow-md"
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Input Area - Always visible */}
                <div className="p-3  bg-background dark:bg-muted border-t border-border flex-shrink-0">
                  <div className="flex items-end space-x-4">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 rounded-2xl border-2 border-input focus:border-primary px-5 py-4 bg-background focus:bg-background transition-all duration-200 resize-none min-h-[52px] text-foreground placeholder:text-muted-foreground"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-4 h-[px] w-[52px] shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0"
                    >
                      {isTyping ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Send className="h-5 w-5 text-white" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center leading-relaxed font-medium"></div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
