'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Share2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Plus,
  Eye,
  Send,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MessageSquare,
  FileText,
  Trash2,
  Edit,
  Key,
  ExternalLink
} from 'lucide-react'
import { Navigation } from '@/components'
import { compositionsApi, channelsApi } from '@/services/api'
import { ContentComposition } from '@/types'

interface PublishingChannel {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  status: 'active' | 'inactive' | 'error'
  apiKey?: string
  accessToken?: string
  refreshToken?: string
  accountName?: string
  configUrl?: string
  description?: string
  isCustom?: boolean
}

interface PublishingRecord {
  id: string
  title: string
  channels: string[]
  status: 'published' | 'scheduled' | 'failed' | 'draft'
  publishedAt?: string
  scheduledAt?: string
  views?: number
  engagement?: number
}

const mockChannels: PublishingChannel[] = [
  {
    id: 'wechat',
    name: '微信公众号',
    icon: <MessageSquare className="w-5 h-5" />,
    connected: true,
    status: 'active'
  },
  {
    id: 'weibo',
    name: '微博',
    icon: <Share2 className="w-5 h-5" />,
    connected: false,
    status: 'inactive'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    connected: true,
    status: 'active'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
    connected: false,
    status: 'inactive'
  },
  {
    id: 'email',
    name: '邮件营销',
    icon: <Mail className="w-5 h-5" />,
    connected: true,
    status: 'active'
  }
]

const mockRecords: PublishingRecord[] = [
  {
    id: '1',
    title: 'Content LEGO 产品介绍',
    channels: ['wechat', 'linkedin'],
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    views: 1250,
    engagement: 85
  },
  {
    id: '2',
    title: '内容工程最佳实践指南',
    channels: ['linkedin', 'email'],
    status: 'scheduled',
    scheduledAt: '2024-01-16T14:00:00Z'
  },
  {
    id: '3',
    title: 'AI 内容生成技术分享',
    channels: ['wechat'],
    status: 'failed',
    publishedAt: '2024-01-14T16:00:00Z'
  }
]

