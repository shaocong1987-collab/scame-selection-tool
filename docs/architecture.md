# SCAME选型工具系统架构设计

## 架构概述

SCAME选型工具采用**微前端 + 微服务**架构，确保系统的高可用性、可扩展性和技术准确性。系统严格遵循SCAME编码规则和技术规范，所有选型逻辑基于官方手册和知识库。

## 🏗️ 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    客户端层 (Client Layer)                    │
├─────────────────────────────────────────────────────────────┤
│  Web应用  │ 企微机器人 │ 飞书集成 │ 钉钉集成 │ 移动端H5          │
└───────────┴───────────┴───────────┴───────────┴──────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    API网关层 (API Gateway)                   │
├─────────────────────────────────────────────────────────────┤
│  负载均衡  │ 路由分发  │ 身份验证  │ 速率限制  │ API版本管理     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    业务服务层 (Business Services)             │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│ 选型服务  │ 产品服务  │ RAG服务   │ 用户服务  │ 订单服务      │
│Selection │ Product  │ RAG       │ User      │ Order       │
└───────────┴───────────┴───────────┴───────────┴─────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    数据服务层 (Data Services)                │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│ PostgreSQL │ Redis    │ ChromaDB  │ Elastic- │ 对象存储     │
│ 产品数据   │ 缓存      │ 向量知识库 │ search   │ 文件存储     │
│           │          │           │ 全文检索  │             │
└───────────┴───────────┴───────────┴───────────┴─────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    数据源层 (Data Sources)                   │
├───────────┬───────────┬───────────┬───────────┬─────────────┤
│ wiki知识   │ SCAME官方 │ 培训资料  │ 价格表    │ 实时库存     │
│ 图谱      │ 手册PDF   │ PPT       │ Excel    │ API         │
└───────────┴───────────┴───────────┴───────────┴─────────────┘
```

## 🔧 核心服务设计

### 1. 选型服务 (Selection Service)

#### 功能职责
- 参数化选型：技术参数 → 产品匹配
- 编码解析：订货号 → 完整技术信息
- 配套推荐：基于替换法则的完整套装
- 验证校验：技术规范符合性检查

#### 技术实现
```typescript
// 服务接口定义
interface SelectionService {
  // 基础选型
  selectByParameters(params: SelectionParams): Promise<Product[]>;
  selectByPartNumber(partNumber: string): Promise<ProductDetails>;
  
  // 智能推荐
  recommendMatchingSet(baseProduct: string): Promise<MatchingSet>;
  recommendAlternatives(product: string, reason: string): Promise<Alternative[]>;
  
  // 验证校验
  validateSelection(selection: ProductSelection): Promise<ValidationResult>;
  checkCompatibility(productA: string, productB: string): Promise<CompatibilityResult>;
  
  // 编码处理
  decodePartNumber(partNumber: string): Promise<DecodedPartNumber>;
  generatePartNumber(params: TechnicalParams): Promise<string[]>;
}
```

#### 算法设计
- **优先匹配算法**: 电流 → 电压 → 极数 → 防护等级
- **相似度算法**: 基于技术参数的余弦相似度
- **替换法则算法**: 首位数字替换 + 参数调整
- **兼容性算法**: IEC 60309标准验证

### 2. 产品服务 (Product Service)

#### 数据模型设计
```typescript
// 核心产品模型
interface ScameProduct {
  // 基础信息
  partNumber: string;           // 订货号 513.63532T
  name: string;                // 产品名称
  series: ProductSeries;       // 产品系列 OPTIMA-TOP
  
  // 技术参数
  technicalSpecs: {
    current: string;           // 电流 63A
    voltage: VoltageRange;     // 电压范围 >50-250V
    poles: PolesConfig;        // 极数配置 2P+E
    protection: IPRating;      // 防护等级 IP44/IP54
    frequency?: string;        // 频率 50/60/DC
    temperature?: string;      // 工作温度
    certifications: string[];  // 认证标准
  };
  
  // 物理特性
  physicalSpecs: {
    dimensions: string;        // 安装尺寸
    weight?: string;           // 重量
    material: string;          // 材料
    color?: string;            // 颜色
  };
  
