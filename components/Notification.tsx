'use client'

import { useState, useEffect } from 'react'
import { X, Bell, CheckCircle, AlertCircle } from 'lucide-react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export default function Notification({ message, type, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <Bell className="h-5 w-5 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-400/30'
      case 'error':
        return 'bg-red-500/20 border-red-400/30'
      default:
        return 'bg-blue-500/20 border-blue-400/30'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`glass border ${getBgColor()} rounded-xl p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook để quản lý notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'info'
    duration?: number
  }>>([])

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, message, type, duration }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return {
    notifications,
    addNotification,
    removeNotification
  }
}
