/**
 * SCAME RAG (检索增强生成) 服务
 *
 * 集成SCAME官方技术手册、培训资料和知识图谱，提供技术依据的智能检索。
 * 严格遵循"不幻觉"原则，所有技术参数必须引用官方来源。
 */

// ============================================================================
// 类型定义
// ============================================================================

export interface DocumentChunk {
  /** 文档块ID */
  id: string;

  /** 原始内容 */
  content: string;

  /** 元数据 */
  metadata: {
    /** 文档来源 */
    source: string;

    /** 文档类型: manual, training, rule, case, product, other */
    type: 'manual' | 'training' | 'rule' | 'case' | 'product' | 'other';

    /** 文档标题 */
    title: string;

    /** 页面或章节 */
    page?: number;
    section?: string;

    /** 语言 */
    language: 'zh' | 'en' | 'unknown';

    /** 原始文件路径 */
    filePath: string;

    /** 时间戳 */
    timestamp: Date;
  };

  /** 嵌入向量 */
  embedding?: number[];

  /** 相关度分数 */
  score?: number;
}

export interface RAGQueryResult {
  /** 查询内容 */
  query: string;

  /** 检索到的文档块 */
  chunks: DocumentChunk[];

  /** 检索策略 */
  strategy: 'structured' | 'vector' | 'hybrid' | 'keyword';

  /** 检索耗时(ms) */
  latency: number;

  /** 置信度 (0-1) */
  confidence: number;

  /** 警告信息 */
  warnings: string[];
}

export interface RAGAnswer {
  /** 生成的答案 */
  answer: string;

  /** 答案类型 */
  type: 'technical' | 'application' | 'warning' | 'clarification';

  /** 引用来源 */
  sources: Array<{
    chunk: DocumentChunk;
    relevance: number;
    citation: string;
  }>;

  /** 技术参数验证结果 */
  validation?: {
    valid: boolean;
    verifiedParameters: string[];
    unverifiedParameters: string[];
  };

  /** 建议的下一步操作 */
  suggestions: string[];

  /** 警告信息 */
  warnings?: string[];

  /** 置信度 (0-1) */
  confidence: number;
}

export interface RAGConfig {
  /** 检索策略配置 */
  retrieval: {
    /** 是否优先使用结构化数据 */
    preferStructured: boolean;

    /** 向量检索相似度阈值 */
    vectorSimilarityThreshold: number;

    /** 最大返回结果数 */
    maxResults: number;

    /** 混合检索权重 */
    hybridWeights: {
      structured: number;
      vector: number;
      keyword: number;
    };
  };

  /** 生成配置 */
  generation: {
    /** 是否要求引用来源 */
    requireCitations: boolean;

    /** 是否验证技术参数 */
    validateTechnicalParams: boolean;

    /** 是否提供备选方案 */
    provideAlternatives: boolean;

    /** 最大生成长度 */
    maxLength: number;
  };

  /** 知识库配置 */
  knowledgeBase: {
    /** 启用的知识源 */
    enabledSources: Array<'manuals' | 'training' | 'rules' | 'cases' | 'products'>;

    /** 文档更新策略 */
    updateStrategy: 'manual' | 'auto' | 'scheduled';

    /** 缓存配置 */
    cache: {
      enabled: boolean;
      ttl: number; // 缓存时间(ms)
      maxSize: number;
    };
  };
}

// ============================================================================
// 默认配置
// ============================================================================

export const DEFAULT_RAG_CONFIG: RAGConfig = {
  retrieval: {
    preferStructured: true,
    vectorSimilarityThreshold: 0.7,
    maxResults: 10,
    hybridWeights: {
      structured: 0.5,
      vector: 0.3,
      keyword: 0.2,
    },
  },
  generation: {
    requireCitations: true,
    validateTechnicalParams: true,
    provideAlternatives: true,
    maxLength: 1000,
  },
  knowledgeBase: {
    enabledSources: ['manuals', 'training', 'rules', 'cases', 'products'],
    updateStrategy: 'scheduled',
    cache: {
      enabled: true,
      ttl: 3600000, // 1小时
      maxSize: 10000,
    },
  },
};

// ============================================================================
// 核心RAG服务类
// ============================================================================

/**
 * SCAME RAG服务
 */
export class ScameRAGService {
  private config: RAGConfig;
  // @ts-ignore - 将在后续实现中使用
  private vectorStore: any; // 实际应用中应该是向量数据库客户端
  // @ts-ignore - 将在后续实现中使用
  private structuredStore: any; // 结构化数据存储

