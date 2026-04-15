# SCAME RAG 系统架构文档

## 概述

SCAME RAG（检索增强生成）系统为选型工具提供知识增强能力，确保所有选型建议都有官方技术依据。系统严格遵循"不幻觉"原则，所有技术参数必须引用SCAME官方文档。

## 系统架构

```
RAG 系统架构
├── 前端界面层 (React + TypeScript)
│   ├── 知识库检索页面 (KnowledgePage.tsx)
│   ├── 文档管理页面 (DocumentManagementPage.tsx)
│   ├── 文档上传组件 (DocumentUpload.tsx)
│   └── 选型解释组件 (SelectionExplanation.tsx)
├── 服务逻辑层 (TypeScript)
│   ├── RAG核心服务 (ScameRAGService.ts)
│   ├── 文档处理器 (DocumentProcessor.ts)
│   ├── 向量存储接口 (VectorStore.ts)
│   └── 统一API入口 (index.ts)
├── 数据存储层
│   ├── 向量数据库 (ChromaDB/内存存储)
│   ├── 结构化数据库 (PostgreSQL)
│   └── 文件存储 (本地/云存储)
└── 知识源层
    ├── SCAME官方PDF手册
    ├── wiki知识图谱
    ├── 技术培训资料
    └── 编码规则文档
```

## 核心组件说明

### 1. ScameRAGService - RAG核心服务

**位置**: `src/lib/rag/ScameRAGService.ts`

**功能**:
- 统一管理RAG查询流程
- 集成多种检索策略（结构化、向量、关键词）
- 生成技术依据充分的答案
- 计算置信度和验证技术参数

**关键方法**:
- `query(question, context)` - 执行RAG查询
- `retrieve()` - 检索相关文档
- `generateAnswer()` - 生成答案
- `validateTechnicalParameters()` - 验证技术参数

### 2. DocumentProcessor - 文档处理器

**位置**: `src/lib/rag/DocumentProcessor.ts`

**功能**:
- 支持多种文档格式（PDF、DOCX、PPTX、Markdown等）
- 自动提取文本和元数据
- 智能分块和内容清理
- 语言检测和文档分类

**处理流程**:
1. 检测文件类型
2. 提取文本内容
3. 分析文档结构
4. 分割为知识块
5. 提取元数据
6. 后处理优化

### 3. VectorStore - 向量存储接口

**位置**: `src/lib/rag/VectorStore.ts`

**功能**:
- 抽象向量存储接口，支持多种后端
- 内存存储实现（开发环境）
- ChromaDB集成（生产环境）
- 向量相似度搜索和过滤

**实现**:
- `MemoryVectorStore` - 内存实现，用于开发测试
- `ChromaVectorStore` - ChromaDB集成
- `IVectorStore` - 统一接口定义

### 4. DocumentUpload - 文档上传组件

**位置**: `src/components/rag/DocumentUpload.tsx`

**功能**:
- 拖放文件上传界面
- 文件格式和大小验证
- 上传进度显示
- 批量上传支持

**特性**:
- 支持最大50MB文件
- 支持PDF、DOCX、PPTX等格式
- 实时处理状态显示
- 错误处理和重试机制

### 5. SelectionExplanation - 选型解释组件

**位置**: `src/components/rag/SelectionExplanation.tsx`

**功能**:
- 为选型结果提供RAG增强解释
- 显示技术依据和引用来源
- 提供应用建议和注意事项
- 显示置信度和兼容性信息

**集成位置**:
- 正向选型页面 - 每个产品结果下方
- 反向选型页面 - 原始产品和替换产品

## 数据流程

### 文档处理流程

```
上传文档 → 文件验证 → 文本提取 → 元数据提取 → 内容分块 → 向量化 → 存储索引
```

### 查询处理流程

```
用户查询 → 查询解析 → 多策略检索 → 结果融合 → 答案生成 → 参数验证 → 返回结果
```

### 检索策略

系统采用三级检索策略，确保结果准确性：

1. **结构化数据检索** (优先级最高)
   - 产品数据库查询
   - 编码规则匹配
   - 技术参数验证

2. **向量相似度检索**
   - 文档块向量搜索
   - 语义相似度匹配
   - 阈值过滤（≥0.7）

3. **关键词全文检索**
   - 关键词匹配
   - 布尔搜索
   - 相关性排序

## 配置说明

### RAG配置 (`DEFAULT_RAG_CONFIG`)

