'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟从 localStorage 或 API 获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('初始化认证失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟用户数据
      const userData: User = {
        id: '1',
        name: email.split('@')[0],
        email: email
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw new Error('登录失败，请检查邮箱和密码')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟用户数据
      const userData: User = {
        id: Date.now().toString(),
        name: name,
        email: email
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw new Error('注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}