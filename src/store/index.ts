import { create } from 'zustand';
import { ContentBrick, ContentTemplate, BuilderState, BrickType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface BrickStore {
  // Brick Library 状态
  bricks: ContentBrick[];
  templates: ContentTemplate[];
  
  // 构建器状态
  builder: BuilderState;
  
  // Brick Library 操作
  addBrick: (brick: Omit<ContentBrick, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateBrick: (id: string, updates: Partial<ContentBrick>) => void;
  deleteBrick: (id: string) => void;
  getBricksByType: (type: BrickType) => ContentBrick[];
  searchBricks: (query: string) => ContentBrick[];
  
  // 模板操作
  addTemplate: (template: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<ContentTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // 构建器操作
  addBrickToBuilder: (brick: ContentBrick) => void;
  removeBrickFromBuilder: (index: number) => void;
  reorderBricksInBuilder: (fromIndex: number, toIndex: number) => void;
  updateBrickInBuilder: (index: number, updates: Partial<ContentBrick>) => void;
  clearBuilder: () => void;
  setPreviewMode: (isPreview: boolean) => void;
  setMobilePreview: (isMobile: boolean) => void;
  loadTemplate: (template: ContentTemplate) => void;
  saveAsTemplate: (name: string, description: string, category: string) => void;
}

export const useBrickStore = create<BrickStore>((set, get) => ({
  // 初始状态
  bricks: [
    {
      id: '1',
      type: 'text',
      content: '欢迎使用 Content LEGO！这是一个示例文本 Brick。',
      tags: ['示例', '文本'],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'cta',
      content: '立即开始创作',
      metadata: {
        buttonText: '立即开始创作',
        linkUrl: '#',
        description: '点击开始您的内容创作之旅',
      },
      tags: ['CTA', '按钮'],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  templates: [],
  builder: {
    selectedBricks: [],
    isPreviewMode: false,
    isMobilePreview: false,
  },

  // 积木库操作
  addBrick: (brickData) => {
    const newBrick: ContentBrick = {
      ...brickData,
      id: uuidv4(),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      bricks: [...state.bricks, newBrick],
    }));
  },

  updateBrick: (id, updates) => {
    set((state) => ({
      bricks: state.bricks.map((brick) =>
        brick.id === id
          ? {
              ...brick,
              ...updates,
              version: brick.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : brick
      ),
    }));
  },

  deleteBrick: (id) => {
    set((state) => ({
      bricks: state.bricks.filter((brick) => brick.id !== id),
    }));
  },

  getBricksByType: (type) => {
    return get().bricks.filter((brick) => brick.type === type);
  },

  searchBricks: (query) => {
    const { bricks } = get();
    if (!query.trim()) return bricks;
    
    const lowerQuery = query.toLowerCase();
    return bricks.filter(
      (brick) =>
        brick.content.toLowerCase().includes(lowerQuery) ||
        brick.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // 模板操作
  addTemplate: (templateData) => {
    const newTemplate: ContentTemplate = {
      ...templateData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      templates: [...state.templates, newTemplate],
    }));
  },

  updateTemplate: (id, updates) => {
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? {
              ...template,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : template
      ),
    }));
  },

  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    }));
  },

  // 构建器操作
  addBrickToBuilder: (brick) => {
    set((state) => ({
      builder: {
        ...state.builder,
        selectedBricks: [...state.builder.selectedBricks, { ...brick, id: uuidv4() }],
      },
    }));
  },

  removeBrickFromBuilder: (index) => {
    set((state) => ({
      builder: {
        ...state.builder,
        selectedBricks: state.builder.selectedBricks.filter((_, i) => i !== index),
      },
    }));
  },

  reorderBricksInBuilder: (fromIndex, toIndex) => {
    set((state) => {
      const newBricks = [...state.builder.selectedBricks];
      const [removed] = newBricks.splice(fromIndex, 1);
      newBricks.splice(toIndex, 0, removed);
      
      return {
        builder: {
          ...state.builder,
          selectedBricks: newBricks,
        },
      };
    });
  },

  updateBrickInBuilder: (index, updates) => {
    set((state) => ({
      builder: {
        ...state.builder,
        selectedBricks: state.builder.selectedBricks.map((brick, i) =>
          i === index ? { ...brick, ...updates } : brick
        ),
      },
    }));
  },

  clearBuilder: () => {
    set((state) => ({
      builder: {
        ...state.builder,
        selectedBricks: [],
        currentTemplate: undefined,
      },
    }));
  },

  setPreviewMode: (isPreview) => {
    set((state) => ({
      builder: {
        ...state.builder,
        isPreviewMode: isPreview,
      },
    }));
  },

  setMobilePreview: (isMobile) => {
    set((state) => ({
      builder: {
        ...state.builder,
        isMobilePreview: isMobile,
      },
    }));
  },

  loadTemplate: (template) => {
    set((state) => ({
      builder: {
        ...state.builder,
        selectedBricks: template.bricks.map(brick => ({ ...brick, id: uuidv4() })),
        currentTemplate: template,
      },
    }));
  },

  saveAsTemplate: (name, description, category) => {
    const { builder, addTemplate } = get();
    if (builder.selectedBricks.length === 0) return;
    
    addTemplate({
      name,
      description,
      category,
      bricks: builder.selectedBricks,
      isPublic: false,
      createdBy: 'current-user', // TODO: 从用户状态获取
    });
  },
}));