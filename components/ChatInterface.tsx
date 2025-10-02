'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import QuestionModal from './QuestionModal'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '🌟 **Xin chào!** Tôi là AI hỗ trợ học tập môn **Tư tưởng Hồ Chí Minh**. Tôi có thể giúp bạn:\n\n✨ **Tính năng chính:**\n• 📚 Trả lời câu hỏi về tư tưởng Hồ Chí Minh\n• 🎯 Giải thích các khái niệm và nguyên lý\n• 📖 Hỗ trợ ôn tập và chuẩn bị thi\n• 👨‍🏫 Gửi câu hỏi trực tiếp cho giáo viên\n\n🚀 **Hãy đặt câu hỏi của bạn ngay bây giờ!**',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.',
        role: 'assistant',
        timestamp: new Date()
      }

      // Check if AI suggests asking teacher
      if (data.response && (
        data.response.includes('hỏi giáo viên') || 
        data.response.includes('không chắc chắn') ||
        data.response.includes('không thể trả lời')
      )) {
        assistantMessage.content += '\n\n💡 **Gợi ý:** Nếu bạn cần câu trả lời chi tiết hơn, hãy gửi câu hỏi trực tiếp cho giáo viên!'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-slide-in`}
          >
            <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
              }`}>
                {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className={message.role === 'user' ? 'prose-invert' : ''}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <div className={`text-xs mt-3 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white rounded-2xl px-6 py-4 border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                  <span className="text-gray-700">Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi về Tư tưởng Hồ Chí Minh..."
            className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-lg btn-hover card-hover"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Gửi</span>
          </button>
        </form>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => setInput('Tư tưởng Hồ Chí Minh về độc lập dân tộc là gì?')}
            className="px-4 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300 card-hover"
            disabled={isLoading}
          >
            🏛️ Độc lập dân tộc
          </button>
          <button
            onClick={() => setInput('Nguyên tắc "Đảng lãnh đạo, Nhà nước quản lý, nhân dân làm chủ" được hiểu như thế nào?')}
            className="px-4 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300 card-hover"
            disabled={isLoading}
          >
            🎯 Nguyên tắc lãnh đạo
          </button>
          <button
            onClick={() => setInput('Tư tưởng Hồ Chí Minh về đạo đức cách mạng có những nội dung gì?')}
            className="px-4 py-2 text-sm bg-gray-100 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-300 card-hover"
            disabled={isLoading}
          >
            💎 Đạo đức cách mạng
          </button>
          <button
            onClick={() => {
              setPendingQuestion('')
              setIsQuestionModalOpen(true)
            }}
            className="px-4 py-2 text-sm bg-orange-100 border border-orange-200 text-orange-700 rounded-full hover:bg-orange-200 transition-all duration-300 card-hover flex items-center space-x-1"
            disabled={isLoading}
          >
            <MessageSquare className="h-3 w-3" />
            <span>Gửi câu hỏi cho giáo viên</span>
          </button>
        </div>
      </div>

      {/* Question Modal */}
      <QuestionModal 
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        initialQuestion={pendingQuestion}
      />
    </div>
  )
}
