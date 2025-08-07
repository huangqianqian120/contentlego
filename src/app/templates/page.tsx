'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Download, 
  Star, 
  Calendar, 
  User, 
  Tag,
  AlertCircle,
  Layout,
  Mail,
  Megaphone,
  FileImage,
  Settings
} from 'lucide-react'
import { Navigation } from '@/components'

interface ContentTemplate {
  id: string
  name: string
  description: string
  category: string
  type: 'email' | 'social' | 'article' | 'landing' | 'newsletter' | 'announcement'
  thumbnail: string
  usageCount: number
  rating: number
  createdBy: string
  createdAt: string
  lastModified: string
  tags: string[]
  isPublic: boolean
  variables: TemplateVariable[]
  bricks: any[]
}

interface TemplateVariable {
  name: string
  type: 'text' | 'image' | 'link' | 'date'
  required: boolean
  defaultValue?: string
  description: string
}

const mockTemplates: ContentTemplate[] = [
  {
    id: '1',
    name: '产品发布公告',
    description: '用于新产品发布的标准模板，包含产品介绍、特性说明和CTA',
    category: '营销',
    type: 'announcement',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 45,
    rating: 4.8,
    createdBy: '张三',
    createdAt: '2024-01-10T10:00:00Z',
    lastModified: '2024-01-15T14:30:00Z',
    tags: ['产品', '发布', '营销'],
    isPublic: true,
    variables: [
      { name: '产品名称', type: 'text', required: true, description: '要发布的产品名称' },
      { name: '发布日期', type: 'date', required: true, description: '产品正式发布的日期' },
      { name: '产品特性', type: 'text', required: true, description: '产品的主要特性和亮点' },
      { name: 'CTA链接', type: 'link', required: true, description: '用户行动召唤的链接地址' }
    ],
    bricks: []
  },
  {
    id: '2',
    name: '邮件营销模板',
    description: '专业的邮件营销模板，适用于促销活动和产品推广',
    category: '邮件',
    type: 'email',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 32,
    rating: 4.6,
    createdBy: '李四',
    createdAt: '2024-01-08T16:20:00Z',
    lastModified: '2024-01-14T11:45:00Z',
    tags: ['邮件', '营销', '促销'],
    isPublic: true,
    variables: [
      { name: '收件人姓名', type: 'text', required: true, description: '邮件收件人的姓名' },
      { name: '产品名称', type: 'text', required: true, description: '推广的产品名称' },
      { name: '优惠信息', type: 'text', required: false, description: '优惠活动信息' },
      { name: '截止日期', type: 'date', required: true, description: '优惠活动截止日期' }
    ],
    bricks: []
  },
  {
    id: '3',
    name: '社交媒体文案',
    description: '适用于微博、微信等社交平台的内容发布模板',
    category: '社交媒体',
    type: 'social',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 28,
    rating: 4.5,
    createdBy: '王五',
    createdAt: '2024-01-05T09:15:00Z',
    lastModified: '2024-01-12T13:20:00Z',
    tags: ['社交', '文案', '推广'],
    isPublic: false,
    variables: [
      { name: '话题标签', type: 'text', required: true, description: '相关的话题标签' },
      { name: '内容主体', type: 'text', required: true, description: '发布的主要内容' },
      { name: '配图', type: 'image', required: false, description: '配套的图片' },
      { name: '发布时间', type: 'date', required: true, description: '内容发布时间' }
    ],
    bricks: []
  },
  {
    id: '4',
    name: '技术博客文章',
    description: '技术类文章的标准结构模板，包含代码示例和最佳实践',
    category: '内容',
    type: 'article',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 18,
    rating: 4.7,
    createdBy: '赵六',
    createdAt: '2024-01-03T14:30:00Z',
    lastModified: '2024-01-10T16:45:00Z',
    tags: ['技术', '博客', '教程'],
    isPublic: true,
    variables: [
      { name: '文章标题', type: 'text', required: true, description: '技术文章的标题' },
      { name: '技术栈', type: 'text', required: true, description: '使用的技术栈' },
      { name: '代码示例', type: 'text', required: true, description: '相关的代码示例' },
      { name: '总结', type: 'text', required: true, description: '文章总结' }
    ],
    bricks: []
  },
  {
    id: '5',
    name: '落地页模板',
    description: '高转化率的产品落地页模板，包含完整的营销漏斗设计',
    category: '营销',
    type: 'landing',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 22,
    rating: 4.9,
    createdBy: '孙七',
    createdAt: '2024-01-01T12:00:00Z',
    lastModified: '2024-01-08T10:30:00Z',
    tags: ['落地页', '转化', '营销'],
    isPublic: true,
    variables: [
      { name: '产品标题', type: 'text', required: true, description: '产品的主标题' },
      { name: '价值主张', type: 'text', required: true, description: '产品的核心价值主张' },
      { name: '客户证言', type: 'text', required: false, description: '客户推荐证言' },
      { name: '价格信息', type: 'text', required: true, description: '产品价格信息' }
    ],
    bricks: []
  },
  {
    id: '6',
    name: '周报模板',
    description: '团队周报的标准格式，包含工作总结和下周计划',
    category: '内部',
    type: 'newsletter',
    thumbnail: '/api/placeholder/300/200',
    usageCount: 15,
    rating: 4.3,
    createdBy: '周八',
    createdAt: '2023-12-28T15:45:00Z',
    lastModified: '2024-01-05T09:20:00Z',
    tags: ['周报', '总结', '计划'],
    isPublic: false,
    variables: [
      { name: '报告周期', type: 'text', required: true, description: '周报的时间周期' },
      { name: '完成任务', type: 'text', required: true, description: '本周完成的任务' },
      { name: '遇到问题', type: 'text', required: false, description: '遇到的问题和困难' },
      { name: '下周计划', type: 'text', required: true, description: '下周的工作计划' }
    ],
    bricks: []
  }
]

