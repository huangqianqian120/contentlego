import axios from 'axios';
import { ContentBrick, ContentTemplate, ContentComposition, AIGenerateRequest, AIGenerateResponse } from '@/types';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 这里可以添加认证 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 积木相关 API
export const bricksApi = {
  // 获取积木列表
  getBricks: async (params?: { type?: string; search?: string }): Promise<ContentBrick[]> => {
    const response = await api.get('/bricks', { params });
    return response.data;
  },

  // 获取单个积木
  getBrick: async (id: string): Promise<ContentBrick> => {
    const response = await api.get(`/bricks/${id}`);
    return response.data;
  },

  // 创建积木
  createBrick: async (brick: {
    type: string;
    content: string;
    metadata?: any;
    tags?: string[];
  }): Promise<ContentBrick> => {
    const response = await api.post('/bricks', brick);
    return response.data;
  },

  // 更新积木
  updateBrick: async (id: string, updates: {
    content?: string;
    metadata?: any;
    tags?: string[];
  }): Promise<ContentBrick> => {
    const response = await api.put(`/bricks/${id}`, updates);
    return response.data;
  },

  // 删除积木
  deleteBrick: async (id: string): Promise<void> => {
    await api.delete(`/bricks/${id}`);
  },
};

// 模板相关 API
export const templatesApi = {
  // 获取模板列表
  getTemplates: async (): Promise<ContentTemplate[]> => {
    const response = await api.get('/templates');
    return response.data;
  },

  // 获取单个模板
  getTemplate: async (id: string): Promise<ContentTemplate> => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  // 创建模板
  createTemplate: async (template: {
    name: string;
    description: string;
    bricks: ContentBrick[];
    category: string;
    isPublic?: boolean;
  }): Promise<ContentTemplate> => {
    const response = await api.post('/templates', template);
    return response.data;
  },

  // 删除模板
  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },
};

// AI 相关 API
export const aiApi = {
  // AI 生成内容
  generateContent: async (request: AIGenerateRequest): Promise<AIGenerateResponse> => {
    const response = await api.post('/ai/generate', request);
    return response.data;
  },

  // 将AI生成的内容保存为Brick
  saveAsBrick: async (data: {
    content: string;
    contentType: string;
    title?: string;
    tags?: string[];
  }): Promise<ContentBrick> => {
    const response = await api.post('/ai/save-as-brick', data);
    return response.data;
  },
};

// 健康检查
// 作品相关 API
export const compositionsApi = {
  // 获取作品列表
  getCompositions: async (): Promise<ContentComposition[]> => {
    const response = await api.get('/compositions');
    return response.data;
  },

  // 获取单个作品
  getComposition: async (id: string): Promise<ContentComposition> => {
    const response = await api.get(`/compositions/${id}`);
    return response.data;
  },

  // 创建作品
  createComposition: async (composition: {
    name: string;
    description?: string;
    bricks: ContentBrick[];
    category?: string;
    tags?: string[];
  }): Promise<ContentComposition> => {
    const response = await api.post('/compositions', composition);
    return response.data;
  },

  // 删除作品
  deleteComposition: async (id: string): Promise<void> => {
    await api.delete(`/compositions/${id}`);
  },
};

// 渠道管理相关 API
export const channelsApi = {
  // 获取渠道列表
  getChannels: async (): Promise<any[]> => {
    const response = await api.get('/channels');
    return response.data;
  },

  // 创建渠道
  createChannel: async (channel: {
    name: string;
    description?: string;
    configUrl?: string;
  }): Promise<any> => {
    const response = await api.post('/channels', channel);
    return response.data;
  },

  // 更新渠道配置
  updateChannel: async (id: string, updates: {
    name?: string;
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    accountName?: string;
    configUrl?: string;
    description?: string;
    connected?: boolean;
    status?: string;
  }): Promise<any> => {
    const response = await api.put(`/channels/${id}`, updates);
    return response.data;
  },

  // 删除渠道
  deleteChannel: async (id: string): Promise<void> => {
    await api.delete(`/channels/${id}`);
  },

  // 测试渠道连接
  testConnection: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/channels/${id}/test`);
    return response.data;
  },

  // 发布内容到渠道
  publishToChannel: async (channelId: string, compositionId: string): Promise<any> => {
    const response = await api.post(`/channels/${channelId}/publish`, { composition_id: compositionId });
    return response.data;
  },
};

export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; bricks_count: number; templates_count: number; compositions_count: number }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;