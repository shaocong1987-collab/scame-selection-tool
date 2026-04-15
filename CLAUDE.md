# CLAUDE.md - SCAME 选型工具开发规范

## 概述
SCAME产品智能选型工具开发项目，为韶聪泽明智能科技有限责任公司（北京）的核心产品。基于SCAME工业插头插座知识图谱，开发企业微信/飞书/钉钉机器人集成的智能选型系统。

## 核心原则
1. **技术准确性优先**：选型必须严格遵循SCAME官方技术规范，严禁型号或技术参数幻觉
2. **用户体验丝滑**：选型流程必须简单直观，系统承担复杂性
3. **RAG增强可靠性**：所有选型依据必须参考官方手册和知识库
4. **编码规则驱动**：基于SCAME编码体系实现智能匹配和推荐

## 技术栈规范

### 前端技术栈
- **框架**: React 18+ with TypeScript
- **样式**: Tailwind CSS + Headless UI
- **状态管理**: Zustand (轻量级)
- **路由**: React Router v6
- **数据获取**: React Query + Axios
- **表单**: React Hook Form + Zod验证

### 后端技术栈
- **API框架**: Next.js API Routes (全栈) 或 Express.js (独立后端)
- **数据库**: PostgreSQL (关系数据) + Redis (缓存)
- **RAG系统**: LangChain + ChromaDB/Weaviate
- **搜索**: Elasticsearch (产品全文检索)

### 开发工具
- **包管理**: pnpm
- **构建工具**: Vite
- **代码质量**: ESLint + Prettier + TypeScript严格模式
- **测试**: Vitest + React Testing Library + Playwright (E2E)
- **部署**: Vercel (前端) + Railway/Render (后端)

## 项目结构

```
scame-selection-tool/
├── CLAUDE.md                  # 本项目规范
├── README.md                  # 项目说明文档
├── package.json
├── tsconfig.json
├── src/
│   ├── app/                   # Next.js App Router (如果使用Next.js)
│   ├── components/            # React组件
│   │   ├── ui/               # 基础UI组件 (Button, Card, Input等)
│   │   ├── selection/        # 选型专用组件
│   │   ├── product/          # 产品展示组件
│   │   └── layout/           # 布局组件
│   ├── lib/                  # 工具库和工具函数
│   │   ├── scame/           # SCAME专业逻辑
│   │   │   ├── coding.ts    # 编码规则解析
│   │   │   ├── matching.ts  # 产品匹配逻辑
│   │   │   ├── validation.ts # 技术参数验证
│   │   │   └── selection.ts # 选型核心算法
│   │   ├── rag/             # RAG系统集成
│   │   ├── api/             # API客户端
│   │   └── utils/           # 通用工具函数
│   ├── hooks/               # 自定义React Hooks
│   ├── types/               # TypeScript类型定义
│   ├── stores/              # Zustand状态存储
│   ├── pages/               # 页面组件 (如果使用Pages Router)
│   └── styles/              # 全局样式
├── docs/                     # 项目文档
│   ├── architecture.md      # 系统架构设计
│   ├── api/                # API文档
│   ├── scame-knowledge/    # SCAME知识库文档
│   └── deployment.md       # 部署指南
├── tests/                   # 测试文件
│   ├── unit/               # 单元测试
│   ├── integration/        # 集成测试
│   └── e2e/                # E2E测试
├── scripts/                # 构建和部署脚本
├── data/                   # 数据文件 (不提交到Git)
│   ├── products/          # 产品数据 (CSV/JSON)
│   ├── knowledge/         # RAG知识库源文件
│   └── cache/             # 缓存数据
└── public/                 # 静态资源
```

## SCAME专业规范

### 1. 编码规则体系 (必须严格遵守)
```typescript
// 首位数字大类映射
const PRODUCT_CATEGORIES = {
  '1': '民用面板及附件',
  '2': '输入端/工业插头/器具插座',
  '3': '移动输出端/连接器', 
  '4': '暗装输出端/面板插座',
  '5': '明装及高阶控制端',
  '6': '箱体与基座',
  '7': '线缆盘与照明',
  '8': '安装辅材类',
  '899': '大电流产品(特例)'
} as const;

// 防护等级编码
const PROTECTION_CODES = {
  '3': 'IP44/IP54',  // 第三位为3表示防溅
  '8': 'IP66/IP67'   // 第三位为8表示防水
} as const;

// 替换法则 (核心业务逻辑)
function getReplacementSeries(partNumber: string): string[] {
  // 213.3237 → [313, 413, 423, 513]
  const prefix = partNumber.split('.')[0];
  const firstDigit = prefix[0];
  
  switch (firstDigit) {
    case '2': return ['3', '4', '5'];  // 插头 → 连接器/暗装/明装
    case '3': return ['2', '4', '5'];  // 连接器 → 插头/暗装/明装
    case '4': return ['2', '3', '5'];  // 暗装 → 插头/连接器/明装
    case '5': return ['2', '3', '4'];  // 明装 → 插头/连接器/暗装
    default: return [];
  }
}
```

