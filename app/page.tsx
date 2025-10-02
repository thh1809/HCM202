'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import UploadModal from '@/components/UploadModal'
import DocumentsModal from '@/components/DocumentsModal'
import SettingsModal from '@/components/SettingsModal'
import HelpModal from '@/components/HelpModal'
import Notification, { useNotifications } from '@/components/Notification'

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifications, addNotification, removeNotification } = useNotifications()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onDocumentsClick={() => setIsDocumentsModalOpen(true)}
        onQuestionsClick={() => window.location.href = '/teacher'}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        onHelpClick={() => setIsHelpModalOpen(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {
          addNotification('Tài liệu đã được tải lên thành công!', 'success')
        }}
      />
      
      <DocumentsModal 
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
      />
      
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      
      <HelpModal 
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
