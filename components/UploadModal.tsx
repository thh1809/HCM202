'use client'

import { useState } from 'react'
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess?: () => void
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error')
      setUploadMessage('Chỉ hỗ trợ file PDF và Word (.pdf, .doc, .docx)')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus('error')
      setUploadMessage('File quá lớn. Kích thước tối đa là 10MB')
      return
    }

    setUploading(true)
    setUploadStatus('idle')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadStatus('success')
        setUploadMessage(`Tải lên thành công! Đã xử lý ${data.pages || 0} trang.`)
        onUploadSuccess?.()
      } else {
        setUploadStatus('error')
        setUploadMessage(data.error || 'Có lỗi xảy ra khi tải lên file')
      }
    } catch (error) {
      setUploadStatus('error')
      setUploadMessage('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }

  const resetModal = () => {
    setUploadStatus('idle')
    setUploadMessage('')
    setUploading(false)
    setDragActive(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Tải lên giáo trình
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {uploadStatus === 'success' ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tải lên thành công!
              </h3>
              <p className="text-gray-600 mb-6">{uploadMessage}</p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-600 mb-6">{uploadMessage}</p>
              <button
                onClick={() => resetModal()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Kéo thả file vào đây
                </h3>
                <p className="text-gray-600 mb-4">
                  hoặc click để chọn file
                </p>
                <input
                  type="file"
                  onChange={handleFileInput}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? 'Đang tải lên...' : 'Chọn file'}
                </label>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Hỗ trợ các định dạng:</p>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span>PDF (.pdf)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>Word (.doc, .docx)</span>
                  </li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  Kích thước tối đa: 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
