'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generateContent, rewriteContent } from '@/services/deepseek'
import { aiApi } from '@/services/api'
import { Navigation } from '@/components'
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Download, 
  Settings, 
  Wand2, 
  FileText, 
  MessageSquare, 
  Mail, 
  Megaphone,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface GenerationRequest {
  contentType: 'article' | 'social' | 'email' | 'title' | 'summary' | 'ad'
  topic: string
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative'
  length: 'short' | 'medium' | 'long'
  language: 'zh' | 'en'
}

interface GeneratedContent {
  id: string
  content: string
  type: string
  score: number
  createdAt: string
  feedback?: 'positive' | 'negative'
}

const mockGeneratedContent: GeneratedContent[] = [
  {
    id: '1',
    content: '# Content LEGO：重新定义内容创作的未来\n\n在数字化时代，内容创作已成为企业营销和品牌建设的核心。然而，传统的内容创作方式往往效率低下、成本高昂，难以满足快速变化的市场需求。Content LEGO 应运而生，以"内容工程"的全新理念，为内容创作者和企业提供了一个革命性的解决方案。\n\n## 什么是 Content LEGO？\n\nContent LEGO 是一个基于模块化思维构建的 SaaS 平台，它将内容创作过程分解为可重复使用的"内容积木"。就像乐高积木一样，用户可以通过组合不同的内容模块，快速构建出符合需求的完整内容。\n\n## 核心优势\n\n### 1. 模块化设计\n- 将复杂的内容拆分为可重用的组件\n- 支持文本、图片、视频、CTA等多种内容类型\n- 一次创建，多次复用，大幅提升效率\n\n### 2. AI 智能助手\n- 基于先进的 AI 技术，智能生成高质量内容\n- 支持多种语言和写作风格\n- 提供内容优化建议和改写功能\n\n### 3. 多平台分发\n- 一键发布到微信、微博、LinkedIn等多个平台\n- 自动适配不同平台的格式要求\n- 统一管理所有发布渠道\n\n立即体验 Content LEGO，开启高效内容创作之旅！',
    type: 'article',
    score: 92,
    createdAt: '2024-01-15T10:30:00Z',
    feedback: 'positive'
  },
  {
    id: '2',
    content: '🚀 Content LEGO 正式发布！\n\n告别传统内容创作的繁琐流程，拥抱模块化内容工程的新时代！\n\n✨ 核心特性：\n📝 模块化内容管理\n🤖 AI 智能生成\n🔄 可视化拼装\n📱 多平台一键分发\n\n让内容创作像搭积木一样简单有趣！\n\n#ContentLEGO #内容工程 #AI创作 #营销工具\n\n👉 立即免费试用：contentlego.com',
    type: 'social',
    score: 88,
    createdAt: '2024-01-15T10:25:00Z'
  },
  {
    id: '3',
    content: '主题：Content LEGO - 让内容创作更简单\n\n亲爱的 [用户姓名]，\n\n您好！\n\n我们很高兴向您介绍 Content LEGO - 一个革命性的内容创作平台。\n\n在这个信息爆炸的时代，高质量的内容创作变得越来越重要，但同时也越来越具有挑战性。Content LEGO 通过模块化的方式，让内容创作变得像搭积木一样简单。\n\n🎯 为什么选择 Content LEGO？\n\n• 模块化设计：将内容拆分为可重用的组件\n• AI 智能助手：自动生成和优化内容\n• 多平台发布：一键分发到所有主要平台\n• 团队协作：支持多人实时协作编辑\n\n现在注册即可获得 14 天免费试用，体验全新的内容创作方式！\n\n[立即开始免费试用]\n\n如有任何问题，请随时联系我们的客服团队。\n\n祝好，\nContent LEGO 团队',
    type: 'email',
    score: 85,
    createdAt: '2024-01-15T10:20:00Z'
  }
]