  // 业务信息
  businessInfo: {
    price: number;             // 价格 (元)
    moq: number;               // 最小起订量
    stock: number;             // 库存数量
    leadTime: string;          // 交货周期
  };
  
  // 关系信息
  relationships: {
    matchingPlug?: string;     // 匹配插头
    matchingSocket?: string;   // 匹配插座  
    matchingConnector?: string; // 匹配连接器
    alternativeProducts: string[]; // 替代产品
    compatibleSeries: string[];    // 兼容系列
  };
  
  // 元数据
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    dataSource: string;        // 数据来源
    version: string;           // 数据版本
  };
}
```

#### 数据同步机制
```
数据源变更 → 变更检测 → 数据提取 → 数据清洗 → 数据验证 → 数据入库
    ↓           ↓           ↓          ↓          ↓          ↓
 wiki更新   文件监控   解析CSV/  标准化处理  规则校验  批量更新
            定时任务   PDF/Excel            专家复核  版本控制
```

### 3. RAG服务 (RAG Service)

#### 知识库架构
```
原始文档 → 文档解析 → 文本分块 → 向量化 → 向量存储 → 索引构建
   ↓          ↓          ↓         ↓         ↓          ↓
PDF/PPT   提取文本   语义分块  嵌入模型   ChromaDB  倒排索引
Markdown  结构解析  重叠窗口  text-embedding         BM25检索
```

#### 检索策略
```typescript
// 分层检索策略
class ScameRAGService {
  async retrieve(query: string, context?: SelectionContext) {
    // 1. 结构化数据优先检索
    const structuredResults = await this.searchStructuredData(query);
    if (structuredResults.confidence > 0.9) {
      return structuredResults;
    }
    
    // 2. 向量相似度检索
    const vectorResults = await this.searchVectorDB(query);
    
    // 3. 关键词全文检索
    const keywordResults = await this.searchFullText(query);
    
    // 4. 混合排序和去重
    return this.mergeAndRankResults([
      structuredResults,
      vectorResults,
      keywordResults
    ]);
  }
  
  // 增强生成
  async generateAnswer(query: string, context: any) {
    const retrievedDocs = await this.retrieve(query, context);
    
    return {
      answer: await this.llm.generate({
        prompt: this.buildPrompt(query, retrievedDocs, context),
        systemPrompt: this.getSystemPrompt(context)
      }),
      sources: retrievedDocs.map(doc => ({
        content: doc.content,
        source: doc.metadata.source,
        page: doc.metadata.page,
        confidence: doc.score
      })),
      confidence: this.calculateConfidence(retrievedDocs)
    };
  }
}
```

### 4. 编码规则引擎 (Coding Rule Engine)

#### 规则定义
```yaml
# rules/coding-rules.yaml
rules:
  - id: "category-by-first-digit"
    pattern: "^(\\d)"
    mapping:
      "1": "民用面板及附件"
      "2": "输入端/工业插头/器具插座"
      "3": "移动输出端/连接器"
      "4": "暗装输出端/面板插座"
      "5": "明装及高阶控制端"
      "6": "箱体与基座"
      "7": "线缆盘与照明"
      "8": "安装辅材类"
      "899": "大电流产品"
    
  - id: "protection-by-third-digit"
    pattern: "^\\d(\\d)\\d"
    mapping:
      "3": "IP44/IP54"
      "8": "IP66/IP67/IP69"
      
  - id: "current-by-dot-suffix"
    pattern: "\\.(\\d+)"
    mapping:
      "16": "16A"
      "32": "32A"
      "63": "63A"
      "125": "125A"
      
  - id: "replacement-rule"
    pattern: "^(\\d)\\d\\d"
    replacement:
      "2": ["3", "4", "5"]  # 插头 → 连接器/暗装/明装
      "3": ["2", "4", "5"]  # 连接器 → 插头/暗装/明装
      "4": ["2", "3", "5"]  # 暗装 → 插头/连接器/明装
      "5": ["2", "3", "4"]  # 明装 → 插头/连接器/暗装
