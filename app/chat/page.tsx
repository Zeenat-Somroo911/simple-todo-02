'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Bot, User, AlertCircle } from 'lucide-react'
import { auth } from '@/lib/auth'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check authentication and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const authResult = await auth.verifyAuth()
      if (!authResult.authenticated || !authResult.user) {
        router.push('/login')
        return
      }
      setUserId(authResult.user.id)
    }
    checkAuth()
  }, [router])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || !userId) return

    const userMessageText = inputMessage.trim()
    setInputMessage('')
    setError(null)

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call Next.js API route which proxies to FastAPI
      const response = await fetch(`/api/chat/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessageText,
          conversation_id: conversationId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        // Handle both FastAPI format (detail) and Next.js format (error)
        const errorMessage = errorData.detail || errorData.error || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Update conversation_id if this is the first message
      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id)
      }

      // Ensure response is always a string (handle cases where it might be an object)
      let responseText = 'No response received'
      if (data.response) {
        if (typeof data.response === 'string') {
          responseText = data.response
          // Check if the string itself is "[object Object]" (which shouldn't happen but just in case)
          if (responseText.trim() === '[object Object]' || responseText.trim() === '[object object]') {
            console.error('Received "[object Object]" as string response:', data)
            responseText = 'I\'m sorry, I encountered an error processing the response. Please try again.'
          }
        } else if (typeof data.response === 'object') {
          // If response is an object, try to convert it to a readable string
          try {
            responseText = JSON.stringify(data.response, null, 2)
          } catch (e) {
            console.error('Error stringifying response object:', e, data.response)
            responseText = 'I\'m sorry, I encountered an error formatting the response.'
          }
        } else {
          try {
            responseText = String(data.response)
            // Check if string conversion resulted in object representation
            if (responseText.trim() === '[object Object]' || responseText.trim() === '[object object]') {
              responseText = 'I\'m sorry, I encountered an error processing the response.'
            }
          } catch (e) {
            console.error('Error converting response to string:', e)
            responseText = 'I\'m sorry, I couldn\'t process the response.'
          }
        }
      }
      
      // Final safety check
      if (!responseText || responseText.trim() === '' || 
          responseText.trim() === '[object Object]' || 
          responseText.trim() === '[object object]') {
        responseText = 'I\'m sorry, I couldn\'t generate a response. Please try again.'
      }

      // Add assistant message to UI
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat API error:', err)
      
      let errorMessage = 'Failed to send message. Please try again.'
      
      // Handle different error types - ensure we never get "[object Object]"
      try {
        if (err instanceof Error) {
          errorMessage = err.message || 'An error occurred'
        } else if (err && typeof err === 'object') {
          // Try to extract a meaningful error message
          if ('message' in err && typeof err.message === 'string') {
            errorMessage = err.message
          } else if ('detail' in err && typeof err.detail === 'string') {
            errorMessage = err.detail
          } else if ('error' in err && typeof err.error === 'string') {
            errorMessage = err.error
          } else {
            // Last resort - try JSON.stringify but catch if it fails
            try {
              const errStr = JSON.stringify(err)
              if (errStr && errStr !== '{}' && !errStr.includes('[object')) {
                errorMessage = errStr
              }
            } catch {
              errorMessage = 'An unknown error occurred'
            }
          }
        } else if (typeof err === 'string') {
          errorMessage = err
        } else {
          errorMessage = String(err) || 'An error occurred'
        }
      } catch (parseError) {
        console.error('Error parsing error message:', parseError)
        errorMessage = 'An error occurred while processing your request'
      }
      
      // Ensure errorMessage is a valid string and not "[object Object]"
      if (!errorMessage || errorMessage.trim() === '' || 
          errorMessage.includes('[object Object]') || 
          errorMessage.includes('[object object]')) {
        errorMessage = 'An error occurred. Please try again.'
      }
      
      // Check for network errors
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.'
      }
      
      setError(errorMessage)
      
      // Show error message in chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 mt-16">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            AI Todo Assistant
          </h1>
        </div>
      </header>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation by typing a message below
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isLoading || !userId}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading || !userId}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

