'use client'
import axios from 'axios'
import gsap from 'gsap'
import { Eye, EyeOff, CheckCircle, AlertCircle, X } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const page = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const messageRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text)
    setMessageType(type)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    requestAnimationFrame(() => {
      if (messageRef.current) {
        gsap.to(messageRef.current, {
          right: 5,
          duration: 0.2,
          opacity: 1,
        })
      }
    })
    
    timeoutRef.current = setTimeout(() => {
      hideMessage();
    }, 5000)
  }

  const hideMessage = () => {
    if (messageRef.current) {
      gsap.to(messageRef.current, {
        right: -100,
        duration: 0.2,
        opacity: 0,
        onComplete: () => {
          setMessage("")
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
        }
      })
    }
  }

  const dismissMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    hideMessage()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage("Please fill in all required fields.", 'error')
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      showMessage("New passwords don't match. Please try again.", 'error')
      setIsLoading(false)
      return
    }

    if (currentPassword === newPassword) {
      showMessage("New password must be different from your current password.", 'error')
      setIsLoading(false)
      return
    }

    try {
      const curUser = JSON.parse(localStorage.getItem('curUser') || "null") 
      axios.post("http://localhost:3000/api/users", {id: curUser.id, type: 'getPass'})
      .then(result => {
        const data = result.data;
        const pass = data.password;
        if (currentPassword == pass) {
          axios.post("http://localhost:3000/api/users", {id: curUser.id, password: newPassword, type: 'update'});
          showMessage("Password updated successfully!", 'success')
        } else {
          showMessage("Enter your current password correctly.", 'error')
        }
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      showMessage("An error occurred while updating your password. Please try again.", 'error')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword)
        break
      case 'new':
        setShowNewPassword(!showNewPassword)
        break
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  const getMessageConfig = () => {
    switch (messageType) {
      case 'success':
        return {
          bgColor: 'bg-green-500/90',
          textColor: 'text-white',
          icon: <CheckCircle className="w-5 h-5" />,
          borderColor: 'border-green-400'
        }
      case 'error':
        return {
          bgColor: 'bg-red-500/90',
          textColor: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />,
          borderColor: 'border-red-400'
        }
      case 'info':
        return {
          bgColor: 'bg-blue-500/90',
          textColor: 'text-white',
          icon: <AlertCircle className="w-5 h-5" />,
          borderColor: 'border-blue-400'
        }
    }
  }

  const messageConfig = getMessageConfig()
  return (
    <div className='bg-black h-screen w-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-8 flex items-center justify-center relative'>
      {message && (
        <div ref={messageRef} className={`fixed transform bottom-10 right-0 opacity-0 z-50 ${messageConfig.bgColor} ${messageConfig.textColor} backdrop-blur-md rounded-xl px-6 py-4 shadow-2xl border ${messageConfig.borderColor} transition-all duration-300 ease-in-out animate-slide-down max-w-md w-full mx-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {messageConfig.icon}
              <span className="font-medium text-sm">{message}</span>
            </div>
            <button
              onClick={dismissMessage}
              className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className='max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-slate-700'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Update Password</h1>
          <p className='text-slate-400'>Enter your current password and choose a new one</p>
        </div>

        <div className='space-y-6'>
          <div>
            <label htmlFor='currentPassword' className='block text-sm font-medium text-slate-300 mb-2'>
              Current Password
            </label>
            <div className='relative'>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                placeholder='Enter your current password'
                required
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('current')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white transition-colors'
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor='newPassword' className='block text-sm font-medium text-slate-300 mb-2'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                placeholder='Enter your new password'
                required
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('new')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white transition-colors'
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-slate-300 mb-2'>
              Confirm New Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                placeholder='Confirm your new password'
                required
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('confirm')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white transition-colors'
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800'
            onClick={handleSubmit}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                Updating Password...
              </div>
            ) : (
              'Update Password'
            )}
          </button>
        </div>

        <div className='mt-8 text-center'>
          <button className='text-slate-400 hover:text-white transition-colors text-sm'>
            Back to Account Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default page