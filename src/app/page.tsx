'use client'

import Link from 'next/link'
import { Blocks, Sparkles, Zap, Users, User, LogOut } from 'lucide-react'
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* 背景装饰元素 - 基于Logo变形设计 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Logo变形背景 - 从左上角延伸的积木图形 */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* 主要积木形状变形 - 从logo位置开始 */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500/25 rounded-lg transform rotate-12 animate-pulse shadow-lg" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-12 left-16 w-12 h-12 bg-blue-400/20 rounded-lg transform rotate-45 animate-pulse shadow-md" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
          <div className="absolute top-24 left-32 w-16 h-16 bg-purple-400/18 rounded-xl transform -rotate-12 animate-pulse shadow-md" style={{animationDelay: '1s', animationDuration: '5s'}}></div>
          <div className="absolute top-40 left-56 w-20 h-20 bg-indigo-400/15 rounded-2xl transform rotate-30 animate-pulse shadow-lg" style={{animationDelay: '1.5s', animationDuration: '6s'}}></div>
          

          
          {/* 散布的小积木块 */}
          <div className="absolute top-32 left-80 w-6 h-6 bg-blue-300/30 rounded transform rotate-45 animate-bounce shadow-sm" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
          <div className="absolute top-56 left-96 w-8 h-8 bg-purple-300/25 rounded-lg transform -rotate-30 animate-bounce shadow-sm" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
          <div className="absolute top-80 left-[28rem] w-10 h-10 bg-indigo-300/22 rounded-xl transform rotate-60 animate-bounce shadow-md" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          
          {/* 右侧呼应的积木形状 */}
          <div className="absolute top-20 right-20 w-14 h-14 bg-pink-300/20 rounded-xl transform -rotate-45 animate-pulse shadow-md" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-48 right-32 w-12 h-12 bg-cyan-300/25 rounded-lg transform rotate-30 animate-pulse shadow-sm" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
          
          {/* 底部积木群 */}
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-200/20 rounded-2xl transform rotate-15 shadow-md"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-purple-200/25 rounded-xl transform -rotate-20 shadow-sm"></div>
          <div className="absolute bottom-40 right-1/4 w-18 h-18 bg-indigo-200/18 rounded-2xl transform rotate-25 shadow-md"></div>
        </div>
        
        {/* 主要渐变背景 - 配合积木主题 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-pink-200/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-200/15 to-blue-200/15 rounded-full blur-3xl"></div>
        
        {/* 积木网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      {/* 导航栏 */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Blocks className="h-8 w-8 text-primary-600" />
            </div>
            <div className="hidden md:flex items-center justify-end flex-1 space-x-8 mr-8">
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
            <div className="flex items-center space-x-4">
              <UserSection />
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main>
        {/* Hero Section */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center" style={{alignItems: 'center', transform: 'translateY(-5vh)'}}>
          {/* Hero背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 动态光晕效果 */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
            
            {/* 浮动几何图形 */}
            <div className="absolute top-32 left-16 w-4 h-4 bg-blue-300/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
            <div className="absolute top-48 right-20 w-3 h-3 bg-purple-300/30 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
            <div className="absolute bottom-48 left-32 w-2 h-2 bg-pink-300/30 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
            
            {/* 装饰性线条 */}
            <svg className="absolute top-40 right-32 w-16 h-16 text-indigo-200/30" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M8 8L24 24M24 8L8 24" strokeLinecap="round" />
            </svg>
          </div>
          
          <div className="text-center w-full relative z-10">
            <h2 className="text-xl font-medium tracking-tight text-gray-600 sm:text-2xl mb-12">
              用 <span className="text-blue-600 font-semibold">Content Engineering</span> 构建内容的基础设施
            </h2>
            <h1 className="mt-16 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl leading-relaxed mb-20">
              让内容像积木一样被
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                结构化、复用和自动化构建
              </span>
            </h1>
          </div>
        </section>

        {/* 功能特性 */}
        <section className="py-32 bg-white/50 backdrop-blur-sm min-h-screen flex items-center relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-green-100/30 to-blue-100/30 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                为什么选择 Content LEGO？
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                模块化设计理念，让内容创作变得更加高效、标准化和可扩展
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Blocks className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">模块化 Brick</h3>
                <p className="text-gray-600 leading-relaxed">
                  将内容拆解为可复用的 Brick 单元，支持文本、图片、CTA、FAQ等多种类型，
                  一次创建，多处使用。
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">AI智能助手</h3>
                <p className="text-gray-600 leading-relaxed">
                  基于上下文的AI内容生成，支持标题、段落、CTA等自动创建，
                  提供多种风格改写选项。
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">拖拽构建</h3>
                <p className="text-gray-600 leading-relaxed">
                  直观的可视化编辑器，支持拖拽组合 Brick，实时预览效果，
                  快速构建专业内容。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 使用场景 */}
        <section className="py-32 bg-gradient-to-br from-gray-50/80 to-blue-50/40 min-h-screen flex items-center relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-20 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 right-20 w-56 h-56 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl"></div>
            
            {/* 装饰图形 */}
            <svg className="absolute top-16 right-16 w-20 h-20 text-blue-100/40" fill="currentColor" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                适用场景
              </h2>
              <p className="text-lg text-gray-600">
                从个人创作者到企业团队，满足不同规模的内容创作需求
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">个人创作者</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  独立博客、播客、Newsletter 撰写与分发
                </p>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    提高内容创作效率
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    保持风格一致性
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    AI辅助内容生成
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">小型营销团队</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  多平台品牌内容日更、AI辅助内容协作
                </p>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    团队协作与共享
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    多平台内容适配
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></div>
                    品牌一致性管理
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">企业级客户</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  多渠道品牌一致性管理、内容资产集中管理
                </p>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    大规模内容管理
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    权限与角色控制
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
                    数据分析与优化
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              准备好开始您的内容创作之旅了吗？
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              立即体验 Content LEGO，让内容创作变得更加高效和有趣
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder" className="bg-white text-blue-600 hover:bg-gray-50 font-semibold py-4 px-10 rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Sparkles className="w-5 h-5 mr-2" />
                开始免费使用
              </Link>
              <Link href="/docs" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold py-4 px-10 rounded-xl transition-all duration-300 inline-flex items-center backdrop-blur-sm">
                查看演示
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Blocks className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Content LEGO</span>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-400 mb-2">
                 © 2025 Content LEGO. 让内容创作更加模块化和高效。
               </div>
              <div className="text-xs text-gray-500">
                用 AI 和模块化设计重新定义内容创作
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}