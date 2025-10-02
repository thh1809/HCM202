'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, User, Calendar, CheckCircle, Clock, Filter, Search, SortAsc, SortDesc } from 'lucide-react'

interface Question {
  id: string
  question: string
  studentName: string
  studentId: string
  timestamp: Date
  answered: boolean
  answer?: string
}

interface TeacherDashboardProps {
  questions: Question[]
  onAnswerSubmit: (questionId: string, answer: string) => Promise<void>
  onRefresh: () => void
}

export default function TeacherDashboard({ questions, onAnswerSubmit, onRefresh }: TeacherDashboardProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'pending'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  const filteredQuestions = questions
    .filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'answered' && q.answered) ||
                           (filterStatus === 'pending' && !q.answered)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      }
    })

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answer.trim()) return

    setSubmittingAnswer(true)
    try {
      await onAnswerSubmit(questionId, answer.trim())
      setAnswer('')
      setSelectedQuestion(null)
      onRefresh()
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmittingAnswer(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return 'Vừa xong'
  }

  return (
    <div className="space-y-6">
      {/* Header với thống kê */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Dashboard Quản lý Câu hỏi
              </h2>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-300"
          >
            🔄 Làm mới
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
            <div className="text-sm text-gray-600">Tổng câu hỏi</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{questions.filter(q => !q.answered).length}</div>
            <div className="text-sm text-orange-700">Chờ trả lời</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{questions.filter(q => q.answered).length}</div>
            <div className="text-sm text-green-700">Đã trả lời</div>
          </div>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ trả lời</option>
              <option value="answered">Đã trả lời</option>
            </select>
            
            <button
              onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
            >
              {sortBy === 'newest' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
              <span className="hidden sm:inline">Sắp xếp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không có câu hỏi nào
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Không tìm thấy câu hỏi phù hợp với bộ lọc'
                : 'Sinh viên chưa gửi câu hỏi nào'
              }
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300 card-hover cursor-pointer shadow-sm"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{question.studentName}</span>
                      <span className="text-gray-600 ml-2">({question.studentId})</span>
                    </div>
                    {question.answered ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-400" />
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {question.question}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(question.timestamp)}</span>
                    </div>
                    <span>•</span>
                    <span>{getTimeAgo(question.timestamp)}</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  question.answered 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {question.answered ? 'Đã trả lời' : 'Chờ trả lời'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal trả lời câu hỏi */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💬 Trả lời câu hỏi
              </h3>
              
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{selectedQuestion.studentName}</span>
                  <span className="text-gray-600">({selectedQuestion.studentId})</span>
                </div>
                <p className="text-gray-700">{selectedQuestion.question}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu trả lời của bạn
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Nhập câu trả lời chi tiết..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedQuestion(null)
                    setAnswer('')
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleAnswerSubmit(selectedQuestion.id)}
                  disabled={!answer.trim() || submittingAnswer}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {submittingAnswer ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    'Gửi câu trả lời'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