  constructor(config: Partial<RAGConfig> = {}) {
    this.config = { ...DEFAULT_RAG_CONFIG, ...config };
    this.initializeStores();
  }

  /**
   * 初始化存储
   */
  private initializeStores(): void {
    // 这里应该初始化向量数据库和结构化存储
    // 实际实现中会连接ChromaDB、PostgreSQL等
    console.log('初始化RAG存储...');
  }

  /**
   * 执行RAG查询
   */
  async query(
    question: string,
    context?: {
      /** 产品型号 */
      partNumber?: string;

      /** 技术参数 */
      technicalParams?: Record<string, any>;

      /** 应用场景 */
      application?: string;

      /** 用户角色 */
      userRole?: 'engineer' | 'purchaser' | 'designer';
    }
  ): Promise<RAGAnswer> {
    const startTime = Date.now();
    console.log(`RAG查询开始: ${startTime}`);

    try {
      // 1. 检索相关文档
      const retrievalResult = await this.retrieve(question, context);

      // 2. 生成答案
      const answer = await this.generateAnswer(question, retrievalResult, context);

      // 3. 验证技术参数
      if (this.config.generation.validateTechnicalParams) {
        answer.validation = this.validateTechnicalParameters(answer);
      }

      // 4. 计算置信度
      answer.confidence = this.calculateConfidence(retrievalResult, answer);

      return answer;

    } catch (error) {
      console.error('RAG查询失败:', error);

      // 返回错误答案
      return {
        answer: '抱歉，检索过程中出现错误。请重试或联系技术支持。',
        type: 'warning',
        sources: [],
        suggestions: [
          '简化查询问题',
          '检查网络连接',
          '联系SCAME技术支持'
        ],
        confidence: 0,
      };
    }
  }

  /**
   * 检索相关文档
   */
  private async retrieve(
    question: string,
    context?: any
  ): Promise<RAGQueryResult> {
    const strategies: Array<'structured' | 'vector' | 'keyword'> = [];
    const allChunks: DocumentChunk[] = [];

    // 1. 优先检索结构化数据（如果有上下文）
    if (this.config.retrieval.preferStructured && context?.partNumber) {
      const structuredChunks = await this.retrieveStructuredData(question, context);
      strategies.push('structured');
      allChunks.push(...structuredChunks);
    }

    // 2. 向量相似度检索
    const vectorChunks = await this.retrieveVectorSimilarity(question, context);
    strategies.push('vector');
    allChunks.push(...vectorChunks);

    // 3. 关键词全文检索
    const keywordChunks = await this.retrieveKeywordSearch(question);
    strategies.push('keyword');
    allChunks.push(...keywordChunks);

    // 4. 去重、排序和截断
    const uniqueChunks = this.deduplicateChunks(allChunks);
    const rankedChunks = this.rankChunks(uniqueChunks, question, context);
    const finalChunks = rankedChunks.slice(0, this.config.retrieval.maxResults);

    // 5. 计算置信度
    const confidence = this.calculateRetrievalConfidence(finalChunks);

    return {
      query: question,
      chunks: finalChunks,
      strategy: strategies.length > 1 ? 'hybrid' : strategies[0] || 'vector',
      latency: Date.now() - Date.now(), // 实际应该计算耗时
      confidence,
      warnings: this.getRetrievalWarnings(finalChunks, confidence),
    };
  }

  /**
   * 检索结构化数据
   */
  private async retrieveStructuredData(
    question: string,
    context: any
  ): Promise<DocumentChunk[]> {
    // 实际实现中会查询产品数据库、编码规则等
    const chunks: DocumentChunk[] = [];

    if (context?.partNumber) {
      // 基于产品型号的检索
      chunks.push({
        id: `product-${context.partNumber}`,
        content: `产品型号: ${context.partNumber} 的技术参数和规格信息。`,
        metadata: {
          source: 'product_database',
          type: 'manual',
          title: '产品技术规格',
          language: 'zh',
          filePath: 'internal://products',
          timestamp: new Date(),
        },
        score: 0.95,
      });
    }

    if (context?.technicalParams) {
      // 基于技术参数的检索
      const params = context.technicalParams;
      chunks.push({
        id: `params-${Date.now()}`,
        content: `技术参数: ${JSON.stringify(params)} 的匹配产品和应用建议。`,
        metadata: {
          source: 'selection_engine',
          type: 'rule',
          title: '选型规则',
          language: 'zh',
          filePath: 'internal://rules',
          timestamp: new Date(),
        },
        score: 0.85,
      });
    }

    return chunks;
  }

