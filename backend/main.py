from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import json
import os

app = FastAPI(
    title="Content LEGO API",
    description="智能化 Brick 模块化创作平台 API",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境应该配置具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据模型
class BrickMetadata(BaseModel):
    description: Optional[str] = None
    imageUrl: Optional[str] = None
    linkUrl: Optional[str] = None
    buttonText: Optional[str] = None

class ContentBrick(BaseModel):
    id: str
    type: str  # 'text' | 'image' | 'cta' | 'faq' | 'quote' | 'video'
    title: str
    content: str
    metadata: Optional[BrickMetadata] = None
    tags: List[str]
    version: int
    createdAt: str
    updatedAt: str

class CreateBrickRequest(BaseModel):
    type: str
    title: str
    content: str
    metadata: Optional[BrickMetadata] = None
    tags: List[str] = []

class UpdateBrickRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    metadata: Optional[BrickMetadata] = None
    tags: Optional[List[str]] = None

class ContentTemplate(BaseModel):
    id: str
    name: str
    description: str
    bricks: List[ContentBrick]
    category: str
    isPublic: bool
    variables: List[TemplateVariable] = []
    tags: List[str] = []
    usageCount: int = 0
    rating: float = 0.0
    createdBy: str
    createdAt: str
    updatedAt: str

class TemplateVariable(BaseModel):
    name: str
    type: str  # 'text' | 'image' | 'link' | 'date'
    required: bool
    defaultValue: Optional[str] = None
    description: str

class CreateTemplateRequest(BaseModel):
    name: str
    description: str
    bricks: List[ContentBrick]
    category: str
    isPublic: bool = False
    variables: List[TemplateVariable] = []
    tags: List[str] = []

class UpdateTemplateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    bricks: Optional[List[ContentBrick]] = None
    category: Optional[str] = None
    isPublic: Optional[bool] = None
    variables: Optional[List[TemplateVariable]] = None
    tags: Optional[List[str]] = None

class AIGenerateRequest(BaseModel):
    contentType: str  # 'article' | 'social' | 'email' | 'title' | 'summary' | 'ad'
    topic: str
    tone: str  # 'professional' | 'casual' | 'friendly' | 'formal' | 'creative'
    length: str  # 'short' | 'medium' | 'long'
    language: str  # 'zh' | 'en'
    keywords: List[str] = []
    targetAudience: Optional[str] = None
    additionalInstructions: Optional[str] = None

class AIGenerateResponse(BaseModel):
    id: str
    content: str
    type: str
    score: int
    createdAt: str
    suggestions: Optional[List[str]] = None

class SaveAsBrickRequest(BaseModel):
    content: str
    contentType: str
    title: Optional[str] = None
    tags: List[str] = []

class ContentComposition(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    bricks: List[ContentBrick]
    category: str
    tags: List[str]
    createdBy: str
    createdAt: str
    updatedAt: str

class CreateCompositionRequest(BaseModel):
    name: str
    description: Optional[str] = None
    bricks: List[ContentBrick]
    category: str = "default"
    tags: List[str] = []

class PublishingChannel(BaseModel):
    id: str
    name: str
    type: str  # 'wechat' | 'weibo' | 'linkedin' | 'instagram' | 'email' | 'custom'
    connected: bool
    status: str  # 'active' | 'inactive' | 'error'
    apiKey: Optional[str] = None
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    accountName: Optional[str] = None
    configUrl: Optional[str] = None
    description: Optional[str] = None
    isCustom: bool = False
    createdBy: str
    createdAt: str
    updatedAt: str

class CreateChannelRequest(BaseModel):
    name: str
    type: str = "custom"
    description: Optional[str] = None
    configUrl: Optional[str] = None

class UpdateChannelRequest(BaseModel):
    name: Optional[str] = None
    apiKey: Optional[str] = None
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    accountName: Optional[str] = None
    configUrl: Optional[str] = None
    description: Optional[str] = None
    connected: Optional[bool] = None
    status: Optional[str] = None

# 数据文件路径
DATA_DIR = "data"
BRICKS_FILE = os.path.join(DATA_DIR, "bricks.json")
TEMPLATES_FILE = os.path.join(DATA_DIR, "templates.json")
COMPOSITIONS_FILE = os.path.join(DATA_DIR, "compositions.json")
CHANNELS_FILE = os.path.join(DATA_DIR, "channels.json")

# 确保数据目录存在
os.makedirs(DATA_DIR, exist_ok=True)

# 内存数据库
bricks_db: Dict[str, ContentBrick] = {}
templates_db: Dict[str, ContentTemplate] = {}
compositions_db: Dict[str, ContentComposition] = {}
channels_db: Dict[str, PublishingChannel] = {}

# 数据持久化函数
def save_bricks_to_file():
    """保存bricks数据到文件"""
    try:
        with open(BRICKS_FILE, 'w', encoding='utf-8') as f:
            # 将ContentBrick对象转换为字典
            bricks_data = {brick_id: brick.model_dump() for brick_id, brick in bricks_db.items()}
            json.dump(bricks_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存bricks数据失败: {e}")

def load_bricks_from_file():
    """从文件加载bricks数据"""
    try:
        if os.path.exists(BRICKS_FILE):
            with open(BRICKS_FILE, 'r', encoding='utf-8') as f:
                bricks_data = json.load(f)
                # 将字典转换为ContentBrick对象
                for brick_id, brick_dict in bricks_data.items():
                    bricks_db[brick_id] = ContentBrick(**brick_dict)
    except Exception as e:
        print(f"加载bricks数据失败: {e}")

def save_templates_to_file():
    """保存templates数据到文件"""
    try:
        with open(TEMPLATES_FILE, 'w', encoding='utf-8') as f:
            # 将ContentTemplate对象转换为字典
            templates_data = {template_id: template.model_dump() for template_id, template in templates_db.items()}
            json.dump(templates_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存templates数据失败: {e}")

def load_templates_from_file():
    """从文件加载templates数据"""
    try:
        if os.path.exists(TEMPLATES_FILE):
            with open(TEMPLATES_FILE, 'r', encoding='utf-8') as f:
                templates_data = json.load(f)
                # 将字典转换为ContentTemplate对象
                for template_id, template_dict in templates_data.items():
                    templates_db[template_id] = ContentTemplate(**template_dict)
    except Exception as e:
        print(f"加载templates数据失败: {e}")

def save_compositions_to_file():
    """保存compositions数据到文件"""
    try:
        with open(COMPOSITIONS_FILE, 'w', encoding='utf-8') as f:
            # 将ContentComposition对象转换为字典
            compositions_data = {composition_id: composition.model_dump() for composition_id, composition in compositions_db.items()}
            json.dump(compositions_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存compositions数据失败: {e}")

def load_compositions_from_file():
    """从文件加载compositions数据"""
    try:
        if os.path.exists(COMPOSITIONS_FILE):
            with open(COMPOSITIONS_FILE, 'r', encoding='utf-8') as f:
                compositions_data = json.load(f)
                # 将字典转换为ContentComposition对象
                for composition_id, composition_dict in compositions_data.items():
                    compositions_db[composition_id] = ContentComposition(**composition_dict)
    except Exception as e:
        print(f"加载compositions数据失败: {e}")

def save_channels_to_file():
    """保存channels数据到文件"""
    try:
        with open(CHANNELS_FILE, 'w', encoding='utf-8') as f:
            # 将PublishingChannel对象转换为字典
            channels_data = {channel_id: channel.model_dump() for channel_id, channel in channels_db.items()}
            json.dump(channels_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存channels数据失败: {e}")

def load_channels_from_file():
    """从文件加载channels数据"""
    try:
        if os.path.exists(CHANNELS_FILE):
            with open(CHANNELS_FILE, 'r', encoding='utf-8') as f:
                channels_data = json.load(f)
                # 将字典转换为PublishingChannel对象
                for channel_id, channel_dict in channels_data.items():
                    channels_db[channel_id] = PublishingChannel(**channel_dict)
    except Exception as e:
        print(f"加载channels数据失败: {e}")

# 初始化示例数据
def init_sample_data():
    # 先尝试从文件加载数据
    load_bricks_from_file()
    load_templates_from_file()
    
    # 如果没有数据，则创建示例数据
    if not bricks_db:
        sample_bricks = [
            {
                "id": "sample-1",
                "type": "text",
                "title": "平台介绍",
                "content": "欢迎使用 Content LEGO！这是一个功能强大的 Brick 模块化创作平台。",
                "tags": ["欢迎", "介绍"],
                "version": 1,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
            },
            {
                "id": "sample-2",
                "type": "cta",
                "title": "开始创作按钮",
                "content": "立即开始创作",
                "metadata": {
                    "buttonText": "立即开始创作",
                    "linkUrl": "/builder",
                    "description": "点击开始您的内容创作之旅",
                },
                "tags": ["CTA", "按钮"],
                "version": 1,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
            },
            {
                "id": "sample-3",
                "type": "quote",
                "title": "团队名言",
                "content": "\"内容是王道，但结构化的内容是帝国。\" - Content LEGO 团队",
                "tags": ["引用", "名言"],
                "version": 1,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat(),
            },
        ]
        
        for brick_data in sample_bricks:
            brick = ContentBrick(**brick_data)
            bricks_db[brick.id] = brick
        
        # 保存示例数据到文件
        save_bricks_to_file()
    
    if not channels_db:
        # 添加示例渠道数据
        sample_channels = [
            {
                "id": "wechat",
                "name": "微信公众号",
                "type": "wechat",
                "connected": True,
                "status": "active",
                "accountName": "Content LEGO 官方",
                "isCustom": False,
                "createdBy": "system",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            },
            {
                "id": "weibo",
                "name": "微博",
                "type": "weibo",
                "connected": False,
                "status": "inactive",
                "isCustom": False,
                "createdBy": "system",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            },
            {
                "id": "linkedin",
                "name": "LinkedIn",
                "type": "linkedin",
                "connected": True,
                "status": "active",
                "accountName": "Content LEGO",
                "isCustom": False,
                "createdBy": "system",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            },
            {
                "id": "instagram",
                "name": "Instagram",
                "type": "instagram",
                "connected": False,
                "status": "inactive",
                "isCustom": False,
                "createdBy": "system",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            },
            {
                "id": "email",
                "name": "邮件营销",
                "type": "email",
                "connected": True,
                "status": "active",
                "accountName": "marketing@contentlego.com",
                "isCustom": False,
                "createdBy": "system",
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            }
        ]
        
        for channel_data in sample_channels:
            channel = PublishingChannel(**channel_data)
            channels_db[channel.id] = channel
        
        save_channels_to_file()

# 启动时加载数据
load_bricks_from_file()
load_templates_from_file()
load_compositions_from_file()
load_channels_from_file()
init_sample_data()

# API 路由

@app.get("/")
async def root():
    return {"message": "Content LEGO API v1.0", "status": "running"}

# 积木相关 API

@app.get("/bricks", response_model=List[ContentBrick])
async def get_bricks(type: Optional[str] = None, search: Optional[str] = None):
    """获取积木列表"""
    bricks = list(bricks_db.values())
    
    # 按类型过滤
    if type and type != "all":
        bricks = [brick for brick in bricks if brick.type == type]
    
    # 按搜索关键词过滤
    if search:
        search_lower = search.lower()
        bricks = [
            brick for brick in bricks 
            if search_lower in brick.content.lower() or 
               any(search_lower in tag.lower() for tag in brick.tags)
        ]
    
    return bricks

@app.get("/bricks/{brick_id}", response_model=ContentBrick)
async def get_brick(brick_id: str):
    """获取单个积木"""
    if brick_id not in bricks_db:
        raise HTTPException(status_code=404, detail="积木未找到")
    return bricks_db[brick_id]

@app.post("/bricks", response_model=ContentBrick)
async def create_brick(brick_request: CreateBrickRequest):
    """创建新积木"""
    brick_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    brick = ContentBrick(
        id=brick_id,
        type=brick_request.type,
        title=brick_request.title,
        content=brick_request.content,
        metadata=brick_request.metadata,
        tags=brick_request.tags,
        version=1,
        createdAt=now,
        updatedAt=now
    )
    
    bricks_db[brick_id] = brick
    save_bricks_to_file()  # 保存到文件
    return brick

@app.put("/bricks/{brick_id}", response_model=ContentBrick)
async def update_brick(brick_id: str, brick_request: UpdateBrickRequest):
    """更新积木"""
    if brick_id not in bricks_db:
        raise HTTPException(status_code=404, detail="积木未找到")
    
    brick = bricks_db[brick_id]
    
    # 更新字段
    if brick_request.title is not None:
        brick.title = brick_request.title
    if brick_request.content is not None:
        brick.content = brick_request.content
    if brick_request.metadata is not None:
        brick.metadata = brick_request.metadata
    if brick_request.tags is not None:
        brick.tags = brick_request.tags
    
    # 更新版本和时间
    brick.version += 1
    brick.updatedAt = datetime.now().isoformat()
    
    save_bricks_to_file()  # 保存到文件
    return brick

@app.delete("/bricks/{brick_id}")
async def delete_brick(brick_id: str):
    """删除积木"""
    if brick_id not in bricks_db:
        raise HTTPException(status_code=404, detail="积木未找到")
    
    del bricks_db[brick_id]
    save_bricks_to_file()  # 保存到文件
    return {"message": "积木已删除"}

# 模板相关 API

@app.get("/templates", response_model=List[ContentTemplate])
async def get_templates():
    """获取模板列表"""
    return list(templates_db.values())

@app.get("/templates/{template_id}", response_model=ContentTemplate)
async def get_template(template_id: str):
    """获取单个模板"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="模板未找到")
    return templates_db[template_id]

@app.post("/templates", response_model=ContentTemplate)
async def create_template(template_request: CreateTemplateRequest):
    """创建新模板"""
    template_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    template = ContentTemplate(
        id=template_id,
        name=template_request.name,
        description=template_request.description,
        bricks=template_request.bricks,
        category=template_request.category,
        isPublic=template_request.isPublic,
        variables=template_request.variables,
        tags=template_request.tags,
        usageCount=0,
        rating=0.0,
        createdBy="current-user",  # TODO: 从认证中获取
        createdAt=now,
        updatedAt=now
    )
    
    templates_db[template_id] = template
    save_templates_to_file()  # 保存到文件
    return template

@app.put("/templates/{template_id}", response_model=ContentTemplate)
async def update_template(template_id: str, template_request: UpdateTemplateRequest):
    """更新模板"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="模板未找到")
    
    template = templates_db[template_id]
    now = datetime.now().isoformat()
    
    # 更新字段
    if template_request.name is not None:
        template.name = template_request.name
    if template_request.description is not None:
        template.description = template_request.description
    if template_request.bricks is not None:
        template.bricks = template_request.bricks
    if template_request.category is not None:
        template.category = template_request.category
    if template_request.isPublic is not None:
        template.isPublic = template_request.isPublic
    if template_request.variables is not None:
        template.variables = template_request.variables
    if template_request.tags is not None:
        template.tags = template_request.tags
    
    template.updatedAt = now
    
    templates_db[template_id] = template
    save_templates_to_file()  # 保存到文件
    return template

@app.post("/templates/{template_id}/use")
async def use_template(template_id: str):
    """使用模板（增加使用次数）"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="模板未找到")
    
    template = templates_db[template_id]
    template.usageCount += 1
    template.updatedAt = datetime.now().isoformat()
    
    templates_db[template_id] = template
    save_templates_to_file()  # 保存到文件
    return {"message": "模板使用次数已更新", "usageCount": template.usageCount}

@app.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """删除模板"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="模板未找到")
    
    del templates_db[template_id]
    save_templates_to_file()  # 保存到文件
    return {"message": "模板已删除"}

# AI 相关 API

@app.post("/ai/generate", response_model=AIGenerateResponse)
async def ai_generate_content(request: AIGenerateRequest):
    """AI 生成内容 - 注意：这是后端模拟接口，前端直接调用 Deepseek API"""
    # 这个接口主要用于后端处理和数据存储
    # 前端会直接调用 Deepseek API 进行内容生成
    
    # 生成模拟内容（实际使用中前端会传入生成的内容）
    content_templates = {
        "article": f"关于'{request.topic}'的深度文章内容...",
        "social": f"🚀 {request.topic} 社交媒体内容 #标签",
        "email": f"主题：{request.topic}\n\n亲爱的用户，\n\n...",
        "title": f"{request.topic} - 吸引人的标题",
        "summary": f"{request.topic} 的核心要点总结...",
        "ad": f"发现 {request.topic} 的无限可能！立即行动！"
    }
    
    content = content_templates.get(request.contentType, f"关于 {request.topic} 的内容")
    
    # 生成响应
    response_id = str(uuid.uuid4())
    score = 85 + (hash(request.topic) % 15)  # 85-99分
    
    suggestions = [
        "尝试调整语调风格",
        "添加更多关键词",
        "优化目标受众定位",
        "考虑增加互动元素"
    ]
    
    return AIGenerateResponse(
        id=response_id,
        content=content,
        type=request.contentType,
        score=score,
        createdAt=datetime.now().isoformat(),
        suggestions=suggestions
    )

@app.post("/ai/save-as-brick", response_model=ContentBrick)
async def save_generated_content_as_brick(request: SaveAsBrickRequest):
    """将AI生成的内容保存为Brick"""
    brick_id = str(uuid.uuid4())
    
    # 根据内容类型映射到Brick类型
    brick_type_mapping = {
        "article": "text",
        "social": "text", 
        "email": "text",
        "title": "text",
        "summary": "text",
        "ad": "cta"
    }
    
    brick_type = brick_type_mapping.get(request.contentType, "text")
    
    # 创建Brick
    brick = ContentBrick(
        id=brick_id,
        type=brick_type,
        title=request.title or f"AI生成的{request.contentType}",
        content=request.content,
        metadata=BrickMetadata(
            description=f"通过AI生成的{request.contentType}内容"
        ),
        tags=request.tags + ["AI生成", request.contentType],
        version=1,
        createdAt=datetime.now().isoformat(),
        updatedAt=datetime.now().isoformat()
    )
    
    # 保存到数据库
    bricks_db[brick_id] = brick
    save_bricks_to_file()  # 持久化到文件
    
    return brick

# 健康检查
# 作品相关 API
@app.get("/compositions", response_model=List[ContentComposition])
async def get_compositions():
    """获取所有作品"""
    return list(compositions_db.values())

@app.get("/compositions/{composition_id}", response_model=ContentComposition)
async def get_composition(composition_id: str):
    """获取单个作品"""
    if composition_id not in compositions_db:
        raise HTTPException(status_code=404, detail="作品不存在")
    return compositions_db[composition_id]

@app.post("/compositions", response_model=ContentComposition)
async def create_composition(composition_request: CreateCompositionRequest):
    """创建新作品"""
    composition_id = str(uuid.uuid4())
    
    composition = ContentComposition(
        id=composition_id,
        name=composition_request.name,
        description=composition_request.description,
        bricks=composition_request.bricks,
        category=composition_request.category,
        tags=composition_request.tags,
        createdBy="user",  # 后续可以从认证信息获取
        createdAt=datetime.now().isoformat(),
        updatedAt=datetime.now().isoformat()
    )
    
    compositions_db[composition_id] = composition
    save_compositions_to_file()
    
    return composition

@app.delete("/compositions/{composition_id}")
async def delete_composition(composition_id: str):
    """删除作品"""
    if composition_id not in compositions_db:
        raise HTTPException(status_code=404, detail="作品不存在")
    
    del compositions_db[composition_id]
    save_compositions_to_file()
    
    return {"message": "作品删除成功"}

# 渠道管理 API
@app.get("/channels", response_model=List[PublishingChannel])
async def get_channels():
    """获取所有渠道"""
    return list(channels_db.values())

@app.post("/channels", response_model=PublishingChannel)
async def create_channel(request: CreateChannelRequest):
    """创建新渠道"""
    channel_id = f"channel-{len(channels_db) + 1}"
    
    channel = PublishingChannel(
        id=channel_id,
        name=request.name,
        type="custom",
        connected=False,
        status="inactive",
        description=request.description,
        configUrl=request.configUrl,
        isCustom=True,
        createdBy="user",
        createdAt=datetime.now().isoformat(),
        updatedAt=datetime.now().isoformat()
    )
    
    channels_db[channel_id] = channel
    save_channels_to_file()
    
    return channel

@app.put("/channels/{channel_id}", response_model=PublishingChannel)
async def update_channel(channel_id: str, request: UpdateChannelRequest):
    """更新渠道配置"""
    if channel_id not in channels_db:
        raise HTTPException(status_code=404, detail="渠道未找到")
    
    channel = channels_db[channel_id]
    
    # 更新字段
    if request.name is not None:
        channel.name = request.name
    if request.apiKey is not None:
        channel.apiKey = request.apiKey
    if request.accessToken is not None:
        channel.accessToken = request.accessToken
    if request.refreshToken is not None:
        channel.refreshToken = request.refreshToken
    if request.accountName is not None:
        channel.accountName = request.accountName
    if request.configUrl is not None:
        channel.configUrl = request.configUrl
    if request.description is not None:
        channel.description = request.description
    if request.connected is not None:
        channel.connected = request.connected
        channel.status = "active" if request.connected else "inactive"
    if request.status is not None:
        channel.status = request.status
    
    channel.updatedAt = datetime.now().isoformat()
    
    save_channels_to_file()
    
    return channel

@app.delete("/channels/{channel_id}")
async def delete_channel(channel_id: str):
    """删除渠道"""
    if channel_id not in channels_db:
        raise HTTPException(status_code=404, detail="渠道未找到")
    
    channel = channels_db[channel_id]
    
    # 只允许删除自定义渠道
    if not channel.isCustom:
        raise HTTPException(status_code=400, detail="不能删除系统渠道")
    
    del channels_db[channel_id]
    save_channels_to_file()
    
    return {"message": "渠道删除成功"}

@app.post("/channels/{channel_id}/test")
async def test_channel_connection(channel_id: str):
    """测试渠道连接"""
    if channel_id not in channels_db:
        raise HTTPException(status_code=404, detail="渠道未找到")
    
    channel = channels_db[channel_id]
    
    # 这里可以根据不同渠道类型实现实际的连接测试
    # 目前返回模拟结果
    if channel.apiKey and channel.accessToken:
        return {"success": True, "message": "连接测试成功"}
    else:
        return {"success": False, "message": "缺少必要的认证信息"}

@app.post("/channels/{channel_id}/publish")
async def publish_to_channel(channel_id: str, composition_id: str):
    """发布内容到指定渠道"""
    if channel_id not in channels_db:
        raise HTTPException(status_code=404, detail="渠道未找到")
    
    if composition_id not in compositions_db:
        raise HTTPException(status_code=404, detail="作品不存在")
    
    channel = channels_db[channel_id]
    composition = compositions_db[composition_id]
    
    if not channel.connected:
        raise HTTPException(status_code=400, detail="渠道未连接")
    
    # 这里可以根据不同渠道类型实现实际的发布逻辑
    # 目前返回模拟结果
    return {
        "success": True,
        "message": f"内容已成功发布到 {channel.name}",
        "publishId": f"pub-{datetime.now().timestamp()}",
        "publishedAt": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "bricks_count": len(bricks_db),
        "templates_count": len(templates_db),
        "compositions_count": len(compositions_db)
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)