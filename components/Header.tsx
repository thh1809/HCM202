'use client'

import { Menu, Upload, BookOpen, Users } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  onUploadClick: () => void
}

export default function Header({ onMenuClick, onUploadClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 lg:hidden btn-hover"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Chat AI - Tư tưởng Hồ Chí Minh
              </h1>
              <p className="text-sm text-gray-600">
                Hỗ trợ học tập và trao đổi kiến thức
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg btn-hover card-hover"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Tải lên giáo trình</span>
          </button>
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-xl border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}
