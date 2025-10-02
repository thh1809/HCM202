'use client'

import { X, HelpCircle, BookOpen, MessageSquare, Upload, Settings, Users } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Trợ giúp và Hướng dẫn
              </h2>
              <p className="text-sm text-gray-500">
                Tìm hiểu cách sử dụng ứng dụng Chat AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Giới thiệu */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                <span>Giới thiệu ứng dụng</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  <strong>Chat AI - Tư tưởng Hồ Chí Minh</strong> là ứng dụng hỗ trợ học tập thông minh, 
                  giúp sinh viên tương tác với AI để học tập môn Tư tưởng Hồ Chí Minh một cách hiệu quả.
                </p>
                <p className="text-gray-700">
                  Ứng dụng sử dụng công nghệ AI tiên tiến (Gemini 2.0 Flash) để trả lời câu hỏi, 
                  giải thích khái niệm và hỗ trợ ôn tập.
                </p>
              </div>
            </div>

            {/* Tính năng chính */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Tính năng chính</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">🤖 Chat với AI</h4>
                  <p className="text-blue-800 text-sm">
                    Đặt câu hỏi về Tư tưởng Hồ Chí Minh và nhận câu trả lời chi tiết từ AI
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">📚 Upload giáo trình</h4>
                  <p className="text-green-800 text-sm">
                    Tải lên file PDF/Word để AI đọc và trả lời chính xác hơn
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">💬 Gửi câu hỏi</h4>
                  <p className="text-orange-800 text-sm">
                    Gửi câu hỏi trực tiếp cho giáo viên khi AI không thể trả lời
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">👨‍🏫 Quản lý</h4>
                  <p className="text-purple-800 text-sm">
                    Giáo viên có thể xem và trả lời câu hỏi từ sinh viên
                  </p>
                </div>
              </div>
            </div>

            {/* Hướng dẫn sử dụng */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-green-600" />
                <span>Hướng dẫn sử dụng</span>
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">1. Chat với AI</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Nhập câu hỏi vào ô chat và nhấn "Gửi". AI sẽ trả lời ngay lập tức.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">2. Upload giáo trình</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Click "Tải lên giáo trình" để upload file PDF hoặc Word. AI sẽ đọc và sử dụng nội dung để trả lời chính xác hơn.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-gray-900">3. Gửi câu hỏi cho giáo viên</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Nếu AI không thể trả lời, bạn có thể gửi câu hỏi trực tiếp cho giáo viên.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-gray-900">4. Quản lý (dành cho giáo viên)</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Truy cập trang /teacher để xem và trả lời câu hỏi từ sinh viên.
                  </p>
                </div>
              </div>
            </div>

            {/* Câu hỏi thường gặp */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Câu hỏi thường gặp</span>
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Q: AI có thể trả lời tất cả câu hỏi không?</h4>
                  <p className="text-gray-700 text-sm">
                    A: AI được huấn luyện chuyên về Tư tưởng Hồ Chí Minh và có thể trả lời hầu hết câu hỏi. 
                    Nếu không chắc chắn, AI sẽ đề xuất bạn hỏi giáo viên.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Q: File upload có giới hạn gì không?</h4>
                  <p className="text-gray-700 text-sm">
                    A: File upload giới hạn 10MB và chỉ hỗ trợ định dạng PDF, DOC, DOCX.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Q: Làm sao để giáo viên trả lời câu hỏi?</h4>
                  <p className="text-gray-700 text-sm">
                    A: Giáo viên truy cập trang /teacher để xem danh sách câu hỏi và trả lời trực tiếp.
                  </p>
                </div>
              </div>
            </div>

            {/* Liên hệ hỗ trợ */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-red-600" />
                <span>Liên hệ hỗ trợ</span>
              </h3>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-red-800 mb-2">
                  Nếu bạn gặp vấn đề hoặc cần hỗ trợ thêm, vui lòng liên hệ:
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Email: support@hochiminh-ai.edu.vn</li>
                  <li>• Hotline: 1900-xxxx</li>
                  <li>• Thời gian hỗ trợ: 8:00 - 17:00 (Thứ 2 - Thứ 6)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