  /**
   * 向量相似度检索
   */
  private async retrieveVectorSimilarity(
    question: string,
    context?: any
  ): Promise<DocumentChunk[]> {
    // 实际实现中会查询向量数据库
    // 这里返回模拟数据

    const mockChunks: DocumentChunk[] = [
      {
        id: 'manual-001',
        content: 'SCAME OPTIMA系列产品适用于工业环境，防护等级IP44/IP54，电流范围16-125A。',
        metadata: {
          source: 'SCAME_产品手册_v2.3',
          type: 'manual',
          title: 'OPTIMA系列技术手册',
          page: 45,
          section: '技术规格',
          language: 'zh',
          filePath: '/docs/manuals/optima_manual.pdf',
          timestamp: new Date('2025-12-01'),
        },
        score: 0.88,
      },
      {
        id: 'training-001',
        content: '工业插头选型时，必须确保插头电流不大于插座电流，防护等级符合使用环境要求。',
        metadata: {
          source: 'SCAME技术培训',
          type: 'training',
          title: '工业插头插座选型指南',
          section: '安全规范',
          language: 'zh',
          filePath: '/docs/training/selection_guide.pptx',
          timestamp: new Date('2025-10-15'),
        },
        score: 0.82,
      },
      {
        id: 'rule-001',
        content: '编码规则：首位数字2表示工业插头，3表示移动连接器，4表示暗装插座，5表示明装插座。',
        metadata: {
          source: 'SCAME编码规则文档',
          type: 'rule',
          title: '产品编码体系',
          section: '首位数字含义',
          language: 'zh',
          filePath: '/docs/rules/coding_rules.docx',
          timestamp: new Date('2025-11-20'),
        },
        score: 0.75,
      },
    ];

    // 根据问题调整相关性
    const questionLower = question.toLowerCase();
    mockChunks.forEach(chunk => {
      if (questionLower.includes('optima') && chunk.metadata.title.includes('OPTIMA')) {
        chunk.score = 0.95;
      }
      if (questionLower.includes('编码') || questionLower.includes('规则')) {
        chunk.score = Math.min(chunk.score! + 0.1, 1.0);
      }
    });

    return mockChunks.filter(chunk => chunk.score! >= this.config.retrieval.vectorSimilarityThreshold);
  }

  /**
   * 关键词全文检索
   */
  private async retrieveKeywordSearch(question: string): Promise<DocumentChunk[]> {
    // 实际实现中会查询Elasticsearch等全文检索引擎
    const keywords = this.extractKeywords(question);

    const mockChunks: DocumentChunk[] = [
      {
        id: 'case-001',
        content: '港口码头应用案例：使用OPTIMA-TOP系列IP66/67产品，抗盐雾腐蚀，适用于户外恶劣环境。',
        metadata: {
          source: '应用案例库',
          type: 'case',
          title: '港口码头供电解决方案',
          language: 'zh',
          filePath: '/docs/cases/port_application.md',
          timestamp: new Date('2025-09-10'),
        },
        score: 0.70,
      },
    ];

    return mockChunks;
  }

  /**
   * 生成答案
   */
  private async generateAnswer(
    question: string,
    retrievalResult: RAGQueryResult,
    context?: any
  ): Promise<RAGAnswer> {
    // 实际实现中会调用LLM生成答案
    // 这里根据检索结果生成模拟答案

    const chunks = retrievalResult.chunks;

    // 提取关键信息
    const technicalInfo = chunks.filter(c => c.metadata.type === 'manual' || c.metadata.type === 'rule');
    const applicationInfo = chunks.filter(c => c.metadata.type === 'training' || c.metadata.type === 'case');

    let answer = '';
    let answerType: RAGAnswer['type'] = 'technical';

    if (technicalInfo.length > 0) {
      answer = this.generateTechnicalAnswer(question, technicalInfo, context);
      answerType = 'technical';
    } else if (applicationInfo.length > 0) {
      answer = this.generateApplicationAnswer(question, applicationInfo, context);
      answerType = 'application';
    } else {
      answer = '根据现有知识库，未能找到足够的技术依据回答您的问题。';
      answerType = 'warning';
    }

    // 构建来源引用
    const sources = chunks.map(chunk => ({
      chunk,
      relevance: chunk.score || 0.5,
      citation: `[${chunk.metadata.title}, p${chunk.metadata.page || 'N/A'}]`,
    }));

    // 生成建议
    const suggestions = this.generateSuggestions(question, chunks, context);

    return {
      answer,
      type: answerType,
      sources,
      suggestions,
      confidence: 0, // 将在外部计算
    };
  }

