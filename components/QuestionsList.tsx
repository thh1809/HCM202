'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, User, Calendar, CheckCircle, Clock } from 'lucide-react'

interface Question {
  id: string
  question: string
  studentName: string
  studentId: string
  timestamp: Date
  answered: boolean
  answer?: string
}

export default function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answer.trim()) return

    setSubmittingAnswer(true)
    try {
      const response = await fetch('/api/questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: questionId,
          answer: answer.trim()
        }),
      })

      if (response.ok) {
        setAnswer('')
        setSelectedQuestion(null)
        fetchQuestions() // Refresh the list
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Câu hỏi từ sinh viên
        </h2>
        <span className="text-sm text-gray-500">
          {questions.length} câu hỏi
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có câu hỏi nào
          </h3>
          <p className="text-gray-500">
            Sinh viên chưa gửi câu hỏi nào cho bạn
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {question.studentName}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({question.studentId})
                    </span>
                    {question.answered ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-2 line-clamp-2">
                    {question.question}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(question.timestamp)}</span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.answered 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {question.answered ? 'Đã trả lời' : 'Chờ trả lời'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trả lời câu hỏi
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">
                    {selectedQuestion.studentName} ({selectedQuestion.studentId})
                  </span>
                </div>
                <p className="text-gray-700">{selectedQuestion.question}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu trả lời của bạn
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Nhập câu trả lời..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedQuestion(null)
                    setAnswer('')
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleAnswerSubmit(selectedQuestion.id)}
                  disabled={!answer.trim() || submittingAnswer}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
