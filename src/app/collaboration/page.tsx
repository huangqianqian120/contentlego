'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Eye, 
  Edit, 
  Send, 
  Crown, 
  Mail, 
  MoreHorizontal,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Search,
  Filter,
  Bell
} from 'lucide-react'
import { Navigation } from '@/components'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
  avatar?: string
}

interface Permission {
  id: string
  name: string
  description: string
  roles: ('admin' | 'editor' | 'viewer')[]
}

interface ActivityLog {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  type: 'create' | 'edit' | 'delete' | 'publish' | 'share'
}







export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'permissions' | 'activity'>('members')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 协作功能暂未实现，显示空状态
    setLoading(false)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-100'
      case 'editor': return 'text-blue-600 bg-blue-100'
      case 'viewer': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '管理员'
      case 'editor': return '编辑者'
      case 'viewer': return '查看者'
      default: return '未知'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'inactive': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'edit': return <Edit className="w-4 h-4 text-blue-500" />
      case 'delete': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'publish': return <Send className="w-4 h-4 text-purple-500" />
      case 'share': return <Users className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="协作与权限系统" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能开发提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-900">功能开发中</h3>
              <p className="text-blue-700 mt-1">
                协作与权限系统正在开发中，以下为功能预览界面。完整功能将包括团队成员管理、细粒度权限控制、实时协作编辑等。
              </p>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'members'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                团队成员
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'permissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                权限管理
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                活动日志
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 团队成员标签页 */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">团队成员</h3>
                  <button 
                    onClick={() => setShowInviteModal(true)}
                    className="btn-primary flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    邀请成员
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {members.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无团队成员</h3>
                      <p className="text-gray-600">团队协作功能正在开发中</p>
                      <button 
                        onClick={() => setShowInviteModal(true)}
                        className="mt-4 btn-primary"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        邀请成员
                      </button>
                    </div>
                  ) : (
                    members.map(member => (
                      <div key={member.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-lg font-medium text-gray-600">
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{member.name}</h4>
                                {member.role === 'admin' && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{member.email}</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                                  {getRoleText(member.role)}
                                </span>
                                <span className={`text-xs ${getStatusColor(member.status)}`}>
                                  {member.status === 'active' ? '活跃' : member.status === 'pending' ? '待确认' : '非活跃'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-sm text-gray-600 hover:text-gray-900">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button className="text-sm text-gray-600 hover:text-gray-900">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          加入时间: {new Date(member.joinedAt).toLocaleDateString('zh-CN')} | 
                          最后活跃: {new Date(member.lastActive).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 权限管理标签页 */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">权限设置</h3>
                  <p className="text-gray-600 mb-6">
                    管理不同角色的权限设置，确保团队成员只能访问其职责范围内的功能。
                  </p>
                </div>
                
                {permissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无权限配置</h3>
                    <p className="text-gray-600">权限管理功能正在开发中</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            权限
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            管理员
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            编辑者
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            查看者
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {permissions.map(permission => (
                          <tr key={permission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {permission.roles.includes('admin') ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <div className="w-5 h-5 mx-auto"></div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {permission.roles.includes('editor') ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <div className="w-5 h-5 mx-auto"></div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {permission.roles.includes('viewer') ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <div className="w-5 h-5 mx-auto"></div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 活动日志标签页 */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">活动日志</h3>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option>全部活动</option>
                      <option>创建</option>
                      <option>编辑</option>
                      <option>删除</option>
                      <option>发布</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活动记录</h3>
                      <p className="text-gray-600">活动日志功能正在开发中</p>
                    </div>
                  ) : (
                    activityLogs.map(log => (
                      <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(log.type)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">{log.user}</span>
                              {' '}{log.action}{' '}
                              <span className="font-medium">{log.target}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 邀请成员模态框 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">邀请团队成员</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  角色
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="editor">编辑者</option>
                  <option value="viewer">查看者</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <button className="btn-primary flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                发送邀请
              </button>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}