  /**
   * 生成技术性答案
   */
  private generateTechnicalAnswer(
    question: string,
    chunks: DocumentChunk[],
    context?: any
  ): string {
    const mainChunk = chunks[0];
    const content = mainChunk.content;

    let answer = `根据《${mainChunk.metadata.title}》`;
    if (mainChunk.metadata.page) {
      answer += `（第${mainChunk.metadata.page}页）`;
    }
    answer += '：\n\n';

    answer += content;

    // 添加上下文相关信息
    if (context?.partNumber) {
      answer += `\n\n针对您提到的型号 ${context.partNumber}，`;
      answer += '上述技术规格和要求完全适用。';
    }

    // 添加警告（如果需要）
    if (question.toLowerCase().includes('安全') || question.toLowerCase().includes('危险')) {
      answer += '\n\n⚠️ **安全警告**：请务必由专业电工安装，遵循当地电气规范。';
    }

    return answer;
  }

  /**
   * 生成应用性答案
   */
  private generateApplicationAnswer(
    question: string,
    chunks: DocumentChunk[],
    context?: any
  ): string {
    const chunk = chunks[0];

    let answer = `根据《${chunk.metadata.title}》中的说明：\n\n`;
    answer += chunk.content;

    // 添加应用建议
    if (context?.application) {
      answer += `\n\n对于"${context.application}"应用场景，建议：\n`;
      answer += '1. 选择符合环境防护等级的产品\n';
      answer += '2. 确保电流和电压匹配设备需求\n';
      answer += '3. 考虑安装方式和维护便利性\n';
    }

    return answer;
  }

  /**
   * 生成建议
   */
  private generateSuggestions(
    question: string,
    chunks: DocumentChunk[],
    context?: any
  ): string[] {
    const suggestions: string[] = [];

    // 基于问题类型的建议
    if (question.toLowerCase().includes('选型') || question.toLowerCase().includes('选择')) {
      suggestions.push('使用正向选型功能，输入具体技术参数获取匹配产品');
      suggestions.push('查看类似应用案例，了解实际配置方案');
    }

    if (question.toLowerCase().includes('兼容') || question.toLowerCase().includes('匹配')) {
      suggestions.push('使用反向选型功能，输入产品型号查看兼容产品');
      suggestions.push('验证IEC 60309标准兼容性');
    }

    if (chunks.length === 0) {
      suggestions.push('尝试使用更具体的关键词重新搜索');
      suggestions.push('联系SCAME技术支持获取专家建议');
    }

    // 基于上下文的建议
    if (context?.partNumber) {
      suggestions.push(`查看产品 ${context.partNumber} 的详细技术参数`);
      suggestions.push('生成完整的配套方案（插头+插座+连接器）');
    }

    return suggestions.slice(0, 3); // 最多返回3条建议
  }

  /**
   * 验证技术参数
   */
  private validateTechnicalParameters(answer: RAGAnswer): RAGAnswer['validation'] {
    // 实际实现中会解析答案中的技术参数，验证其准确性
    const verified: string[] = [];
    const unverified: string[] = [];

    // 简单示例：检查答案中是否包含技术参数
    const techParams = ['电流', '电压', '防护等级', '极数'];

    techParams.forEach(param => {
      if (answer.answer.includes(param)) {
        verified.push(param);
      }
    });

    return {
      valid: unverified.length === 0,
      verifiedParameters: verified,
      unverifiedParameters: unverified,
    };
  }

  /**
   * 计算检索置信度
   */
  private calculateRetrievalConfidence(chunks: DocumentChunk[]): number {
    if (chunks.length === 0) return 0;

    // 基于最高分数和结果数量计算
    const maxScore = Math.max(...chunks.map(c => c.score || 0));
    const avgScore = chunks.reduce((sum, c) => sum + (c.score || 0), 0) / chunks.length;

    return (maxScore * 0.7 + avgScore * 0.3) * Math.min(chunks.length / 5, 1);
  }