```

#### 引擎实现
```typescript
class CodingRuleEngine {
  private rules: CodingRule[];
  
  decode(partNumber: string): DecodedResult {
    const result: DecodedResult = {
      partNumber,
      category: null,
      series: null,
      current: null,
      protection: null,
      replacements: []
    };
    
    // 应用所有规则
    for (const rule of this.rules) {
      const match = partNumber.match(new RegExp(rule.pattern));
      if (match) {
        this.applyRule(rule, match, result);
      }
    }
    
    // 推导系列信息
    if (result.category && result.current && result.protection) {
      result.series = this.inferSeries(result);
    }
    
    return result;
  }
  
  getReplacements(partNumber: string): Replacement[] {
    const decoded = this.decode(partNumber);
    const replacements: Replacement[] = [];
    
    // 应用替换法则
    const replacementRule = this.rules.find(r => r.id === 'replacement-rule');
    if (replacementRule && decoded.category) {
      const sourcePrefix = partNumber.split('.')[0];
      const targetPrefixes = replacementRule.replacement[sourcePrefix[0]];
      
      for (const targetPrefix of targetPrefixes) {
        const targetPartNumber = this.generateReplacement(
          partNumber, 
          sourcePrefix, 
          targetPrefix
        );
        
        if (targetPartNumber) {
          replacements.push({
            original: partNumber,
            replacement: targetPartNumber,
            relationship: this.getRelationship(sourcePrefix[0], targetPrefix[0]),
            confidence: this.calculateReplacementConfidence(partNumber, targetPartNumber)
          });
        }
      }
    }
    
    return replacements;
  }
}
```

## 🗄️ 数据存储设计

### 1. PostgreSQL 数据库设计

#### 核心表结构
```sql
-- 产品主表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  series VARCHAR(50) NOT NULL,
  
  -- 技术参数
  current VARCHAR(20) NOT NULL,
  voltage_range VARCHAR(100) NOT NULL,
  poles VARCHAR(20) NOT NULL,
  protection VARCHAR(50) NOT NULL,
  frequency VARCHAR(20),
  temperature_range VARCHAR(50),
  
  -- 物理特性
  dimensions VARCHAR(100),
  weight_grams INTEGER,
  material VARCHAR(50),
  color VARCHAR(30),
  
  -- 业务信息
  price_cny DECIMAL(10,2),
  moq INTEGER DEFAULT 1,
  stock_count INTEGER DEFAULT 0,
  lead_time_days INTEGER,
  
  -- 关系字段
  matching_plug VARCHAR(50) REFERENCES products(part_number),
  matching_socket VARCHAR(50) REFERENCES products(part_number),
  matching_connector VARCHAR(50) REFERENCES products(part_number),
  
  -- 元数据
  data_source VARCHAR(100) NOT NULL,
  data_version VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- 创建索引
CREATE INDEX idx_products_current ON products(current);
CREATE INDEX idx_products_voltage ON products(voltage_range);
CREATE INDEX idx_products_protection ON products(protection);
CREATE INDEX idx_products_series ON products(series);

-- 编码规则表
CREATE TABLE coding_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id VARCHAR(50) UNIQUE NOT NULL,
  pattern TEXT NOT NULL,
  mapping JSONB NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 选型历史表
CREATE TABLE selection_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100),
  query_type VARCHAR(50) NOT NULL, -- 'forward', 'reverse', 'fuzzy'
  query_params JSONB NOT NULL,
  results JSONB,
  selected_products JSONB,
  confidence_score DECIMAL(3,2),
  feedback JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 知识文档表
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'manual', 'training', 'rule', 'case'
  source_path VARCHAR(500) NOT NULL,
  extracted_text TEXT,
  metadata JSONB,
  vector_id VARCHAR(100), -- ChromaDB中的向量ID
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Redis 缓存设计

#### 缓存策略
```yaml
# cache策略配置
cache_config:
  product_by_part_number:
    ttl: 3600  # 1小时
    max_size: 10000
    
  selection_results:
    ttl: 1800  # 30分钟
    max_size: 5000
    
  coding_rules:
    ttl: 86400 # 24小时
    max_size: 100
    
  rag_embeddings:
    ttl: 7200  # 2小时
    max_size: 10000
```

