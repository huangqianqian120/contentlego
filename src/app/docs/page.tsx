'use client'

import Link from 'next/link'
import { Book, ArrowLeft, ExternalLink, Users, Zap, BarChart3, Share2, Settings, Sparkles } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回首页
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Book className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">文档中心</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/builder" className="btn-primary">
                开始创作
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">目录</h3>
              <nav className="space-y-2">
                <a href="#overview" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                  产品概述
                </a>
                <a href="#features" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                  核心功能模块
                </a>
                <a href="#content-blocks" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 内容模块管理
                </a>
                <a href="#assembler" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 模块拼装构建器
                </a>
                <a href="#ai-generator" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • AI 内容生成器
                </a>
                <a href="#publishing" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 多平台分发
                </a>
                <a href="#templates" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 模板与内容资产库
                </a>
                <a href="#collaboration" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 协作与权限系统
                </a>
                <a href="#analytics" className="block text-sm text-gray-600 hover:text-blue-600 py-1 pl-4">
                  • 数据与分析
                </a>
                <a href="#workflow" className="block text-sm text-gray-600 hover:text-blue-600 py-1">
                  使用流程
                </a>
              </nav>
            </div>
          </div>

          {/* 主要内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* 产品概述 */}
              <section id="overview" className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Content LEGO 用户操作手册</h1>
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">一、产品概述</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Content LEGO 是一个基于"内容工程"理念构建的 SaaS 平台，帮助内容创作者、营销团队与企业客户以结构化、模块化、智能化的方式高效管理与生成内容，实现内容的高复用、低成本与自动化构建。
                  </p>
                </div>
              </section>

              {/* 核心功能模块 */}
              <section id="features" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">二、核心功能模块</h2>

                {/* 内容模块管理 */}
                <div id="content-blocks" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">1. 内容模块管理（Content Blocks）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 支持图文、视频、引用语、数据图表、CTA 等内容单元的创建与管理</li>
                      <li>• 内容模块支持标签、分类、版本历史与权限管理</li>
                      <li>• 内容块支持中英双语及多语言扩展</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 在工作台点击"新建模块" {'>'}  选择模块类型 {'>'} 填写内容 {'>'} 保存</li>
                      <li>• 在模块库中可浏览、搜索、过滤所有已创建的内容模块</li>
                      <li>• 点击模块进入详情页，可编辑、复制、归档、查看使用记录</li>
                    </ul>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href="/bricks" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      访问 Brick Library
                    </Link>
                  </div>
                </div>

                {/* 模块拼装构建器 */}
                <div id="assembler" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">2. 模块拼装构建器（Content Assembler）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 通过可视化拖拽方式拼装内容模块生成完整内容</li>
                      <li>• 支持配置拼装模板（如：产品介绍页、活动邮件、公众号文章等）</li>
                      <li>• 实时预览最终内容结构</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 进入"内容拼装"页面 {'>'} 选择模板或从空白开始</li>
                      <li>• 从左侧模块库中拖入模块进行拼装</li>
                      <li>• 可在中间画布调整顺序、替换内容</li>
                      <li>• 编辑完成后，点击"导出"为HTML、Markdown、PDF等格式</li>
                    </ul>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href="/builder" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      访问内容构建器
                    </Link>
                  </div>
                </div>

                {/* AI 内容生成器 */}
                <div id="ai-generator" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">3. AI 内容生成器（AI Generator）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 基于用户提供的内容目标与语气，智能生成图文、标题、摘要、社交媒体文案等</li>
                      <li>• 支持从模块或结构模板一键生成多语种内容</li>
                      <li>• 提供内容评分、优化建议与改写工具</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 选择"AI生成"功能 {'>'} 输入内容目标、关键词、语气等提示信息</li>
                      <li>• 选择输出类型：文章、社媒文案、邮件等</li>
                      <li>• 点击"生成"后，可查看多版本建议并一键插入拼装器</li>
                      <li>• 支持"AI 改写"按钮快速优化现有内容</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>注意：</strong> AI 功能目前处于基础实现阶段，更多高级功能正在开发中。
                    </p>
                  </div>
                </div>

                {/* 多平台分发 */}
                <div id="publishing" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Share2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">4. 多平台分发（Omnichannel Publishing）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 支持将拼装后的内容同步发布到微信公众号、微博、LinkedIn、Instagram、邮件平台等</li>
                      <li>• 支持定时发布、账号授权管理与发布日志查询</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 进入"内容发布"页 {'>'} 选择发布渠道 {'>'} 连接对应平台账号</li>
                      <li>• 选择内容 {'>'} 设置发布时间与预览格式</li>
                      <li>• 点击"发布"或"定时发布"按钮</li>
                      <li>• 在"发布记录"中查看历史记录与状态</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>开发中：</strong> 多平台分发功能正在开发中，敬请期待。
                    </p>
                  </div>
                </div>

                {/* 模板与内容资产库 */}
                <div id="templates" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Book className="w-5 h-5 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">5. 模板与内容资产库（Templates & Library）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 提供常用内容模板（如宣传页、新闻稿、邮件模板、运营SOP等）</li>
                      <li>• 用户可自定义模板并保存至库中</li>
                      <li>• 模板支持变量占位符与内容模块嵌套</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 在"模板库"中浏览或创建新模板</li>
                      <li>• 支持在线编辑模板结构、变量字段</li>
                      <li>• 模板可在拼装器中复用，也可一键导出</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>部分实现：</strong> 基础模板功能已实现，高级功能正在完善中。
                    </p>
                  </div>
                </div>

                {/* 协作与权限系统 */}
                <div id="collaboration" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">6. 协作与权限系统（Collaboration & Access Control）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 支持多人协作编辑模块、拼装器与内容</li>
                      <li>• 管理员可设置查看/编辑/发布权限</li>
                      <li>• 所有修改记录可追踪、回滚</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 在"团队管理"中邀请成员加入项目</li>
                      <li>• 为成员设置角色与权限（查看/编辑/发布）</li>
                      <li>• 在模块与拼装器中开启"协作模式"查看实时编辑</li>
                      <li>• 在内容历史中查看版本变化，支持回滚</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>开发中：</strong> 协作与权限系统正在开发中，敬请期待。
                    </p>
                  </div>
                </div>

                {/* 数据与分析 */}
                <div id="analytics" className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">7. 数据与分析（Analytics）</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">功能描述：</h4>
                    <ul className="text-gray-600 space-y-2 mb-4">
                      <li>• 查看每个内容模块与发布内容的使用频次、转化率与互动数据</li>
                      <li>• 提供内容效率评分与使用建议</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">用户操作手册：</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• 在"分析面板"中选择时间区间与发布渠道</li>
                      <li>• 查看模块使用频次、被复用次数、被点赞/评论次数（社媒）</li>
                      <li>• 对比不同内容模板的表现</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>开发中：</strong> 数据与分析功能正在开发中，敬请期待。
                    </p>
                  </div>
                </div>
              </section>

              {/* 使用流程 */}
              <section id="workflow" className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">三、使用流程简述</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        1
                      </div>
                      <h3 className="font-semibold text-gray-900">内容工程搭建</h3>
                    </div>
                    <p className="text-gray-600">搭建模块库，定义内容结构</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        2
                      </div>
                      <h3 className="font-semibold text-gray-900">内容生产协作</h3>
                    </div>
                    <p className="text-gray-600">AI+人工生成并拼装内容</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        3
                      </div>
                      <h3 className="font-semibold text-gray-900">内容多端分发</h3>
                    </div>
                    <p className="text-gray-600">多平台发布与追踪效果</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        4
                      </div>
                      <h3 className="font-semibold text-gray-900">内容资产沉淀</h3>
                    </div>
                    <p className="text-gray-600">模板复用、持续优化</p>
                  </div>
                </div>
              </section>

              {/* 联系信息 */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">需要帮助？</h3>
                <p className="text-gray-600 mb-4">
                  如需 API 接入、私有化部署或企业版本定制，请联系我们：
                </p>
                <a href="mailto:support@contentlego.io" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  support@contentlego.io
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}