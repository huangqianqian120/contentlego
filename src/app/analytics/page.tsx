'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share, 
  MessageCircle, 
  Calendar, 
  Filter,
  Download,
  AlertCircle,
  Target,
  Users,
  Clock
} from 'lucide-react'
import { Navigation } from '@/components'

interface AnalyticsData {
  totalViews: number
  totalEngagement: number
  totalShares: number
  totalComments: number
  growthRate: number
}

interface BrickAnalytics {
  id: string
  name: string
  type: string
  usageCount: number
  views: number
  engagement: number
  lastUsed: string
  performance: 'high' | 'medium' | 'low'
}

interface ContentPerformance {
  id: string
  title: string
  platform: string
  publishedAt: string
  views: number
  likes: number
  shares: number
  comments: number
  ctr: number
}



export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bricks' | 'content'>('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [brickAnalytics, setBrickAnalytics] = useState<BrickAnalytics[]>([])
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 这里将来会添加实际的数据获取逻辑
    setLoading(false)
  }, [])

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case 'high': return '高效'
      case 'medium': return '中等'
      case 'low': return '待优化'
      default: return '未知'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="数据与分析" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能开发提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">功能开发中</h3>
              <p className="text-blue-700 mt-1">
                数据分析功能正在开发中，以下为功能预览界面。完整功能将包括实时数据追踪、深度分析报告、性能优化建议等。
              </p>
            </div>
          </div>
        </div>

        {/* 筛选控件 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7d">最近 7 天</option>
                <option value="30d">最近 30 天</option>
                <option value="90d">最近 90 天</option>
                <option value="1y">最近 1 年</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部平台</option>
                <option value="wechat">微信公众号</option>
                <option value="weibo">微博</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">邮件</option>
              </select>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                总览
              </button>
              <button
                onClick={() => setActiveTab('bricks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bricks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                模块分析
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                内容表现
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 总览标签页 */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 关键指标卡片 */}
                {analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">总浏览量</p>
                          <p className="text-2xl font-bold">{formatNumber(analytics.totalViews)}</p>
                        </div>
                        <Eye className="w-8 h-8 text-blue-200" />
                      </div>
                      <div className="flex items-center mt-4">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">+{analytics.growthRate}% 本周</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">总互动量</p>
                          <p className="text-2xl font-bold">{formatNumber(analytics.totalEngagement)}</p>
                        </div>
                        <Heart className="w-8 h-8 text-green-200" />
                      </div>
                      <div className="flex items-center mt-4">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">+12.8% 本周</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">总分享量</p>
                          <p className="text-2xl font-bold">{formatNumber(analytics.totalShares)}</p>
                        </div>
                        <Share className="w-8 h-8 text-purple-200" />
                      </div>
                      <div className="flex items-center mt-4">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">+8.5% 本周</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">总评论量</p>
                          <p className="text-2xl font-bold">{formatNumber(analytics.totalComments)}</p>
                        </div>
                        <MessageCircle className="w-8 h-8 text-orange-200" />
                      </div>
                      <div className="flex items-center mt-4">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">+5.2% 本周</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">暂无分析数据</p>
                  </div>
                )}

                {/* 趋势图表占位符 */}
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">数据趋势图表</h3>
                  <p className="text-gray-600">详细的数据可视化图表将在完整版本中提供</p>
                </div>
              </div>
            )}

            {/* 模块分析标签页 */}
            {activeTab === 'bricks' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">内容模块表现</h3>
                  <p className="text-gray-600 mb-6">
                    分析各个内容模块的使用频次、浏览量和互动数据，帮助优化内容策略。
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          模块名称
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          使用次数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          浏览量
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          互动量
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          表现
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          最后使用
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {brickAnalytics.length > 0 ? brickAnalytics.map((brick: BrickAnalytics) => (
                        <tr key={brick.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {brick.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {brick.type}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {brick.usageCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(brick.views)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(brick.engagement)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(brick.performance)}`}>
                              {getPerformanceText(brick.performance)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(brick.lastUsed).toLocaleDateString('zh-CN')}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            暂无砖块分析数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 内容表现标签页 */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">发布内容表现</h3>
                  <p className="text-gray-600 mb-6">
                    追踪已发布内容在各个平台的表现数据，包括浏览量、互动率等关键指标。
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          内容标题
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          平台
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          浏览量
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          点赞
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          分享
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          点击率
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          发布时间
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentPerformance.length > 0 ? contentPerformance.map((content: ContentPerformance) => (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {content.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {content.platform}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(content.views)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(content.likes)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatNumber(content.shares)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {content.ctr}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(content.publishedAt).toLocaleDateString('zh-CN')}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            暂无内容表现数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}