const mockVariables: TemplateVariable[] = [
  {
    name: '产品名称',
    type: 'text',
    required: true,
    description: '要发布的产品名称'
  },
  {
    name: '发布日期',
    type: 'date',
    required: true,
    description: '产品正式发布的日期'
  },
  {
    name: '产品特性',
    type: 'text',
    required: true,
    description: '产品的主要特性和亮点'
  },
  {
    name: 'CTA链接',
    type: 'link',
    required: true,
    description: '用户行动召唤的链接地址'
  }
]

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'variables'>('browse')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [variables, setVariables] = useState<TemplateVariable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取模板列表
  useEffect(() => {
    fetchTemplates()
    fetchVariables()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      if (!response.ok) throw new Error('获取模板失败')
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取模板失败')
      // 使用模拟数据作为后备
      setTemplates(mockTemplates)
    } finally {
      setLoading(false)
    }
  }

  const fetchVariables = async () => {
    try {
      const response = await fetch('/api/template-variables')
      if (!response.ok) throw new Error('获取变量失败')
      const data = await response.json()
      setVariables(data)
    } catch (err) {
      // 使用模拟数据作为后备
      setVariables(mockVariables)
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('使用模板失败')
      // 跳转到内容创建页面
      window.location.href = `/content/create?template=${templateId}`
    } catch (err) {
      alert(err instanceof Error ? err.message : '使用模板失败')
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('确定要删除这个模板吗？')) return
    
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('删除模板失败')
      await fetchTemplates()
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除模板失败')
    }
  }

  const categories = ['all', '营销', '邮件', '社交媒体', '内容', '内部']
  const types = ['all', 'email', 'social', 'article', 'landing', 'newsletter', 'announcement']

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'social': return <Megaphone className="w-4 h-4" />
      case 'article': return <FileText className="w-4 h-4" />
      case 'landing': return <Layout className="w-4 h-4" />
      case 'newsletter': return <FileImage className="w-4 h-4" />
      case 'announcement': return <Megaphone className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'email': return '邮件'
      case 'social': return '社交媒体'
      case 'article': return '文章'
      case 'landing': return '落地页'
      case 'newsletter': return '简报'
      case 'announcement': return '公告'
      default: return '其他'
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesType = selectedType === 'all' || template.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="模板与内容资产库" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-900">连接错误</h3>
                <p className="text-red-700 mt-1">
                  {error}，当前显示模拟数据。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'browse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                浏览模板
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                创建模板
              </button>
              <button
                onClick={() => setActiveTab('variables')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'variables'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                变量管理
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 浏览模板标签页 */}
            {activeTab === 'browse' && (
              <div className="space-y-6">
                {/* 搜索和筛选 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="搜索模板名称、描述或标签..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? '全部分类' : category}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type === 'all' ? '全部类型' : getTypeText(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 模板网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* 模板缩略图 */}
                      <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                        {getTypeIcon(template.type)}
                        <span className="ml-2 text-sm text-gray-600">{getTypeText(template.type)}</span>
                      </div>
                      
                      {/* 模板信息 */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{template.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 2 && (
                            <span className="text-xs text-gray-500">+{template.tags.length - 2}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {template.createdBy}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template)
                              setShowPreview(true)
                            }}
                            className="flex-1 btn-secondary text-xs py-2"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            预览
                          </button>
                          <button 
                            onClick={() => handleUseTemplate(template.id)}
                            className="flex-1 btn-primary text-xs py-2"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            使用
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">加载中...</p>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">未找到匹配的模板</h3>
                    <p className="text-gray-600">尝试调整搜索条件或创建新模板</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* 创建模板标签页 */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">创建新模板</h3>
                  <p className="text-gray-600 mb-6">
                    创建可重复使用的内容模板，支持变量占位符和内容模块嵌套。
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">模板创建器</h3>
                  <p className="text-gray-600 mb-4">可视化模板编辑器将在完整版本中提供</p>
                  <button className="btn-primary">
                    开始创建模板
                  </button>
                </div>
              </div>
            )}

            {/* 变量管理标签页 */}
            {activeTab === 'variables' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">模板变量管理</h3>
                  <p className="text-gray-600 mb-6">
                    管理模板中使用的变量，定义变量类型、默认值和验证规则。
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          变量名称
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          类型
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          必填
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          描述
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {variables.map((variable, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {variable.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {variable.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {variable.required ? (
                              <span className="text-red-600">是</span>
                            ) : (
                              <span className="text-gray-500">否</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {variable.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <button className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    添加变量
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 模板预览模态框 */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedTemplate.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">模板变量：</h4>
                  <div className="space-y-2">
                    {selectedTemplate.variables.map((variable, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {typeof variable === 'string' ? variable : variable.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">模板预览</h4>
                    <p className="text-gray-600 text-sm">完整的模板预览功能将在正式版本中提供</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="btn-secondary flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑模板
                </button>
                <button 
                  onClick={() => {
                    handleUseTemplate(selectedTemplate.id)
                    setShowPreview(false)
                  }}
                  className="btn-primary flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  使用模板
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}