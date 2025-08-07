// Content Brick 类型定义
export type BrickType = 'text' | 'image' | 'cta' | 'faq' | 'quote' | 'video';

export interface ContentBrick {
  id: string;
  type: BrickType;
  title: string;
  content: string;
  metadata?: {
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    buttonText?: string;
  };
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Content Template 类型定义
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  bricks: ContentBrick[];
  category: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Content Composition 类型定义（拼装完成的作品）
export interface ContentComposition {
  id: string;
  name: string;
  description?: string;
  bricks: ContentBrick[];
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 构建器状态类型
export interface BuilderState {
  selectedBricks: ContentBrick[];
  currentTemplate?: ContentTemplate;
  isPreviewMode: boolean;
  isMobilePreview: boolean;
}

// AI生成请求类型
export interface AIGenerateRequest {
  type: BrickType;
  prompt: string;
  context?: string;
  style?: 'professional' | 'casual' | 'creative';
}

// AI生成响应类型
export interface AIGenerateResponse {
  content: string;
  suggestions?: string[];
}

// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  plan: 'starter' | 'pro' | 'enterprise';
  aiUsage: {
    used: number;
    limit: number;
  };
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}