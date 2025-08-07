'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { 
  Blocks, 
  Plus, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Monitor, 
  Save, 
  Trash2,
  Sparkles,
  Search,
  Download,
  FileText,
  Image,
  FileDown,
  Layout,
  GripVertical,
  Edit3
} from 'lucide-react'
import { ContentBrick, BrickType } from '@/types'
import { Navigation } from '@/components'
import { compositionsApi } from '@/services/api'

// Brick Library 组件
function BrickLibrary({ onAddBrick }: { onAddBrick: (brick: ContentBrick) => void }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<BrickType | 'all'>('all')
  const [availableBricks, setAvailableBricks] = useState<ContentBrick[]>([])
  const [loading, setLoading] = useState(true)
  
  // 从后端获取所有brick数据
  useEffect(() => {
    fetchBricks()
  }, [])

  const fetchBricks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/bricks')
      if (response.ok) {
        const data = await response.json()
        setAvailableBricks(data)
      } else {
        // 如果API调用失败，使用本地模拟数据
        const mockBricks: ContentBrick[] = [
          {
            id: 'lib-1',
            type: 'text',
            title: '文本示例',
            content: '这是一个文本 Brick 示例，您可以编辑其内容。',
            tags: ['文本', '示例'],
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'lib-2',
            type: 'cta',
            title: '行动按钮',
            content: '立即行动',
            metadata: {
              buttonText: '立即行动',
              linkUrl: '#',
              description: '引导用户采取行动的按钮',
            },
            tags: ['CTA', '按钮'],
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'lib-3',
            type: 'quote',
            title: '励志名言',
            content: '"成功不是终点，失败不是致命的，继续前进的勇气才是最重要的。"',
            tags: ['引用', '励志'],
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        setAvailableBricks(mockBricks)
      }
    } catch (error) {
      console.error('获取 Brick 数据失败:', error)
      // 使用本地模拟数据作为后备
      const mockBricks: ContentBrick[] = [
        {
          id: 'lib-1',
          type: 'text',
          title: '文本示例',
          content: '这是一个文本 Brick 示例，您可以编辑其内容。',
          tags: ['文本', '示例'],
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lib-2',
          type: 'cta',
          title: '行动按钮',
          content: '立即行动',
          metadata: {
            buttonText: '立即行动',
            linkUrl: '#',
            description: '引导用户采取行动的按钮',
          },
          tags: ['CTA', '按钮'],
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'lib-3',
          type: 'quote',
          title: '励志名言',
          content: '"成功不是终点，失败不是致命的，继续前进的勇气才是最重要的。"',
          tags: ['引用', '励志'],
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setAvailableBricks(mockBricks)
    } finally {
      setLoading(false)
    }
  }

  const filteredBricks = availableBricks.filter((brick) => {
    const matchesSearch = brick.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || brick.type === selectedType
    return matchesSearch && matchesType
  })

  const brickTypeLabels: Record<BrickType, string> = {
    text: '文本',
    image: '图片',
    cta: 'CTA',
    faq: 'FAQ',
    quote: '引用',
    video: '视频',
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Brick Library</h2>
        
        {/* 搜索 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索 Brick..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* 类型过滤 */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as BrickType | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">所有类型</option>
          {Object.entries(brickTypeLabels).map(([type, label]) => (
            <option key={type} value={type}>{label}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-gray-500">加载中...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBricks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-sm">没有找到匹配的 Brick</div>
              </div>
            ) : (
              filteredBricks.map((brick) => (
                <div
                  key={brick.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 hover:shadow-sm transition-all duration-200"
                  onClick={() => onAddBrick(brick)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {brickTypeLabels[brick.type]}
                    </span>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{brick.title}</h4>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {brick.content.length > 60 ? brick.content.substring(0, 60) + '...' : brick.content}
                  </p>
                  {brick.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {brick.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {brick.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{brick.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Brick 渲染组件
function BrickRenderer({ brick, isPreview = false }: { brick: ContentBrick; isPreview?: boolean }) {
  const renderBrickContent = () => {
    switch (brick.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-800 leading-relaxed">{brick.content}</p>
          </div>
        )
      
      case 'cta':
        return (
          <div className="text-center">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              {brick.metadata?.buttonText || brick.content}
            </button>
            {brick.metadata?.description && (
              <p className="text-sm text-gray-600 mt-2">{brick.metadata.description}</p>
            )}
          </div>
        )
      
      case 'quote':
        return (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 bg-gray-50 py-3 rounded-r">
            {brick.content}
          </blockquote>
        )
      
      case 'faq':
        const lines = brick.content.split('\n')
        const question = lines.find(line => line.startsWith('Q:'))
        const answer = lines.find(line => line.startsWith('A:'))
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            {question && (
              <h4 className="font-medium text-gray-900 mb-2">{question.substring(2).trim()}</h4>
            )}
            {answer && (
              <p className="text-gray-700">{answer.substring(2).trim()}</p>
            )}
          </div>
        )
      
      default:
        return (
          <div className="text-gray-600">
            <p>{brick.content}</p>
          </div>
        )
    }
  }

  if (isPreview) {
    return (
      <div className="mb-6">
        {renderBrickContent()}
      </div>
    )
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="p-1 text-gray-400 hover:text-red-600 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-2">
        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
          {brick.type.toUpperCase()}
        </span>
      </div>
      
      {renderBrickContent()}
    </div>
  )
}

// 构建区域组件
function BuilderArea({ 
  bricks, 
  isPreview, 
  isMobile, 
  onRemoveBrick,
  onEditBrick 
}: { 
  bricks: ContentBrick[]; 
  isPreview: boolean; 
  isMobile: boolean;
  onRemoveBrick: (index: number) => void;
  onEditBrick: (index: number, brick: ContentBrick) => void;
}) {
  if (bricks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Blocks className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">开始构建您的内容</h3>
          <p className="text-gray-500 mb-6">从左侧 Brick Library 中选择 Brick，或使用AI生成新的 Content Brick</p>
          <Link href="/ai-generator" className="btn-primary inline-flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            AI生成 Brick
          </Link>
        </div>
      </div>
    )
  }

  const containerClass = isMobile 
    ? "max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    : "max-w-4xl mx-auto bg-white rounded-lg shadow-sm"

  return (
    <div className="flex-1 p-6">
      <div className={containerClass}>
        <div className={isPreview ? "p-6" : "p-4"}>
          <SortableContext items={bricks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {bricks.map((brick, index) => (
              <div key={`${brick.id}-${index}`} className="relative group mb-4">
                {!isPreview && (
                  <div className="absolute -left-8 top-0 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50"
                      title="拖拽排序"
                    >
                      <GripVertical className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                )}
                
                {!isPreview && (
                  <div className="absolute -right-8 top-0 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditBrick(index, brick)}
                      className="p-1 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50"
                      title="编辑内容"
                    >
                      <Edit3 className="w-3 h-3 text-blue-500" />
                    </button>
                  </div>
                )}
                
                <div className={!isPreview ? "border border-dashed border-transparent hover:border-gray-300 rounded p-2" : ""}>
                  <BrickRenderer brick={brick} isPreview={isPreview} />
                </div>
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  )
}

export default function BuilderPage() {
  const [selectedBricks, setSelectedBricks] = useState<ContentBrick[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [editingBrick, setEditingBrick] = useState<{ index: number; brick: ContentBrick } | null>(null)
  const [saveForm, setSaveForm] = useState({ name: '', description: '', category: 'default', tags: '' })
  const [isSaving, setIsSaving] = useState(false)

  // 模板数据
  const templates = [
    {
      id: 'template-1',
      name: '产品介绍模板',
      description: '适用于产品功能介绍和特性展示',
      bricks: [
        { id: 'temp-1', type: 'text' as BrickType, title: '产品介绍', content: '# 产品名称\n\n产品简介描述...', tags: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'temp-2', type: 'cta' as BrickType, title: '了解更多按钮', content: '了解更多', metadata: { buttonText: '了解更多', linkUrl: '#' }, tags: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]
    },
    {
      id: 'template-2', 
      name: '营销邮件模板',
      description: '适用于营销推广和客户沟通',
      bricks: [
        { id: 'temp-3', type: 'text' as BrickType, title: '邮件开头', content: '亲爱的客户，\n\n感谢您对我们产品的关注...', tags: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'temp-4', type: 'quote' as BrickType, title: '服务理念', content: '"客户满意是我们的首要目标"', tags: [], version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]
    }
  ]

  const handleAddBrick = (brick: ContentBrick) => {
    // 创建新的 Brick 实例，避免ID冲突
    const newBrick: ContentBrick = {
      ...brick,
      id: `${brick.id}-${Date.now()}`,
    }
    setSelectedBricks(prev => [...prev, newBrick])
  }

  const handleRemoveBrick = (index: number) => {
    setSelectedBricks(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditBrick = (index: number, brick: ContentBrick) => {
    setEditingBrick({ index, brick })
  }

  const handleUpdateBrick = (updatedBrick: ContentBrick) => {
    if (editingBrick) {
      setSelectedBricks(prev => 
        prev.map((brick, index) => 
          index === editingBrick.index ? updatedBrick : brick
        )
      )
      setEditingBrick(null)
    }
  }

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setSelectedBricks(template.bricks.map(brick => ({
      ...brick,
      id: `${brick.id}-${Date.now()}`
    })))
    setShowTemplateModal(false)
  }

  const handleExport = (format: 'html' | 'markdown' | 'pdf') => {
    let content = ''
    
    if (format === 'html') {
      content = selectedBricks.map(brick => {
        switch (brick.type) {
          case 'text':
            return `<div class="text-content">${brick.content.replace(/\n/g, '<br>')}</div>`
          case 'cta':
            return `<div class="cta-content"><button>${brick.content}</button></div>`
          case 'quote':
            return `<blockquote>${brick.content}</blockquote>`
          default:
            return `<div>${brick.content}</div>`
        }
      }).join('\n')
    } else if (format === 'markdown') {
      content = selectedBricks.map(brick => brick.content).join('\n\n')
    } else {
      content = selectedBricks.map(brick => brick.content).join('\n\n')
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `content.${format === 'html' ? 'html' : format === 'markdown' ? 'md' : 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportModal(false)
  }

  const handleSaveComposition = async () => {
    if (!saveForm.name.trim()) {
      alert('请输入作品名称')
      return
    }

    if (selectedBricks.length === 0) {
      alert('请先添加一些内容模块')
      return
    }

    setIsSaving(true)
    
    try {
      const tags = saveForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      await compositionsApi.createComposition({
        name: saveForm.name,
        description: saveForm.description || undefined,
        bricks: selectedBricks,
        category: saveForm.category,
        tags
      })
      
      alert('作品保存成功！')
      setShowSaveModal(false)
      setSaveForm({ name: '', description: '', category: 'default', tags: '' })
    } catch (error) {
      console.error('保存作品失败:', error)
      alert('保存失败，请稍后重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = selectedBricks.findIndex(brick => brick.id === active.id)
      const newIndex = selectedBricks.findIndex(brick => brick.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newBricks = [...selectedBricks]
        const [movedBrick] = newBricks.splice(oldIndex, 1)
        newBricks.splice(newIndex, 0, movedBrick)
        setSelectedBricks(newBricks)
      }
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 导航栏 */}
      <Navigation title="内容拼装" />

      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 模板选择 */}
            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn-secondary inline-flex items-center"
            >
              <Layout className="w-4 h-4 mr-2" />
              选择模板
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 模板选择 */}
            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn-secondary inline-flex items-center"
            >
              <Layout className="w-4 h-4 mr-2" />
              选择模板
            </button>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* 预览模式切换 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobile(false)}
                className={`p-2 rounded ${!isMobile ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMobile(true)}
                className={`p-2 rounded ${isMobile ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* 预览切换 */}
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isPreview 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isPreview ? '编辑模式' : '预览模式'}
              </span>
            </button>
            
            {/* 保存和导出按钮 */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="btn-secondary inline-flex items-center mr-3"
              disabled={selectedBricks.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              保存作品
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-primary inline-flex items-center"
              disabled={selectedBricks.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              导出
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* 左侧 Brick Library */}
          <BrickLibrary onAddBrick={handleAddBrick} />
          
          {/* 右侧构建区域 */}
          <BuilderArea 
            bricks={selectedBricks}
            isPreview={isPreview}
            isMobile={isMobile}
            onRemoveBrick={handleRemoveBrick}
            onEditBrick={handleEditBrick}
          />
          
          <DragOverlay>
            {activeId ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
                拖拽中...
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">选择模板</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer transition-colors"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="text-xs text-gray-500">
                      包含 {template.bricks.length} 个模块
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">从空白开始</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 导出模态框 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">导出内容</h3>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleExport('html')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-orange-500 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">HTML</div>
                      <div className="text-sm text-gray-500">网页格式</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleExport('markdown')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center">
                    <FileDown className="w-5 h-5 text-blue-500 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Markdown</div>
                      <div className="text-sm text-gray-500">文档格式</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-red-500 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">PDF</div>
                      <div className="text-sm text-gray-500">便携文档格式</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 保存作品模态框 */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">保存作品</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作品名称 *
                  </label>
                  <input
                    type="text"
                    value={saveForm.name}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="请输入作品名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <textarea
                    value={saveForm.description}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="请输入作品描述"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    value={saveForm.category}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="default">默认</option>
                    <option value="marketing">营销</option>
                    <option value="product">产品</option>
                    <option value="education">教育</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <input
                    type="text"
                    value={saveForm.tags}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="用逗号分隔多个标签"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="btn-secondary"
                  disabled={isSaving}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveComposition}
                  className="btn-primary"
                  disabled={isSaving || !saveForm.name.trim()}
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑模态框 */}
      {editingBrick && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">编辑模块内容</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容
                </label>
                <textarea
                  value={editingBrick.brick.content}
                  onChange={(e) => setEditingBrick(prev => prev ? {
                    ...prev,
                    brick: { ...prev.brick, content: e.target.value }
                  } : null)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingBrick(null)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={() => handleUpdateBrick(editingBrick.brick)}
                  className="btn-primary"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}