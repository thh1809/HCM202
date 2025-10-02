'use client'

import { X, Upload, BookOpen, MessageSquare, Settings, HelpCircle } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onUploadClick: () => void
  onDocumentsClick?: () => void
  onQuestionsClick?: () => void
  onSettingsClick?: () => void
  onHelpClick?: () => void
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  onUploadClick, 
  onDocumentsClick, 
  onQuestionsClick, 
  onSettingsClick, 
  onHelpClick 
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={onUploadClick}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <Upload className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
              <span className="font-medium text-gray-700 group-hover:text-blue-700">
                Tải lên giáo trình
              </span>
            </button>

            <button 
              onClick={() => {
                onDocumentsClick?.()
                onClose()
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <BookOpen className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Tài liệu đã tải
              </span>
            </button>

            <button 
              onClick={() => {
                onQuestionsClick?.()
                onClose()
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <MessageSquare className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Câu hỏi chờ trả lời
              </span>
            </button>

            <button 
              onClick={() => {
                onSettingsClick?.()
                onClose()
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <Settings className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Cài đặt
              </span>
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => {
                onHelpClick?.()
                onClose()
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <HelpCircle className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Trợ giúp
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