#### 缓存键设计
```typescript
// 缓存键生成策略
const CacheKeys = {
  // 产品相关
  product: (partNumber: string) => `product:${partNumber}`,
  productsBySeries: (series: string) => `products:series:${series}`,
  productsByParams: (params: SelectionParams) => 
    `products:params:${hashParams(params)}`,
  
  // 选型相关
  selectionResult: (sessionId: string, queryHash: string) =>
    `selection:${sessionId}:${queryHash}`,
  
  // 编码规则
  codingRules: () => 'coding:rules',
  decodedPartNumber: (partNumber: string) => `coding:decoded:${partNumber}`,
  
  // RAG相关
  ragEmbedding: (text: string) => `rag:embedding:${hashText(text)}`,
  ragResults: (query: string) => `rag:results:${hashText(query)}`
};
```

### 3. ChromaDB 向量存储设计

#### 集合设计
```python
# 向量集合配置
collections = {
  "scame_manuals": {
    "metadata": {
      "source": "official_manuals",
      "language": ["zh", "en"],
      "document_type": "technical"
    },
    "embedding_model": "text-embedding-3-small",
    "chunk_size": 1000,
    "chunk_overlap": 200
  },
  
  "scame_training": {
    "metadata": {
      "source": "training_materials", 
      "language": "zh",
      "document_type": "training"
    },
    "embedding_model": "text-embedding-3-small",
    "chunk_size": 500,
    "chunk_overlap": 100
  },
  
  "scame_cases": {
    "metadata": {
      "source": "case_studies",
      "language": "zh",
      "document_type": "application"
    },
    "embedding_model": "text-embedding-3-small",
    "chunk_size": 800,
    "chunk_overlap": 150
  }
}
```

## 🔌 API 设计

### RESTful API 设计原则

#### 版本控制
```
/api/v1/selection
/api/v1/products
/api/v1/rag
```

#### 认证授权
- JWT Token 认证
- 角色基础访问控制 (RBAC)
- API Key 用于第三方集成

#### 响应格式
```json
{
  "success": true,
  "data": { /* 响应数据 */ },
  "metadata": {
    "timestamp": "2026-04-14T12:00:00Z",
    "request_id": "req_123456",
    "version": "v1.0"
  },
  "error": null
}
```

### 核心API端点

#### 选型API
```
POST   /api/v1/selection/by-parameters    # 参数化选型
GET    /api/v1/selection/by-part/:partNumber  # 型号查询
POST   /api/v1/selection/recommend       # 智能推荐
POST   /api/v1/selection/validate        # 选型验证
```

#### 产品API
```
GET    /api/v1/products/:partNumber      # 产品详情
GET    /api/v1/products                  # 产品列表（筛选）
GET    /api/v1/products/series/:series   # 系列产品
GET    /api/v1/products/search           # 产品搜索
```

#### 编码API
```
GET    /api/v1/coding/decode/:partNumber # 编码解析
GET    /api/v1/coding/replacements/:partNumber # 替换建议
POST   /api/v1/coding/generate           # 型号生成
```

#### RAG API
```
POST   /api/v1/rag/query                 # 知识检索
POST   /api/v1/rag/answer                # 问答生成
GET    /api/v1/rag/sources               # 知识源管理
```

## 📡 消息队列设计

### 异步任务处理
```typescript
// 消息队列配置
interface QueueConfig {
  selection: {
    queue: 'selection_tasks',
    concurrency: 5,
    retry: { attempts: 3, delay: 5000 }
  },
  
  data_sync: {
    queue: 'data_sync_tasks', 
    concurrency: 2,
    retry: { attempts: 5, delay: 30000 }
  },
  
  rag_indexing: {
    queue: 'rag_indexing_tasks',
    concurrency: 1,
    retry: { attempts: 3, delay: 10000 }
  }
}

// 任务类型
enum TaskType {
  IMPORT_PRODUCTS = 'import_products',
  UPDATE_PRICES = 'update_prices',
  INDEX_DOCUMENT = 'index_document',
  VALIDATE_SELECTION = 'validate_selection',
  GENERATE_REPORT = 'generate_report'
}
```

