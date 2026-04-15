# SCAME 智能选型工具

## 项目概述

SCAME智能选型工具是北京韶聪泽明智能科技有限责任公司的核心产品，为企业提供精准、高效的SCAME工业插头插座选型解决方案。基于深度学习的SCAME产品知识图谱和RAG（检索增强生成）技术，实现技术参数驱动的智能选型。

## 🎯 核心功能

### 1. 智能选型
- **正向选型**: 型号 → 技术参数 + 价格 + 库存
- **反向选型**: 技术参数 → 匹配产品列表
- **模糊查询**: 自然语言 → 智能推荐
- **配套推荐**: 自动推荐插头+插座+连接器完整套装

### 2. 技术验证
- 严格遵循SCAME官方技术规范
- 基于编码规则的智能匹配
- IEC 60309标准兼容性验证
- 防护等级(IP Rating)和应用场景匹配

### 3. 多平台集成
- Web应用（独立门户）
- 企业微信/飞书/钉钉机器人
- API服务（第三方系统集成）
- 移动端适配

## 📊 数据基础

### 知识图谱
- **产品实体**: 4,585个SCAME产品
- **技术参数**: 电流(16-800A)、电压(24-1000V)、防护等级(IP44-IP69)
- **匹配关系**: 插头-插座-连接器配套系统
- **应用场景**: 数据中心、港口码头、轨道交通、工业制造

### RAG知识库
- SCAME官方产品手册（中英文PDF）
- 技术培训资料（PPT）
- 编码规则文档
- 应用案例和选型指南

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+
- PostgreSQL 14+ (可选，开发阶段可用SQLite)
- Redis (可选，用于缓存)

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd scame-selection-tool

# 安装依赖
pnpm install

# 环境配置
cp .env.example .env
# 编辑.env文件配置数据库和API密钥

# 初始化数据库
pnpm db:setup

# 导入产品数据
pnpm data:import

# 启动开发服务器
pnpm dev
```

### 开发命令

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行测试
pnpm test           # 单元测试
pnpm test:e2e      # E2E测试
pnpm test:coverage # 测试覆盖率

# 代码质量
pnpm lint          # ESLint检查
pnpm format        # Prettier格式化
pnpm type-check    # TypeScript类型检查

# 数据管理
pnpm data:import   # 导入产品数据
pnpm data:sync    # 同步知识库更新
pnpm data:validate # 验证数据准确性
```

## 🏗️ 系统架构

### 前端架构
```
React 18 (TypeScript)
├── App Router (Next.js)
├── Tailwind CSS + Headless UI
├── Zustand状态管理
├── React Query数据获取
└── React Hook Form表单
```

### 后端架构
```
Next.js API Routes / Express.js
├── PostgreSQL + Prisma ORM
├── Redis缓存层
├── RAG系统 (LangChain + ChromaDB)
├── Elasticsearch产品搜索
└── JWT身份验证
```

### 数据流架构
```
用户输入 → 参数解析 → 数据库查询 → RAG增强 → 结果生成
        ↓        ↓           ↓          ↓          ↓
     自然语言  技术参数   产品匹配   知识检索   智能推荐
```

## 📚 开发指南

### 1. 编码规则开发
所有选型逻辑必须基于SCAME编码体系：

```typescript
// 示例：解析订货号 513.63532T
import { decodePartNumber } from '@/lib/scame/coding';

const result = decodePartNumber('513.63532T');
// 返回：{
//   category: '明装及高阶控制端',
//   series: 'OPTIMA-TOP',
//   current: '63A',
//   poles: '2P+E',
//   protection: 'IP44/IP54',
//   voltage: '>50-250V'
// }
```

### 2. 匹配逻辑开发
产品匹配必须遵循技术规范：

```typescript
import { validateMatch } from '@/lib/scame/matching';

const validation = validateMatch({
  socket: '513.63532T',
  plug: '213.6332',
  connector: '313.6332'
});

if (validation.valid) {
  console.log('匹配成功');
} else {
  console.log(`匹配失败: ${validation.reason}`);
}
```

### 3. RAG集成开发
复杂查询使用RAG增强：

```typescript
import { retrieveScameKnowledge } from '@/lib/rag';

const results = await retrieveScameKnowledge(
  '港口码头用的防水插座，要能防盐雾腐蚀'
);

// 返回：产品列表 + 技术依据 + 应用建议
```

## 🔧 配置说明

### 环境变量
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/scame"
REDIS_URL="redis://localhost:6379"

# 第三方服务
SCAME_API_KEY="your_scame_api_key"
RAG_VECTOR_DB_URL="chromadb://localhost:8000"

# 应用配置
NODE_ENV="development"
PORT=3000
JWT_SECRET="your_jwt_secret"

# 缓存配置
CACHE_TTL=3600  # 1小时
MAX_CACHE_SIZE=1000
```

### 数据源配置
```yaml
# data/sources.yaml
sources:
  - type: 'csv'
    path: 'data/products/*.csv'
    format: 'scame-standard'
    
  - type: 'wiki'
    path: '/Users/sunshaocong/wiki'
    format: 'obsidian-md'
    
  - type: 'pdf'
    path: 'docs/manuals/*.pdf'
    format: 'scame-official'
    
  - type: 'rag'
    path: 'data/knowledge/'
    vector_db: 'chroma'
```

## 📈 性能指标

### 响应时间目标
- 首页加载: < 1s
- 简单查询: < 500ms
- 复杂选型: < 2s
- RAG检索: < 3s

### 准确性目标
- 技术参数准确率: 99.9%
- 匹配推荐准确率: 95%+
- RAG检索相关性: 90%+

### 可用性目标
- 系统可用性: 99.5%
- 并发用户: 100+
- 数据更新延迟: < 5分钟

## 🤝 贡献指南

### 开发流程
1. **需求确认**: 与SCAME专家确认技术细节
2. **技术方案**: 编写详细的设计文档
3. **代码实现**: 遵循项目编码规范
4. **测试验证**: 单元测试 + 集成测试 + 专家验证
5. **代码审查**: 至少一名核心开发者Review
6. **部署上线**: 灰度发布 + 监控指标

### 代码规范
- TypeScript严格模式
- ESLint + Prettier自动格式化
- 组件化设计，单一职责原则
- 详细的代码注释（英文）
- 完整的类型定义

### 提交规范
```
type(scope): description

feat(selection): 添加反向选型功能
fix(matching): 修复极数匹配逻辑
docs(api): 更新API文档
test(coding): 添加编码规则测试
```

## 🚨 注意事项

### 技术准确性
1. **严禁幻觉**: 绝不猜测或编造技术参数
2. **严格验证**: 所有选型结果必须经过规则验证
3. **明确来源**: 技术建议必须引用官方文档
4. **专家确认**: 不确定的技术细节必须向SCAME专家确认

### 数据安全
1. **权限控制**: 价格和库存信息按角色控制
2. **输入验证**: 所有用户输入必须严格验证
3. **日志审计**: 所有选型操作记录日志
4. **数据备份**: 定期备份产品数据库和知识库

## 📞 支持与联系

### 技术问题
- GitHub Issues: [项目Issues页面]
- 内部讨论: 企业微信群「SCAME选型开发组」
- 紧急问题: 直接联系项目负责人

### 业务咨询
- SCAME技术问题: 韶聪（SCAME专家）
- 产品需求: 产品经理
- 部署运维: 运维团队

## 📄 许可证

本项目为北京韶聪泽明智能科技有限责任公司内部项目，版权所有。

---

**最后更新**: 2026-04-14  
**版本**: 1.0.0  
**维护团队**: 韶聪泽明技术部