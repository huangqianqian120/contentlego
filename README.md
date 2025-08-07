# 🧱 Content LEGO - 智能化 Brick 模块化创作平台

## 📖 项目简介

Content LEGO 是一款智能化 Brick 模块化创作平台，将内容拆解为可复用的 Brick 模块，通过拖拽组合快速构建专业内容。AI 驱动的智能创作，让每个人都能成为内容创作专家。适用于从单人博主到企业内容团队，支持模块化内容创作流程，降低重复劳动，提高产出效率与一致性。

## ✨ 核心功能

### 🧩 Content Brick Library
- ✅ 支持文本、图片、CTA、FAQ、引用、视频等多种 Brick 类型
- ✅ AI智能生成 Brick 内容
- ✅ 版本控制和历史记录
- ✅ 分类管理和标签系统
- ✅ 全文搜索和过滤

### 🎨 可视化构建器
- ✅ 拖拽式内容组合
- ✅ 实时预览（桌面/移动端）
- ✅ Brick 编辑和自定义
- ✅ 模板保存和复用

### 🤖 AI内容引擎
- ✅ 基于提示的内容生成
- ✅ 多种风格选择（专业/休闲/创意）
- ✅ 上下文感知的智能建议
- ✅ 内容优化和改写

## 🛠 技术栈

### 前端
- **框架**: Next.js 14 + React 18
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **拖拽**: @dnd-kit
- **图标**: Lucide React
- **类型**: TypeScript

### 后端
- **框架**: FastAPI (Python)
- **数据验证**: Pydantic
- **CORS**: FastAPI CORS Middleware
- **API文档**: 自动生成的 OpenAPI/Swagger

### 开发工具
- **包管理**: npm/yarn
- **代码规范**: ESLint + Prettier
- **构建工具**: Next.js 内置

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- Python 3.8+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd "Content LEGO"
```

### 2. 安装前端依赖
```bash
npm install
# 或
yarn install
```

### 3. 安装后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 4. 启动开发服务器

#### 启动后端服务 (端口 8000)
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 启动前端服务 (端口 3000)
```bash
# 在项目根目录
npm run dev
# 或
yarn dev
```

### 5. 访问应用
- 前端应用: http://localhost:3000
- 后端API文档: http://localhost:8000/docs
- API健康检查: http://localhost:8000/health

## 📁 项目结构

```
Content LEGO/
├── src/                          # 前端源码
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css          # 全局样式
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   ├── bricks/              # Brick Library 页面
│   │   └── builder/             # 构建器页面
│   ├── components/              # 可复用组件
│   ├── services/                # API服务
│   ├── store/                   # 状态管理
│   └── types/                   # TypeScript类型定义
├── backend/                     # 后端源码
│   ├── main.py                  # FastAPI主应用
│   └── requirements.txt         # Python依赖
├── public/                      # 静态资源
├── package.json                 # 前端依赖配置
├── tailwind.config.js          # Tailwind配置
├── tsconfig.json               # TypeScript配置
└── README.md                   # 项目说明
```

## 🎯 MVP功能实现状态

### ✅ 第一阶段 (已完成)
- [x] 项目基础架构搭建
- [x] Content Brick 数据模型设计
- [x] Brick Library 页面 (浏览、搜索、过滤)
- [x] 可视化构建器界面
- [x] 基础拖拽功能框架
- [x] 后端API服务
- [x] AI内容生成模拟接口

### 🚧 第二阶段 (开发中)
- [ ] 完整的拖拽排序功能
- [ ] Brick 编辑器
- [ ] 模板保存和管理
- [ ] 真实AI API集成
- [ ] 用户认证系统

### 📋 第三阶段 (计划中)
- [ ] 内容发布集成 (WordPress等)
- [ ] 数据分析和优化建议
- [ ] 团队协作功能
- [ ] 权限管理系统

## 🔧 开发指南

### 添加新的 Brick 类型
1. 在 `src/types/index.ts` 中更新 `BrickType` 类型
2. 在构建器中添加对应的渲染逻辑
3. 在后端添加相应的验证和处理逻辑

### 自定义样式
- 主要样式定义在 `src/app/globals.css`
- 使用 Tailwind CSS 类进行样式设计
- 自定义颜色和主题在 `tailwind.config.js` 中配置

### API扩展
- 后端API路由定义在 `backend/main.py`
- 前端API调用封装在 `src/services/api.ts`
- 所有API都有自动生成的文档

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙋‍♂️ 支持

如果您在使用过程中遇到问题，请：
1. 查看项目文档和 FAQ
2. 搜索已有的 Issues
3. 创建新的 Issue 描述问题

---

**Content LEGO** - 让内容创作更加模块化和高效！ 🚀