```typescript
{
  retrieval: {
    preferStructured: true,      // 优先使用结构化数据
    vectorSimilarityThreshold: 0.7, // 向量相似度阈值
    maxResults: 10,             // 最大返回结果数
    hybridWeights: {            // 混合检索权重
      structured: 0.5,
      vector: 0.3,
      keyword: 0.2
    }
  },
  generation: {
    requireCitations: true,     // 要求引用来源
    validateTechnicalParams: true, // 验证技术参数
    provideAlternatives: true,  // 提供备选方案
    maxLength: 1000             // 最大答案长度
  }
}
```

### 文档处理配置

```typescript
{
  splitIntoChunks: true,        // 是否分块
  chunkSize: 1000,             // 块大小（字符）
  chunkOverlap: 200,           // 块重叠（字符）
  extractMetadata: true,       // 提取元数据
  detectLanguage: true         // 语言检测
}
```

## 集成指南

### 1. 在页面中集成RAG查询

```typescript
import { queryScameKnowledge } from '@/lib/rag';

const handleQuery = async () => {
  const result = await queryScameKnowledge('32A IP44插头选型', {
    partNumber: '213.3237',
    technicalParams: {
      current: '32A',
      poles: '3P+N+E',
      protection: 'IP44'
    }
  });
  
  // 使用result.answer, result.sources, result.confidence等
};
```

### 2. 使用选型解释组件

```typescript
import SelectionExplanation from '@/components/rag/SelectionExplanation';

<SelectionExplanation
  product={{
    partNumber: '213.3237',
    name: '32A 3P+N+E IP44工业插头',
    series: 'OPTIMA',
    current: '32A',
    poles: '3P+N+E',
    protection: 'IP44',
    voltage: '200-250V'
  }}
  applicationContext="工业车间使用"
  autoLoad={true}
/>
```

### 3. 文档上传集成

```typescript
import DocumentUpload from '@/components/rag/DocumentUpload';

<DocumentUpload
  onUploadComplete={(documents) => {
    console.log('上传完成:', documents);
  }}
  maxFileSize={50}
  allowedFileTypes={['.pdf', '.docx', '.pptx']}
/>
```

## 部署配置

### 开发环境

```bash
# 使用内存向量存储（默认）
npm run dev
```

### 生产环境

```bash
# 配置ChromaDB
export CHROMA_SERVER_URL=http://localhost:8000
export CHROMA_COLLECTION_NAME=scame_knowledge

# 启动服务
npm run build
npm start
```

### Docker部署

```dockerfile
# Dockerfile示例
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 监控和维护

### 性能指标

1. **检索性能**
   - 平均响应时间：< 3秒
   - 检索准确率：> 85%
   - 向量搜索命中率

2. **质量指标**
   - 答案置信度分布
   - 引用来源覆盖率
   - 参数验证通过率

3. **系统健康**
   - 文档处理成功率
   - 向量存储状态
   - 内存使用情况

### 维护任务

1. **定期更新**
   - 每周同步wiki知识图谱
   - 每月检查官方文档更新
   - 季度性模型优化

2. **质量检查**
   - 随机抽样验证答案准确性
   - 用户反馈收集和分析
   - 技术参数验证测试

3. **故障处理**
   - 文档处理失败重试机制
   - 向量存储备份和恢复
   - 服务降级策略

## 扩展指南

### 添加新的知识源

1. 在`DocumentProcessor`中添加新的文档类型支持
2. 更新`inferSource`和`inferDocumentType`方法
3. 添加相应的文件提取逻辑

### 集成新的向量数据库

1. 实现`IVectorStore`接口
2. 在`VectorStoreFactory`中注册新实现
3. 更新配置管理

### 定制检索策略

1. 修改`ScameRAGService.retrieve`方法
2. 调整混合检索权重
3. 添加新的检索算法

## 故障排除

### 常见问题

1. **文档上传失败**
   - 检查文件格式和大小限制
   - 验证网络连接
   - 检查服务器存储空间

2. **检索结果不准确**
   - 调整向量相似度阈值
   - 检查文档分块策略
   - 验证索引完整性

3. **答案生成质量低**
   - 检查检索结果相关性
   - 优化提示词模板
   - 增加训练数据质量

### 调试工具

```typescript
// 启用调试日志
import { getRAGService } from '@/lib/rag';

const service = getRAGService();
// 服务内部有详细的日志输出

// 获取统计信息
const stats = await service.getStats();
console.log('知识库统计:', stats);
```

## 版本历史

### v1.0.0 (2026-04-14)
- 初始版本发布
- 完整的RAG系统架构
- 支持文档上传和处理
- 集成到选型页面
- 内存向量存储实现

### 下一步计划
- ChromaDB生产环境集成
- 实时知识库同步
- 多语言支持
- 高级检索算法优化

---

**最后更新**: 2026-04-14  
**维护团队**: SCAME技术研发部  
**文档状态**: 正式发布