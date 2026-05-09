# External Integrations

**Analysis Date:** 2026-04-16

## APIs & External Services

**RAG向量数据库:**
- ChromaDB - 向量知识库存储
  - 实现位置：`src/lib/rag/VectorStore.ts`
  - 当前状态：代码已实现，但未实际连接（动态导入）
  - 备选方案：Pinecone、Qdrant、内存存储

**HTTP客户端:**
- Axios 1.6.7 - HTTP请求库
  - 已安装但当前未使用
  - 计划用于后端API调用

**状态管理:**
- React Query 5.18.0 - 服务器状态管理
  - 配置位置：`src/App.tsx`
  - 默认配置：5分钟缓存时间，重试1次

## Data Storage

**本地存储:**
- 浏览器LocalStorage/SessionStorage
  - 用于用户偏好、临时数据
  - 实现位置：自定义hooks（计划中）

**向量数据库:**
- ChromaDB (计划集成)
  - 用于RAG系统文档向量存储
  - 支持本地部署或云服务

**关系数据库:**
- PostgreSQL (架构设计中)
  - 用于产品数据、用户数据、订单数据
  - 架构文档：`docs/architecture.md`

**缓存:**
- Redis (架构设计中)
  - 用于会话缓存、热门查询结果
  - 架构文档：`docs/architecture.md`

**全文搜索:**
- Elasticsearch (架构设计中)
  - 用于产品全文检索
  - 架构文档：`docs/architecture.md`

## Authentication & Identity

**当前状态:**
- 无身份验证系统
- 登录页面：`src/pages/LoginPage.tsx` (占位符)
- 计划集成：企业微信/飞书/钉钉OAuth

**计划集成:**
- 企业微信机器人身份验证
- 飞书开放平台OAuth
- 钉钉工作台集成
- JWT令牌管理

## Monitoring & Observability

**错误跟踪:**
- 当前无集成
- 控制台日志记录
- 计划集成：Sentry、LogRocket

**日志系统:**
- 控制台日志
- 计划：结构化日志收集
- 需要：开发/生产环境分离

## CI/CD & Deployment

**构建工具:**
- Vite 5.0.8 - 前端构建
- TypeScript编译器

**测试流水线:**
- Vitest - 单元测试
- Playwright - E2E测试
- 覆盖率报告：v8提供器

**部署目标:**
- 静态文件托管（Vercel、Netlify、GitHub Pages）
- 需要后端服务部署（计划中）
- 数据库服务部署（计划中）

**CI服务:**
- 当前无配置
- 需要：GitHub Actions、GitLab CI、Jenkins

## Environment Configuration

**当前环境变量:**
- 无 `.env` 文件
- 硬编码配置
- 需要迁移到环境变量

**所需环境变量:**
```
# 数据库连接
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# 向量数据库
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION=scame_docs

# 身份验证
WECHAT_WORK_CORP_ID=
WECHAT_WORK_AGENT_SECRET=
FEISHU_APP_ID=
FEISHU_APP_SECRET=
DINGTALK_APP_KEY=
DINGTALK_APP_SECRET=

# API端点
API_BASE_URL=http://localhost:3001
```

**密钥管理:**
- 当前：无密钥管理
- 需要：环境变量 + 密钥管理服务
- 禁止：硬编码密钥

## Webhooks & Callbacks

**传入Webhooks:**
- 当前无实现
- 计划：企业微信/飞书/钉钉消息回调
- 计划：订单状态更新回调

**传出Webhooks:**
- 当前无实现
- 计划：选型结果通知
- 计划：库存更新通知

## 企业平台集成

**企业微信:**
- 状态：计划中
- 集成类型：机器人、应用、小程序
- 文档：需要企业微信开放平台配置

**飞书:**
- 状态：计划中
- 集成类型：机器人、开放平台应用
- 文档：需要飞书开放平台配置

**钉钉:**
- 状态：计划中
- 集成类型：工作台应用、机器人
- 文档：需要钉钉开放平台配置

## 第三方服务依赖

**字体服务:**
- Google Fonts (计划中)
  - IBM Plex Sans
  - IBM Plex Mono
  - Inter Tight
- 配置位置：`tailwind.config.js`

**图标库:**
- Lucide React - 本地图标组件
- 无外部CDN依赖

**分析服务:**
- 当前无集成
- 计划：Google Analytics、Mixpanel
- 需要：用户行为跟踪、选型成功率统计

## 数据源集成

**SCAME官方数据:**
- wiki知识图谱 (计划导入)
- 官方PDF手册 (RAG系统)
- 培训资料PPT (RAG系统)
- 价格表Excel (计划导入)

**实时数据:**
- 库存API (计划集成)
- 价格API (计划集成)
- 订单状态API (计划集成)

---

*Integration audit: 2026-04-16*