export default function AIGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'settings'>('generate')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>(mockGeneratedContent)
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)
  
  const [request, setRequest] = useState<GenerationRequest>({
    contentType: 'article',
    topic: '',
    tone: 'professional',
    length: 'medium',
    language: 'zh'
  })
  

  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [contentToSave, setContentToSave] = useState<GeneratedContent | null>(null)

  const contentTypes = [
    { value: 'article', label: '文章', icon: FileText },
    { value: 'social', label: '社交媒体', icon: MessageSquare },
    { value: 'email', label: '邮件', icon: Mail },
    { value: 'title', label: '标题', icon: Wand2 },
    { value: 'summary', label: '摘要', icon: FileText },
    { value: 'ad', label: '广告文案', icon: Megaphone }
  ]

  const tones = [
    { value: 'professional', label: '专业' },
    { value: 'casual', label: '轻松' },
    { value: 'friendly', label: '友好' },
    { value: 'formal', label: '正式' },
    { value: 'creative', label: '创意' }
  ]

  // 根据内容类型获取对应的长度选项
  const getLengthOptions = (contentType: string) => {
    switch (contentType) {
      case 'title':
        return [
          { value: 'short', label: '简短 (5-10字)' },
          { value: 'medium', label: '中等 (10-20字)' },
          { value: 'long', label: '详细 (20-30字)' }
        ]
      case 'social':
        return [
          { value: 'short', label: '简短 (50-100字)' },
          { value: 'medium', label: '中等 (100-200字)' },
          { value: 'long', label: '详细 (200-300字)' }
        ]
      case 'summary':
        return [
          { value: 'short', label: '简短 (50-150字)' },
          { value: 'medium', label: '中等 (150-300字)' },
          { value: 'long', label: '详细 (300-500字)' }
        ]
      case 'ad':
        return [
          { value: 'short', label: '简短 (20-50字)' },
          { value: 'medium', label: '中等 (50-100字)' },
          { value: 'long', label: '详细 (100-200字)' }
        ]
      case 'email':
        return [
          { value: 'short', label: '简短 (200-500字)' },
          { value: 'medium', label: '中等 (500-1000字)' },
          { value: 'long', label: '详细 (1000-1500字)' }
        ]
      case 'article':
      default:
        return [
          { value: 'short', label: '简短 (300-600字)' },
          { value: 'medium', label: '中等 (600-1200字)' },
          { value: 'long', label: '详细 (1200-2000字)' }
        ]
    }
  }

  const lengths = getLengthOptions(request.contentType)

  const handleGenerate = async () => {
    if (!request.topic.trim()) {
      alert('请输入内容主题')
      return
    }

    setIsGenerating(true)
    
    try {
      // 调用 Deepseek LLM API 生成内容
      const newContent = await generateContent(request)
      
      setGeneratedContent(prev => [newContent, ...prev])
      setSelectedContent(newContent)
    } catch (error) {
      console.error('生成内容失败:', error)
      alert(error instanceof Error ? error.message : '生成内容失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }



  const handleFeedback = (contentId: string, feedback: 'positive' | 'negative') => {
    setGeneratedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, feedback }
          : content
      )
    )
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert('内容已复制到剪贴板')
  }

  const insertToBuilder = (content: GeneratedContent) => {
    // 模拟插入到拼装器的功能
    alert(`内容已插入到拼装器：${content.content.substring(0, 50)}...`)
  }

  const openSaveModal = (content: GeneratedContent) => {
    setContentToSave(content)
    setSaveTitle(`AI生成的${contentTypes.find(t => t.value === content.type)?.label || content.type}`)
    setShowSaveModal(true)
  }

  const saveAsBrick = async () => {
    if (!contentToSave || !saveTitle.trim()) {
      alert('请输入标题')
      return
    }

    try {
      const brick = await aiApi.saveAsBrick({
        content: contentToSave.content,
        contentType: contentToSave.type,
        title: saveTitle,
        tags: ['AI生成']
      })
      
      alert(`内容已保存为Brick！ID: ${brick.id}`)
      setShowSaveModal(false)
      setSaveTitle('')
      setContentToSave(null)
    } catch (error) {
      console.error('保存Brick失败:', error)
      alert('保存失败，请稍后重试')
    }
  }

  const handleRewriteContent = async (contentId: string) => {
    const content = generatedContent.find(c => c.id === contentId)
    if (!content) return
    
    setIsGenerating(true)
    
    try {
      // 调用 Deepseek LLM API 改写内容
      const rewrittenContent = await rewriteContent(content.content, {
        contentType: content.type as any,
        tone: request.tone,
        language: request.language
      })
      
      setGeneratedContent(prev => [rewrittenContent, ...prev])
      setSelectedContent(rewrittenContent)
    } catch (error) {
      console.error('改写内容失败:', error)
      alert(error instanceof Error ? error.message : '改写内容失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="AI 内容生成器" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：生成配置 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">生成配置</h3>
              
              <div className="space-y-6">
                {/* 内容类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">内容类型</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map(type => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          onClick={() => setRequest(prev => ({ ...prev, contentType: type.value as any }))}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            request.contentType === type.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          {type.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 主题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">内容主题 *</label>
                  <textarea
                    value={request.topic}
                    onChange={(e) => setRequest(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="请描述您想要生成的内容主题..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                {/* 语调 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">语调风格</label>
                  <select
                    value={request.tone}
                    onChange={(e) => setRequest(prev => ({ ...prev, tone: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {tones.map(tone => (
                      <option key={tone.value} value={tone.value}>{tone.label}</option>
                    ))}
                  </select>
                </div>

                {/* 长度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">内容长度</label>
                  <select
                    value={request.length}
                    onChange={(e) => setRequest(prev => ({ ...prev, length: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {lengths.map(length => (
                      <option key={length.value} value={length.value}>{length.label}</option>
                    ))}
                  </select>
                </div>



                {/* 生成按钮 */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !request.topic.trim()}
                  className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      生成内容
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：生成结果 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* 标签页导航 */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('generate')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'generate'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Wand2 className="w-4 h-4 inline mr-2" />
                    生成结果
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'history'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-2" />
                    历史记录
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'generate' && (
                  <div>
                    {selectedContent ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold text-gray-900">生成结果</h3>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">质量评分: {selectedContent.score}/100</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => insertToBuilder(selectedContent)}
                              className="btn-primary text-sm"
                            >
                              插入拼装器
                            </button>
                            <button
                              onClick={() => openSaveModal(selectedContent)}
                              className="btn-secondary text-sm"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              保存为Brick
                            </button>
                            <button
                              onClick={() => handleRewriteContent(selectedContent.id)}
                              className="btn-secondary text-sm"
                              disabled={isGenerating}
                            >
                              <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                              AI改写
                            </button>
                            <button
                              onClick={() => copyToClipboard(selectedContent.content)}
                              className="btn-secondary text-sm"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              复制
                            </button>
                            <button className="btn-secondary text-sm">
                              <Download className="w-4 h-4 mr-1" />
                              导出
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                            {selectedContent.content}
                          </pre>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">这个结果对您有帮助吗？</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleFeedback(selectedContent.id, 'positive')}
                                className={`p-2 rounded-lg border ${
                                  selectedContent.feedback === 'positive'
                                    ? 'border-green-500 bg-green-50 text-green-600'
                                    : 'border-gray-300 text-gray-600 hover:border-green-500'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleFeedback(selectedContent.id, 'negative')}
                                className={`p-2 rounded-lg border ${
                                  selectedContent.feedback === 'negative'
                                    ? 'border-red-500 bg-red-50 text-red-600'
                                    : 'border-gray-300 text-gray-600 hover:border-red-500'
                                }`}
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <button className="btn-primary text-sm">
                            <RefreshCw className="w-4 h-4 mr-1" />
                            重新生成
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">开始生成内容</h3>
                        <p className="text-gray-600">在左侧配置生成参数，然后点击"生成内容"按钮</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">生成历史</h3>
                      <span className="text-sm text-gray-600">{generatedContent.length} 条记录</span>
                    </div>
                    
                    <div className="space-y-4">
                      {generatedContent.map(content => (
                        <div
                          key={content.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer"
                          onClick={() => setSelectedContent(content)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                {content.type}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-gray-600">{content.score}</span>
                              </div>
                              {content.feedback && (
                                <div className={`p-1 rounded ${
                                  content.feedback === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {content.feedback === 'positive' ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(content.createdAt).toLocaleString('zh-CN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {content.content.substring(0, 100)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 保存为Brick弹窗 */}
      {showSaveModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">保存为Brick</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="请输入Brick标题"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容预览
              </label>
              <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-600">
                  {contentToSave?.content.substring(0, 200)}...
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowSaveModal(false)
                setSaveTitle('')
                setContentToSave(null)
              }}
              className="btn-secondary"
            >
              取消
            </button>
            <button
              onClick={saveAsBrick}
              className="btn-primary"
            >
              保存
            </button>
          </div>
        </div>
       </div>
     )}
    </div>
  )
}