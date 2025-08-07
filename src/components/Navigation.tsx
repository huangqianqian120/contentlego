'use client'

import Link from 'next/link'
import { Blocks, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// 用户区域组件
function UserSection() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
            <span className="hidden md:block">{user.name}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm text-gray-500 border-b">
                {user.email}
              </div>
              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                设置
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-gray-600 hover:text-gray-900">
        登录
      </Link>
      <Link href="/register" className="btn-primary">
        注册
      </Link>
    </div>
  )
}

interface NavigationProps {
  title?: string
  showBackButton?: boolean
}

export default function Navigation({ title, showBackButton = false }: NavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Blocks className="h-8 w-8 text-primary-600" />
              <Link href="/" className="text-xl font-bold text-gradient">
                Content LEGO
              </Link>
            </div>
            {title && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-lg font-medium text-gray-900">{title}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-8">
            {/* 产品功能下拉菜单 */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 flex items-center">
                  产品功能
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-96 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/bricks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">内容模块管理 (Content Bricks)</Link>
                    <Link href="/builder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">内容拼装 (Content Assembler)</Link>
                    <Link href="/ai-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">AI 内容生成器 (AI Content Generator)</Link>
                    <Link href="/templates" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">模板与内容资产库 (Templates & Library)</Link>
                    <Link href="/publishing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">多平台分发 (Omnichannel Publishing)</Link>
                    <Link href="/collaboration" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">协作与权限系统 (Collaboration & Access Control)</Link>
                    <Link href="/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">数据与分析 (Analytics)</Link>
                  </div>
                </div>
              </div>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">文档中心</Link>
            </div>
            
            {/* 用户区域 */}
            <UserSection />
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}