### 事件驱动架构
```typescript
// 事件定义
interface SystemEvent {
  type: string;
  payload: any;
  timestamp: Date;
  source: string;
}

// 核心事件
const Events = {
  PRODUCT_UPDATED: 'product.updated',
  SELECTION_COMPLETED: 'selection.completed',
  RAG_QUERY_EXECUTED: 'rag.query.executed',
  DATA_SYNC_STARTED: 'data.sync.started',
  ERROR_OCCURRED: 'error.occurred'
};

// 事件处理器
class EventHandler {
  async handle(event: SystemEvent) {
    switch (event.type) {
      case Events.PRODUCT_UPDATED:
        await this.updateCaches(event.payload);
        await this.notifySubscribers(event.payload);
        break;
        
      case Events.SELECTION_COMPLETED:
        await this.logSelectionHistory(event.payload);
        await this.analyzeSelectionPattern(event.payload);
        break;
        
      case Events.ERROR_OCCURRED:
        await this.sendAlert(event.payload);
        await this.logError(event.payload);
        break;
    }
  }
}
```

## 🔒 安全设计

### 1. 认证授权
- JWT Token + Refresh Token
- OAuth 2.0 用于第三方集成
- 多因子认证 (MFA) 支持

### 2. 数据安全
- 数据传输 TLS 1.3 加密
- 敏感数据字段级加密
- 数据库连接 SSL 加密

### 3. 访问控制
- 基于角色的访问控制 (RBAC)
- API 速率限制和配额管理
- IP 白名单和黑名单

### 4. 审计日志
- 所有操作详细日志记录
- 日志集中管理和分析
- 异常行为检测和告警

## 🚀 部署架构

### 容器化部署
```yaml
# docker-compose.prod.yaml
version: '3.8'

services:
  # 前端应用
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=https://api.scame-selector.com
    depends_on:
      - api-gateway
      
  # API网关
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    environment:
      - SERVICES_CONFIG=/etc/services.yaml
    depends_on:
      - selection-service
      - product-service
      - rag-service
      
  # 业务服务
  selection-service:
    build: ./services/selection
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/scame
      - REDIS_URL=redis://redis:6379
      
  product-service:
    build: ./services/product
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/scame
      
  rag-service:
    build: ./services/rag
    environment:
      - CHROMADB_URL=http://chromadb:8000
      
  # 数据服务
  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=scame
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    
  chromadb:
    image: chromadb/chroma:latest
    volumes:
      - chroma_data:/chroma/chroma
    
  # 监控和日志
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  chroma_data:
  grafana_data:
```

### 监控告警
- **应用监控**: Prometheus + Grafana
- **日志聚合**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **性能追踪**: Jaeger 分布式追踪
- **健康检查**: 服务健康端点 + 心跳检测
- **告警系统**: AlertManager + 企业微信/钉钉通知

## 📈 扩展性设计

### 水平扩展
- 无状态服务，支持多实例部署
- 数据库读写分离
- Redis集群支持
- 负载均衡器自动扩展

### 垂直扩展
- 按服务粒度独立扩展
- 热点数据缓存优化
- 数据库索引优化
- 异步任务队列解耦

### 多租户支持
- 数据隔离设计
- 配置化管理
- 资源配额控制
- 自定义规则支持

---

## 架构演进路线

### Phase 1: MVP (1-2个月)
- 基础选型功能
- 产品数据库导入
- 简单Web界面
- 单机部署

### Phase 2: 增强版 (3-4个月)
- RAG知识库集成
- 多平台机器人集成
- 编码规则引擎
- 微服务架构

### Phase 3: 企业版 (5-6个月)
- 高级分析和报告
- 实时库存和价格集成
- 多租户支持
- 高可用集群部署

### Phase 4: 智能版 (7-12个月)
- 机器学习优化推荐
- 预测性选型
- 智能客服集成
- 生态系统集成

---

**架构版本**: 1.0  
**设计日期**: 2026-04-14  
**设计团队**: 韶聪泽明技术架构组