export default function PublishingPage() {
  const [activeTab, setActiveTab] = useState<'publish' | 'channels' | 'records'>('publish')
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [publishTime, setPublishTime] = useState<'now' | 'scheduled'>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [compositions, setCompositions] = useState<ContentComposition[]>([])
  const [selectedComposition, setSelectedComposition] = useState<ContentComposition | null>(null)
  const [showCompositionModal, setShowCompositionModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [channels, setChannels] = useState<PublishingChannel[]>([])
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedChannelForConfig, setSelectedChannelForConfig] = useState<PublishingChannel | null>(null)
  const [channelConfig, setChannelConfig] = useState({
    apiKey: '',
    accessToken: '',
    accountName: '',
    configUrl: ''
  })

  // 获取已保存的作品和渠道数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [compositionsData, channelsData] = await Promise.all([
          compositionsApi.getCompositions(),
          channelsApi.getChannels()
        ])
        setCompositions(compositionsData)
        setChannels(channelsData)
      } catch (error) {
        console.error('获取数据失败:', error)
        // 如果API失败，使用mock数据作为fallback
        setChannels(mockChannels)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    )
  }

  const handleConnectChannel = async (channelId: string) => {
    try {
      const updatedChannel = await channelsApi.updateChannel(channelId, {
        connected: true,
        status: 'active'
      })
      
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? updatedChannel : channel
      ))
      
      alert(`${updatedChannel.name} 连接成功！`)
    } catch (error) {
      console.error('连接渠道失败:', error)
      alert('连接渠道失败，请重试')
    }
  }

  const handleDisconnectChannel = async (channelId: string) => {
    try {
      const updatedChannel = await channelsApi.updateChannel(channelId, {
        connected: false,
        status: 'inactive'
      })
      
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? updatedChannel : channel
      ))
      
      alert(`${updatedChannel.name} 已断开连接！`)
    } catch (error) {
      console.error('断开连接失败:', error)
      alert('断开连接失败，请重试')
    }
  }

  const handlePublish = async () => {
    if (!selectedComposition) {
      alert('请先选择要发布的内容')
      return
    }
    if (selectedChannels.length === 0) {
      alert('请选择至少一个发布渠道')
      return
    }
    
    try {
      setLoading(true)
      
      // 发布到所有选中的渠道
      const publishPromises = selectedChannels.map(channelId => 
        channelsApi.publishToChannel(channelId, selectedComposition.id)
      )
      
      const results = await Promise.all(publishPromises)
      
      const channelNames = selectedChannels.map(id => 
        channels.find(c => c.id === id)?.name
      ).join('、')
      
      if (publishTime === 'now') {
        alert(`作品 "${selectedComposition.name}" 已成功发布到：${channelNames}`)
      } else {
        alert(`作品 "${selectedComposition.name}" 已安排在 ${scheduledDate} ${scheduledTime} 发布到：${channelNames}`)
      }
      
      // 重置选择
      setSelectedComposition(null)
      setSelectedChannels([])
      setPublishTime('now')
      setScheduledDate('')
      setScheduledTime('')
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 删除渠道
  const handleDeleteChannel = async (channelId: string) => {
    if (confirm('确定要删除这个渠道吗？删除后将无法恢复。')) {
      try {
        await channelsApi.deleteChannel(channelId)
        setChannels(prev => prev.filter(channel => channel.id !== channelId))
        setSelectedChannels(prev => prev.filter(id => id !== channelId))
        alert('渠道删除成功！')
      } catch (error) {
        console.error('删除渠道失败:', error)
        alert('删除渠道失败，请重试')
      }
    }
  }

  // 添加新渠道
  const handleAddChannel = async (channelData: Partial<PublishingChannel>) => {
    try {
      const newChannel = await channelsApi.createChannel({
        name: channelData.name || '自定义渠道',
        description: channelData.description,
        configUrl: channelData.configUrl
      })
      setChannels(prev => [...prev, newChannel])
      setShowAddChannelModal(false)
      alert('渠道添加成功！')
    } catch (error) {
      console.error('添加渠道失败:', error)
      alert('添加渠道失败，请重试')
    }
  }

  // 配置渠道
  const handleConfigChannel = (channel: PublishingChannel) => {
    setSelectedChannelForConfig(channel)
    setChannelConfig({
      apiKey: channel.apiKey || '',
      accessToken: channel.accessToken || '',
      accountName: channel.accountName || '',
      configUrl: channel.configUrl || ''
    })
    setShowConfigModal(true)
  }

  // 保存渠道配置
  const handleSaveChannelConfig = async () => {
    if (!selectedChannelForConfig) return
    
    try {
      const updatedChannel = await channelsApi.updateChannel(selectedChannelForConfig.id, {
        apiKey: channelConfig.apiKey,
        accessToken: channelConfig.accessToken,
        accountName: channelConfig.accountName
      })
      
      setChannels(prev => prev.map(channel => 
        channel.id === selectedChannelForConfig.id ? updatedChannel : channel
      ))
      
      setShowConfigModal(false)
      setSelectedChannelForConfig(null)
      alert('渠道配置保存成功！')
    } catch (error) {
      console.error('保存渠道配置失败:', error)
      alert('保存渠道配置失败，请重试')
    }
  }

  // 获取渠道配置指南
  const getChannelConfigGuide = (channelId: string) => {
    const guides: Record<string, { steps: string[], apiUrl?: string, docsUrl?: string }> = {
      wechat: {
        steps: [
          '1. 登录微信公众平台 (mp.weixin.qq.com)',
          '2. 进入「开发」-「基本配置」',
          '3. 获取 AppID 和 AppSecret',
          '4. 配置服务器地址和令牌'
        ],
        docsUrl: 'https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html'
      },
      weibo: {
        steps: [
          '1. 登录微博开放平台 (open.weibo.com)',
          '2. 创建应用并获取 App Key 和 App Secret',
          '3. 配置回调地址',
          '4. 申请相关接口权限'
        ],
        apiUrl: 'https://api.weibo.com/2/',
        docsUrl: 'https://open.weibo.com/wiki/首页'
      },
      linkedin: {
        steps: [
          '1. 访问 LinkedIn Developer Portal',
          '2. 创建应用并获取 Client ID 和 Client Secret',
          '3. 配置 OAuth 2.0 重定向 URL',
          '4. 申请发布权限'
        ],
        apiUrl: 'https://api.linkedin.com/v2/',
        docsUrl: 'https://docs.microsoft.com/en-us/linkedin/'
      },
      instagram: {
        steps: [
          '1. 创建 Facebook 应用',
          '2. 添加 Instagram Basic Display 产品',
          '3. 获取 App ID 和 App Secret',
          '4. 配置 OAuth 重定向 URI'
        ],
        apiUrl: 'https://graph.instagram.com/',
        docsUrl: 'https://developers.facebook.com/docs/instagram-api/'
      },
      email: {
        steps: [
          '1. 选择邮件服务提供商 (如 SendGrid, Mailgun)',
          '2. 获取 API Key',
          '3. 验证发送域名',
          '4. 配置 SMTP 设置'
        ]
      }
    }
    return guides[channelId] || { steps: ['请联系管理员获取配置指南'] }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布'
      case 'scheduled': return '已安排'
      case 'failed': return '发布失败'
      case 'draft': return '草稿'
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="多平台分发" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能开发提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">功能开发中</h3>
              <p className="text-blue-700 mt-1">
                多平台分发功能正在开发中，以下为功能预览界面。完整功能将包括微信公众号、微博、LinkedIn、Instagram 等平台的内容发布。
              </p>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('publish')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'publish'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Send className="w-4 h-4 inline mr-2" />
                发布内容
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'channels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                渠道管理
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                发布记录
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 发布内容标签页 */}
            {activeTab === 'publish' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">选择内容</h3>
                  {selectedComposition ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-blue-900">{selectedComposition.name}</h4>
                            <p className="text-sm text-blue-700">{selectedComposition.description || '无描述'}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {selectedComposition.bricks.length} 个模块 • {selectedComposition.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowCompositionModal(true)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          更换内容
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">选择要发布的作品</p>
                        <button
                          onClick={() => setShowCompositionModal(true)}
                          className="btn-primary inline-flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          选择作品
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">选择发布渠道</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {channels.map(channel => (
                      <div
                        key={channel.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedChannels.includes(channel.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${
                          !channel.connected ? 'opacity-50' : ''
                        }`}
                        onClick={() => channel.connected && handleChannelToggle(channel.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-600">{channel.icon}</div>
                            <span className="font-medium text-gray-900">{channel.name}</span>
                          </div>
                          {channel.connected ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {channel.connected ? '已连接' : '未连接'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">发布时间</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="publishTime"
                          value="now"
                          checked={publishTime === 'now'}
                          onChange={(e) => setPublishTime(e.target.value as 'now' | 'scheduled')}
                          className="mr-2"
                        />
                        立即发布
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="publishTime"
                          value="scheduled"
                          checked={publishTime === 'scheduled'}
                          onChange={(e) => setPublishTime(e.target.value as 'now' | 'scheduled')}
                          className="mr-2"
                        />
                        定时发布
                      </label>
                    </div>
                    
                    {publishTime === 'scheduled' && (
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            日期
                          </label>
                          <input
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            时间
                          </label>
                          <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button 
                    onClick={handlePublish}
                    className="btn-primary flex items-center"
                    disabled={!selectedComposition || selectedChannels.length === 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {publishTime === 'now' ? '立即发布' : '安排发布'}
                  </button>
                  <button className="btn-secondary flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    预览
                  </button>
                </div>
              </div>
            )}

            {/* 渠道管理标签页 */}
            {activeTab === 'channels' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">发布渠道</h3>
                  <button 
                    onClick={() => setShowAddChannelModal(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    添加渠道
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {channels.map(channel => (
                    <div key={channel.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-600">{channel.icon}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{channel.name}</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                状态: <span className={`font-medium ${
                                  channel.connected ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {channel.connected ? '已连接' : '未连接'}
                                </span>
                              </p>
                              {channel.accountName && (
                                <p className="text-sm text-gray-500">
                                  账号: {channel.accountName}
                                </p>
                              )}
                              {channel.isCustom && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  自定义渠道
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleConfigChannel(channel)}
                            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                            title="配置渠道"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            配置
                          </button>
                          {channel.connected ? (
                            <button 
                              onClick={() => handleDisconnectChannel(channel.id)}
                              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
                              title="断开连接"
                            >
                              <Key className="w-4 h-4 mr-1" />
                              断开
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleConnectChannel(channel.id)}
                              className="text-sm text-green-600 hover:text-green-700 flex items-center"
                              title="连接账号"
                            >
                              <Key className="w-4 h-4 mr-1" />
                              连接
                            </button>
                          )}
                          {channel.isCustom && (
                            <button 
                              onClick={() => handleDeleteChannel(channel.id)}
                              className="text-sm text-red-600 hover:text-red-700 flex items-center"
                              title="删除渠道"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              删除
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 发布记录标签页 */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">发布记录</h3>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>全部状态</option>
                      <option>已发布</option>
                      <option>已安排</option>
                      <option>发布失败</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          内容标题
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          发布渠道
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          数据
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockRecords.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {record.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              {record.channels.map(channelId => {
                                const channel = mockChannels.find(c => c.id === channelId)
                                return channel ? (
                                  <span key={channelId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    {channel.name}
                                  </span>
                                ) : null
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {getStatusText(record.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.publishedAt && new Date(record.publishedAt).toLocaleString('zh-CN')}
                            {record.scheduledAt && `计划: ${new Date(record.scheduledAt).toLocaleString('zh-CN')}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.views && (
                              <div>
                                <div>浏览: {record.views}</div>
                                {record.engagement && <div>互动: {record.engagement}</div>}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 添加渠道模态框 */}
        {showAddChannelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">添加新渠道</h3>
                <button
                  onClick={() => setShowAddChannelModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleAddChannel({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  configUrl: formData.get('configUrl') as string
                })
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      渠道名称 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如：自定义博客平台"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="渠道描述信息"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API 文档地址
                    </label>
                    <input
                      type="url"
                      name="configUrl"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/api/docs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddChannelModal(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button type="submit" className="btn-primary">
                    添加渠道
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 渠道配置模态框 */}
        {showConfigModal && selectedChannelForConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  配置 {selectedChannelForConfig.name}
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* 配置指南 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    配置指南
                  </h4>
                  <div className="space-y-2">
                    {getChannelConfigGuide(selectedChannelForConfig.id).steps.map((step, index) => (
                      <p key={index} className="text-sm text-blue-800">{step}</p>
                    ))}
                  </div>
                  {getChannelConfigGuide(selectedChannelForConfig.id).docsUrl && (
                    <a
                      href={getChannelConfigGuide(selectedChannelForConfig.id).docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-3"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      查看官方文档
                    </a>
                  )}
                </div>

                {/* 配置表单 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key / App ID
                    </label>
                    <input
                      type="text"
                      value={channelConfig.apiKey}
                      onChange={(e) => setChannelConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入 API Key 或 App ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Token / App Secret
                    </label>
                    <input
                      type="password"
                      value={channelConfig.accessToken}
                      onChange={(e) => setChannelConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入 Access Token 或 App Secret"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      账号名称
                    </label>
                    <input
                      type="text"
                      value={channelConfig.accountName}
                      onChange={(e) => setChannelConfig(prev => ({ ...prev, accountName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="关联的账号名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      回调地址 / Webhook URL
                    </label>
                    <input
                      type="url"
                      value={channelConfig.configUrl}
                      onChange={(e) => setChannelConfig(prev => ({ ...prev, configUrl: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://your-domain.com/webhook"
                    />
                  </div>
                </div>

                {/* 测试连接 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">测试连接</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    保存配置后，系统将自动测试与该渠道的连接状态。
                  </p>
                  <button 
                    onClick={async () => {
                      if (!selectedChannelForConfig) return
                      try {
                        const result = await channelsApi.testConnection(selectedChannelForConfig.id)
                        alert(result.message)
                      } catch (error) {
                        console.error('测试连接失败:', error)
                        alert('测试连接失败，请检查配置信息')
                      }
                    }}
                    className="btn-secondary text-sm"
                  >
                    测试连接
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveChannelConfig}
                  className="btn-primary"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 作品选择模态框 */}
        {showCompositionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">选择要发布的作品</h3>
                <button
                  onClick={() => setShowCompositionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">加载中...</p>
                </div>
              ) : compositions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">暂无已保存的作品</p>
                  <Link href="/builder" className="btn-primary inline-flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    去创建作品
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {compositions.map(composition => (
                    <div
                      key={composition.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-blue-300 ${
                        selectedComposition?.id === composition.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedComposition(composition)
                        setShowCompositionModal(false)
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <FileText className="w-8 h-8 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{composition.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {composition.description || '无描述'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{composition.bricks.length} 个模块</span>
                            <span>{composition.category}</span>
                            <span>{new Date(composition.createdAt).toLocaleDateString()}</span>
                          </div>
                          {composition.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {composition.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                              {composition.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{composition.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCompositionModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}