### 2. 电流分类规范
- **标准电流**: 16A, 20A, 30A, 32A, 60A, 63A, 100A, 125A
- **大电流**: 160A, 250A, 320A, 370A, 420A, 500A, 570A, 800A (899开头)
- **电压范围**: 必须使用完整范围，禁止简化">50"

### 3. 匹配验证规则
1. **电流匹配**: 插头电流 ≤ 插座电流
2. **极数一致**: 必须完全匹配 (2P+E ≠ 3P+E)
3. **系列兼容**: 同系列产品才能配套 (OPTIMA配OPTIMA)
4. **防护等级**: 插座等级 ≥ 环境要求
5. **电压兼容**: 产品电压 ≥ 系统电压，交流/直流不混用

## 开发流程规范

### 1. 需求分析阶段
- 必须先查阅 `/docs/scame-knowledge/` 中的官方手册
- 与SCAME专家(韶聪)确认技术细节
- 编写技术方案，包含选型流程图和数据验证规则

### 2. 数据准备阶段
- 从wiki知识图谱导入数据到 `data/products/`
- 建立RAG索引：PDF手册 → Markdown → 向量数据库
- 创建数据验证脚本，确保技术参数准确

### 3. 功能开发阶段
1. **编码解析功能**: 实现完整的订货号解码
2. **参数化选型**: 电流+电压+极数+防护等级 → 产品列表
3. **智能推荐**: 基于替换法则的配套产品推荐
4. **RAG增强**: 复杂查询时检索知识库提供依据

### 4. 测试验证阶段
- **单元测试**: 编码规则、匹配逻辑、验证函数
- **集成测试**: API接口、数据流、RAG检索
- **E2E测试**: 完整选型流程、边界案例
- **专家验证**: 韶聪亲自测试技术准确性

## RAG系统设计

### 知识源优先级
1. **官方PDF手册**: 最高优先级，绝对准确
2. **wiki知识图谱**: 结构化产品数据
3. **编码规则文档**: 业务逻辑核心
4. **技术培训资料**: 应用场景和选型指南

### 检索策略
```typescript
// 分层检索策略
async function retrieveScameKnowledge(query: string) {
  // 1. 首先检索结构化产品数据库
  const products = await searchProducts(query);
  if (products.length > 0) return products;
  
  // 2. 检索RAG向量知识库
  const ragResults = await searchRAG(query);
  
  // 3. 检索编码规则和匹配逻辑
  const rules = await searchCodingRules(query);
  
  return { products, ragResults, rules };
}
```

### 增强生成规则
- 所有技术参数必须引用来源
- 模糊查询必须提供"最可能匹配"和"需要确认"两种结果
- 替换建议必须明确标注依据的编码规则

## 错误处理规范

### 技术参数不明确
```typescript
function handleAmbiguousParameter(param: string, context: string) {
  // 1. 记录到日志系统
  logger.warn(`参数不明确: ${param}`, { context });
  
  // 2. 向用户请求确认
  return {
    type: 'NEEDS_CONFIRMATION',
    message: `请确认${context}的具体要求`,
    options: ['选项A', '选项B', '其他']
  };
}
```

### 型号不存在或过时
- 首先检查是否编码错误（常见错误模式）
- 然后检查产品是否已停产（参考最新手册）
- 最后提供最接近的替代产品（需标注差异）

## 部署和集成

### 多平台集成
1. **Web应用**: 独立选型门户
2. **企业微信机器人**: 对话式选型助手
3. **飞书/钉钉集成**: 企业办公平台嵌入
4. **API服务**: 第三方系统集成

### 数据同步机制
- 每日同步wiki知识图谱更新
- 定期检查SCAME官网产品更新
- 版本化的产品数据库，支持回滚

## 性能要求

### 响应时间
- 简单选型查询: < 500ms
- 复杂参数匹配: < 2s
- RAG增强检索: < 3s

### 并发能力
- 支持100+并发选型会话
- RAG系统支持批量检索
- 缓存热门产品和查询结果

## 安全规范

### 数据安全
- 产品价格和库存信息按权限控制
- 客户查询记录加密存储
- API访问需要身份验证

### 代码安全
- 依赖包定期安全扫描
- 禁止硬编码敏感信息
- 输入参数严格验证和转义

## 维护和更新

### 日常维护
- 监控选型准确率指标
- 收集用户反馈和常见问题
- 定期更新知识库和产品数据

### 版本更新
- 重大规则变更需要专家评审
- 向后兼容的API设计
- 详细的更新日志和迁移指南

---

## 最后更新
- **版本**: 1.0
- **更新日期**: 2026-04-14
- **制定人**: SCAME专家 + 全栈开发工程师
- **核心理念**: 技术准确性是生命线，用户体验是竞争力