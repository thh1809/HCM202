'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import TeacherDashboard from '@/components/TeacherDashboard'
import UploadModal from '@/components/UploadModal'
import { useNotifications } from '@/components/Notification'

interface Question {
  id: string
  question: string
  studentName: string
  studentId: string
  timestamp: Date
  answered: boolean
  answer?: string
}

export default function TeacherPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const { addNotification } = useNotifications()

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
      addNotification('Lỗi khi tải danh sách câu hỏi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (questionId: string, answer: string) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: questionId,
          answer: answer
        }),
      })

      if (response.ok) {
        addNotification('Trả lời câu hỏi thành công!', 'success')
      } else {
        throw new Error('Failed to submit answer')
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      addNotification('Lỗi khi gửi câu trả lời', 'error')
      throw error
    }
  }

  useEffect(() => {
    fetchQuestions()
    
    // Refresh questions every 30 seconds
    const interval = setInterval(fetchQuestions, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <TeacherDashboard 
            questions={questions}
            onAnswerSubmit={handleAnswerSubmit}
            onRefresh={fetchQuestions}
          />
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  )
}
