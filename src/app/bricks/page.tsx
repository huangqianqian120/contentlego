'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Tag, Calendar, Edit, Trash2 } from 'lucide-react'
import { ContentBrick, BrickType } from '@/types'
import { Navigation } from '@/components'



const brickTypeLabels: Record<BrickType, string> = {
  text: '文本',
  image: '图片',
  cta: 'CTA按钮',
  faq: 'FAQ',
  quote: '引用',
  video: '视频',
}

const brickTypeColors: Record<BrickType, string> = {
  text: 'bg-blue-100 text-blue-800',
  image: 'bg-green-100 text-green-800',
  cta: 'bg-purple-100 text-purple-800',
  faq: 'bg-yellow-100 text-yellow-800',
  quote: 'bg-pink-100 text-pink-800',
  video: 'bg-red-100 text-red-800',
}

export default function BricksPage() {
  const [bricks, setBricks] = useState<ContentBrick[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<BrickType | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBrick, setEditingBrick] = useState<ContentBrick | null>(null)
  const [newBrick, setNewBrick] = useState({
    type: 'text' as BrickType,
    title: '',
    content: '',
    tags: [] as string[],
    metadata: {} as any
  })
  const [tagInput, setTagInput] = useState('')

  // 从后端获取brick数据
  useEffect(() => {
    fetchBricks()
  }, [])

  const fetchBricks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/bricks')
      if (response.ok) {
        const data = await response.json()
        setBricks(data)
      } else {
        console.error('获取brick数据失败:', response.statusText)
        alert('获取模块数据失败，请检查后端服务是否正常运行')
      }
    } catch (error) {
      console.error('获取brick数据失败:', error)
      alert('获取模块数据失败，请检查网络连接和后端服务')
    } finally {
      setLoading(false)
    }
  }

  // 过滤积木
  const filteredBricks = bricks.filter((brick) => {
    const matchesSearch = brick.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brick.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'all' || brick.type === selectedType
    return matchesSearch && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  const handleCreateBrick = async () => {
    if (!newBrick.content.trim()) {
      alert('请填写模块内容')
      return
    }
    if (!newBrick.title.trim()) {
      alert('请填写模块标题')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/bricks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newBrick.type,
          title: newBrick.title,
          content: newBrick.content,
          tags: newBrick.tags,
          metadata: newBrick.metadata,
        }),
      })

      if (response.ok) {
        const createdBrick = await response.json()
        setBricks(prev => [createdBrick, ...prev])
        resetForm()
        setShowCreateModal(false)
      } else {
        alert('创建模块失败，请重试')
      }
    } catch (error) {
      console.error('创建模块失败:', error)
      alert('创建模块失败，请重试')
    }
  }

  const resetForm = () => {
    setNewBrick({
      type: 'text',
      title: '',
      content: '',
      tags: [],
      metadata: {}
    })
    setTagInput('')
  }

  const addTag = () => {
    if (tagInput.trim() && !newBrick.tags.includes(tagInput.trim())) {
      setNewBrick(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewBrick(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // 编辑模块
  const handleEditBrick = (brick: ContentBrick) => {
    setEditingBrick(brick)
    setNewBrick({
      type: brick.type,
      title: brick.title,
      content: brick.content,
      tags: [...brick.tags],
      metadata: { ...brick.metadata }
    })
    setShowEditModal(true)
  }

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!newBrick.content.trim()) {
      alert('请填写模块内容')
      return
    }
    if (!newBrick.title.trim()) {
      alert('请填写模块标题')
      return
    }
    if (!editingBrick) return

    try {
      const response = await fetch(`http://localhost:8000/bricks/${editingBrick.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newBrick.title,
          content: newBrick.content,
          tags: newBrick.tags,
          metadata: newBrick.metadata,
        }),
      })

      if (response.ok) {
        const updatedBrick = await response.json()
        setBricks(prev => prev.map(brick => 
          brick.id === editingBrick.id ? updatedBrick : brick
        ))
        
        setShowEditModal(false)
        setEditingBrick(null)
        resetForm()
      } else {
        alert('更新模块失败，请重试')
      }
    } catch (error) {
      console.error('更新模块失败:', error)
      alert('更新模块失败，请重试')
    }
  }

  // 删除模块
  const handleDeleteBrick = async (brickId: string) => {
    if (confirm('确定要删除这个模块吗？此操作不可撤销。')) {
      try {
        const response = await fetch(`http://localhost:8000/bricks/${brickId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setBricks(prev => prev.filter(brick => brick.id !== brickId))
        } else {
          alert('删除模块失败，请重试')
        }
      } catch (error) {
        console.error('删除模块失败:', error)
        alert('删除模块失败，请重试')
      }
    }
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingBrick(null)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Navigation title="内容模块管理" />

      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base text-gray-600">
                管理和组织您的可复用 Brick 模块
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                新建模块
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和过滤 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索 Brick 内容或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            {/* 类型过滤 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as BrickType | 'all')}
                className="input w-auto min-w-[120px]"
              >
                <option value="all">所有类型</option>
                {Object.entries(brickTypeLabels).map(([type, label]) => (
                  <option key={type} value={type}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Brick 列表 */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : filteredBricks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">暂无内容模块</div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              创建第一个模块
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBricks.map((brick) => (
            <div key={brick.id} className="card hover:shadow-md transition-shadow duration-200">
              {/* Brick 头部 */}
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  brickTypeColors[brick.type]
                }`}>
                  {brickTypeLabels[brick.type]}
                </span>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEditBrick(brick)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    title="编辑模块"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteBrick(brick.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="删除模块"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Brick 标题 */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {brick.title}
                </h3>
              </div>

              {/* Brick 内容 */}
              <div className="mb-4">
                <p className="text-gray-900 text-sm leading-relaxed">
                  {truncateContent(brick.content)}
                </p>
                {brick.metadata?.description && (
                  <p className="text-gray-500 text-xs mt-2">
                    {brick.metadata.description}
                  </p>
                )}
              </div>

              {/* 标签 */}
              {brick.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {brick.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Brick 底部信息 */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(brick.createdAt)}
                </div>
                <div>
                  v{brick.version}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* 新建模块模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">新建模块</h3>
              
              {/* 模块标题 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模块标题 *
                </label>
                <input
                  type="text"
                  placeholder="请输入模块标题"
                  value={newBrick.title}
                  onChange={(e) => setNewBrick(prev => ({ ...prev, title: e.target.value }))}
                  className="input w-full"
                />
              </div>
              
              {/* 选择模块类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择模块类型
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(brickTypeLabels).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setNewBrick(prev => ({ ...prev, type: type as BrickType }))}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        newBrick.type === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 填写内容 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模块内容 *
                </label>
                {newBrick.type === 'cta' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="按钮文字"
                      value={newBrick.content}
                      onChange={(e) => setNewBrick(prev => ({ ...prev, content: e.target.value }))}
                      className="input w-full"
                    />
                    <input
                      type="url"
                      placeholder="链接地址 (可选)"
                      value={newBrick.metadata?.linkUrl || ''}
                      onChange={(e) => setNewBrick(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, linkUrl: e.target.value }
                      }))}
                      className="input w-full"
                    />
                    <input
                      type="text"
                      placeholder="描述 (可选)"
                      value={newBrick.metadata?.description || ''}
                      onChange={(e) => setNewBrick(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, description: e.target.value }
                      }))}
                      className="input w-full"
                    />
                  </div>
                ) : (
                  <textarea
                    placeholder={`请输入${brickTypeLabels[newBrick.type]}内容...`}
                    value={newBrick.content}
                    onChange={(e) => setNewBrick(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="input w-full resize-none"
                  />
                )}
              </div>

              {/* 添加标签 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="输入标签名称"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                {newBrick.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newBrick.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateBrick}
                  className="btn-primary"
                >
                  保存模块
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑模块模态框 */}
      {showEditModal && editingBrick && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">编辑模块</h3>
              
              {/* 模块标题 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模块标题 *
                </label>
                <input
                  type="text"
                  placeholder="请输入模块标题"
                  value={newBrick.title}
                  onChange={(e) => setNewBrick(prev => ({ ...prev, title: e.target.value }))}
                  className="input w-full"
                />
              </div>
              
              {/* 选择模块类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择模块类型
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(brickTypeLabels).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setNewBrick(prev => ({ ...prev, type: type as BrickType }))}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        newBrick.type === type
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 填写内容 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模块内容 *
                </label>
                {newBrick.type === 'cta' ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="按钮文字"
                      value={newBrick.content}
                      onChange={(e) => setNewBrick(prev => ({ ...prev, content: e.target.value }))}
                      className="input w-full"
                    />
                    <input
                      type="url"
                      placeholder="链接地址 (可选)"
                      value={newBrick.metadata?.linkUrl || ''}
                      onChange={(e) => setNewBrick(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, linkUrl: e.target.value }
                      }))}
                      className="input w-full"
                    />
                    <input
                      type="text"
                      placeholder="描述 (可选)"
                      value={newBrick.metadata?.description || ''}
                      onChange={(e) => setNewBrick(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, description: e.target.value }
                      }))}
                      className="input w-full"
                    />
                  </div>
                ) : (
                  <textarea
                    placeholder={`请输入${brickTypeLabels[newBrick.type]}内容...`}
                    value={newBrick.content}
                    onChange={(e) => setNewBrick(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="input w-full resize-none"
                  />
                )}
              </div>

              {/* 添加标签 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="输入标签名称"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                {newBrick.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newBrick.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}