import axios from 'axios';

// Deepseek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-757a28e83b2e44e8a4a9c90a7ff7c8dd';

interface DeepseekRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

interface DeepseekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface GenerationRequest {
  contentType: 'article' | 'social' | 'email' | 'title' | 'summary' | 'ad';
  topic: string;
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative';
  length: 'short' | 'medium' | 'long';
  language: 'zh' | 'en';
}

interface GeneratedContent {
  id: string;
  content: string;
  type: string;
  score: number;
  createdAt: string;
}

// 创建 Deepseek API 客户端
const deepseekApi = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
  },
});

// 构建系统提示词
function buildSystemPrompt(request: GenerationRequest): string {
  const contentTypeMap = {
    article: '文章',
    social: '社交媒体内容',
    email: '邮件',
    title: '标题',
    summary: '摘要',
    ad: '广告文案'
  };

  const toneMap = {
    professional: '专业',
    casual: '轻松',
    friendly: '友好',
    formal: '正式',
    creative: '创意'
  };

  const lengthMap = {
    short: '简短(100-300字)',
    medium: '中等(300-800字)',
    long: '详细(800-1500字)'
  };

  const language = request.language === 'zh' ? '中文' : '英文';

  return `你是一个专业的内容创作助手。请根据以下要求生成高质量的${contentTypeMap[request.contentType]}：

内容类型：${contentTypeMap[request.contentType]}
语言：${language}
语调风格：${toneMap[request.tone]}
内容长度：${lengthMap[request.length]}

请确保内容：
1. 符合指定的语调和风格
2. 结构清晰，逻辑性强
3. 具有吸引力和实用性
4. 使用纯文本格式，不要使用markdown语法（如#、**、*等标记符号）`;
}

// 构建用户提示词
function buildUserPrompt(request: GenerationRequest): string {
  return `请为以下主题生成内容：${request.topic}`;
}

// 生成内容评分
function generateScore(): number {
  return Math.floor(Math.random() * 30) + 70; // 70-99分
}



// 主要的内容生成函数
export async function generateContent(request: GenerationRequest): Promise<GeneratedContent> {


  try {
    const systemPrompt = buildSystemPrompt(request);
    const userPrompt = buildUserPrompt(request);

    const deepseekRequest: DeepseekRequest = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: request.length === 'short' ? 500 : request.length === 'medium' ? 1200 : 2000,
      temperature: request.tone === 'creative' ? 0.8 : 0.7,
      top_p: 0.9,
      stream: false
    };

    const response = await deepseekApi.post<DeepseekResponse>('/chat/completions', deepseekRequest);
    
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No content generated from Deepseek API');
    }

    const generatedText = response.data.choices[0].message.content;
    
    return {
      id: Date.now().toString(),
      content: generatedText,
      type: request.contentType,
      score: generateScore(),
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Deepseek API Error:', error);
    
    // 如果API调用失败，返回错误信息
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`AI生成失败: ${errorMessage}`);
    }
    
    throw new Error('AI生成服务暂时不可用，请稍后重试');
  }
}

// 改写内容函数
export async function rewriteContent(originalContent: string, request: Partial<GenerationRequest>): Promise<GeneratedContent> {


  try {
    const systemPrompt = `你是一个专业的内容改写助手。请对以下内容进行改写，要求：
1. 保持原意不变
2. 改变表达方式和句式结构
3. 提升内容质量和可读性
4. 保持原有的语调风格
5. 确保改写后的内容更加精炼和有吸引力`;

    const userPrompt = `请改写以下内容：\n\n${originalContent}`;

    const deepseekRequest: DeepseekRequest = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    };

    const response = await deepseekApi.post<DeepseekResponse>('/chat/completions', deepseekRequest);
    
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No content generated from Deepseek API');
    }

    const rewrittenText = response.data.choices[0].message.content;
    
    return {
      id: Date.now().toString(),
      content: rewrittenText,
      type: request.contentType || 'article',
      score: generateScore(),
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Deepseek Rewrite API Error:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`内容改写失败: ${errorMessage}`);
    }
    
    throw new Error('内容改写服务暂时不可用，请稍后重试');
  }
}

export default {
  generateContent,
  rewriteContent
};