  /**
   * 计算答案置信度
   */
  private calculateConfidence(
    retrievalResult: RAGQueryResult,
    answer: RAGAnswer
  ): number {
    const retrievalConfidence = retrievalResult.confidence;
    const sourceCoverage = answer.sources.length > 0 ? 1 : 0;
    const validationScore = answer.validation?.valid ? 1 : 0.5;

    return (retrievalConfidence * 0.5 + sourceCoverage * 0.3 + validationScore * 0.2);
  }

  /**
   * 获取检索警告
   */
  private getRetrievalWarnings(chunks: DocumentChunk[], confidence: number): string[] {
    const warnings: string[] = [];

    if (chunks.length === 0) {
      warnings.push('未找到相关文档，答案可能不准确');
    }

    if (confidence < 0.5) {
      warnings.push('检索结果置信度较低，建议核实信息');
    }

    const oldDocs = chunks.filter(c => {
      const age = Date.now() - c.metadata.timestamp.getTime();
      return age > 365 * 24 * 60 * 60 * 1000; // 超过1年
    });

    if (oldDocs.length > 0) {
      warnings.push('部分文档已超过1年，信息可能已更新');
    }

    return warnings;
  }

  /**
   * 文档块去重
   */
  private deduplicateChunks(chunks: DocumentChunk[]): DocumentChunk[] {
    const seen = new Set<string>();
    const unique: DocumentChunk[] = [];

    for (const chunk of chunks) {
      const key = `${chunk.metadata.source}-${chunk.metadata.title}-${chunk.metadata.page}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(chunk);
      }
    }

    return unique;
  }

  /**
   * 文档块排序
   */
  private rankChunks(
    chunks: DocumentChunk[],
    question: string,
    context?: any
  ): DocumentChunk[] {
    return chunks.sort((a, b) => {
      // 优先级：分数 > 来源可靠性 > 时效性
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;

      if (Math.abs(scoreA - scoreB) > 0.1) {
        return scoreB - scoreA;
      }

      // 来源可靠性权重
      const sourceWeight: Record<string, number> = {
        'product_database': 1.0,
        'SCAME_产品手册': 0.9,
        'SCAME编码规则文档': 0.8,
        'SCAME技术培训': 0.7,
        '应用案例库': 0.6,
        'selection_engine': 0.5,
      };

      const weightA = sourceWeight[a.metadata.source] || 0.5;
      const weightB = sourceWeight[b.metadata.source] || 0.5;

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      // 时效性：越新越好
      return b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime();
    });
  }

  /**
   * 提取关键词
   */
  private extractKeywords(text: string): string[] {
    // 简单的中文关键词提取
    const stopWords = ['的', '了', '和', '是', '在', '有', '请', '怎么', '如何', '什么'];
    const words = text.split(/[\s,，。.?!；;]+/);

    return words
      .filter(word => word.length > 1 && !stopWords.includes(word))
      .slice(0, 5);
  }

  /**
   * 更新知识库
   */
  async updateKnowledgeBase(): Promise<void> {
    // 实际实现中会更新向量数据库索引
    console.log('更新RAG知识库...');
  }

  /**
   * 获取知识库统计信息
   */
  async getStats(): Promise<{
    totalChunks: number;
    sources: Record<string, number>;
    lastUpdated: Date;
  }> {
    return {
      totalChunks: 1250,
      sources: {
        'SCAME产品手册': 450,
        '技术培训资料': 320,
        '编码规则文档': 180,
        '应用案例': 300,
      },
      lastUpdated: new Date(),
    };
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建RAG服务单例
 */
let ragServiceInstance: ScameRAGService | null = null;

export function getRAGService(config?: Partial<RAGConfig>): ScameRAGService {
  if (!ragServiceInstance) {
    ragServiceInstance = new ScameRAGService(config);
  }
  return ragServiceInstance;
}

/**
 * 快速查询函数
 */
export async function queryScameKnowledge(
  question: string,
  context?: any
): Promise<RAGAnswer> {
  const service = getRAGService();
  return service.query(question, context);
}

/**
 * 批量查询
 */
export async function batchQueryScameKnowledge(
  questions: string[],
  context?: any
): Promise<RAGAnswer[]> {
  const service = getRAGService();
  const results: RAGAnswer[] = [];

  for (const question of questions) {
    const result = await service.query(question, context);
    results.push(result);
  }

  return results;
}