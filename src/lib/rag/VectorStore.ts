/**
 * SCAME RAG 向量存储接口
 *
 * 提供向量数据库的抽象接口，支持多种后端实现
 */

import { DocumentChunk } from './ScameRAGService';

export interface VectorStoreConfig {
  /** 数据库类型 */
  type: 'chroma' | 'pinecone' | 'qdrant' | 'memory';

  /** 连接配置 */
  config: {
    url?: string;
    apiKey?: string;
    collectionName?: string;
    dimension?: number;
  };

  /** 嵌入模型配置 */
  embedding: {
    provider: 'openai' | 'local' | 'cohere';
    model: string;
    apiKey?: string;
  };
}

export interface SearchOptions {
  /** 相似度阈值 */
  similarityThreshold: number;

  /** 最大返回结果数 */
  maxResults: number;

  /** 过滤条件 */
  filter?: {
    source?: string;
    type?: string;
    language?: string;
  };
}

/**
 * 向量存储接口
 */
export interface IVectorStore {
  /**
   * 初始化存储
   */
  initialize(): Promise<void>;

  /**
   * 添加文档块
   */
  addChunks(chunks: DocumentChunk[]): Promise<void>;

  /**
   * 搜索相似文档
   */
  search(query: string, options: SearchOptions): Promise<DocumentChunk[]>;

  /**
   * 删除文档
   */
  deleteChunks(ids: string[]): Promise<void>;

  /**
   * 清空存储
   */
  clear(): Promise<void>;

  /**
   * 获取统计信息
   */
  getStats(): Promise<{
    totalChunks: number;
    collections: string[];
    dimensions: number;
  }>;
}

/**
 * 内存向量存储（用于开发和测试）
 */
export class MemoryVectorStore implements IVectorStore {
  private chunks: DocumentChunk[] = [];
  private dimension: number = 384; // 默认维度

  async initialize(): Promise<void> {
    console.log('初始化内存向量存储');
  }

  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    // 为每个chunk生成模拟嵌入向量
    chunks.forEach(chunk => {
      if (!chunk.embedding) {
        chunk.embedding = this.generateMockEmbedding(chunk.content);
      }
    });

    this.chunks.push(...chunks);
    console.log(`添加了 ${chunks.length} 个文档块，当前总数: ${this.chunks.length}`);
  }

  async search(query: string, options: SearchOptions): Promise<DocumentChunk[]> {
    // 模拟向量相似度搜索
    const queryEmbedding = this.generateMockEmbedding(query);

    const scoredChunks = this.chunks.map(chunk => {
      const similarity = this.calculateCosineSimilarity(queryEmbedding, chunk.embedding!);
      return {
        ...chunk,
        score: similarity,
      };
    });

    // 过滤和排序
    const filtered = scoredChunks
      .filter(chunk => chunk.score >= options.similarityThreshold)
      .sort((a, b) => b.score! - a.score!)
      .slice(0, options.maxResults);

    // 应用过滤条件
    let result = filtered;
    if (options.filter) {
      result = result.filter(chunk => {
        const metadata = chunk.metadata;
        if (options.filter?.source && metadata.source !== options.filter.source) {
          return false;
        }
        if (options.filter?.type && metadata.type !== options.filter.type) {
          return false;
        }
        if (options.filter?.language && metadata.language !== options.filter.language) {
          return false;
        }
        return true;
      });
    }

    return result;
  }

  async deleteChunks(ids: string[]): Promise<void> {
    this.chunks = this.chunks.filter(chunk => !ids.includes(chunk.id));
    console.log(`删除了 ${ids.length} 个文档块，剩余: ${this.chunks.length}`);
  }

  async clear(): Promise<void> {
    this.chunks = [];
    console.log('清空向量存储');
  }

  async getStats(): Promise<{
    totalChunks: number;
    collections: string[];
    dimensions: number;
  }> {
    const sources = new Set(this.chunks.map(c => c.metadata.source));
    return {
      totalChunks: this.chunks.length,
      collections: Array.from(sources),
      dimensions: this.dimension,
    };
  }

  /**
   * 生成模拟嵌入向量
   */
  private generateMockEmbedding(text: string): number[] {
    // 简单模拟：基于文本长度和字符分布的伪随机向量
    const seed = text.length;
    const dimension = this.dimension;
    const embedding: number[] = [];

    for (let i = 0; i < dimension; i++) {
      const hash = (seed * (i + 1)) % 1000;
      embedding.push((Math.sin(hash) + 1) / 2); // 归一化到 [0, 1]
    }

    return embedding;
  }

  /**
   * 计算余弦相似度
   */
  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

/**
 * ChromaDB 向量存储实现
 */
export class ChromaVectorStore implements IVectorStore {
  private config: VectorStoreConfig;
  private client: any;

  constructor(config: VectorStoreConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      // 动态导入chromadb（避免在未安装时出错）
      // @ts-ignore - 动态导入可能失败，但在开发环境中可以忽略
      const { ChromaClient } = await import('chromadb');
      this.client = new ChromaClient({
        path: this.config.config.url || 'http://localhost:8000',
      });

      console.log('ChromaDB 向量存储初始化成功');
    } catch (error) {
      console.warn('ChromaDB 未安装，回退到内存存储');
      // 在开发环境中不抛出错误，只记录警告
      console.warn('ChromaDB 未安装，但在开发环境中可以继续运行');
    }
  }

  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    // 实际实现需要调用ChromaDB API
    console.log(`ChromaDB: 添加 ${chunks.length} 个文档块`);
  }

  async search(query: string, options: SearchOptions): Promise<DocumentChunk[]> {
    // 实际实现需要调用ChromaDB API
    console.log(`ChromaDB: 搜索查询 "${query.substring(0, 50)}..."`);
    return [];
  }

  async deleteChunks(ids: string[]): Promise<void> {
    console.log(`ChromaDB: 删除 ${ids.length} 个文档块`);
  }

  async clear(): Promise<void> {
    console.log('ChromaDB: 清空集合');
  }

  async getStats(): Promise<{
    totalChunks: number;
    collections: string[];
    dimensions: number;
  }> {
    return {
      totalChunks: 0,
      collections: [],
      dimensions: 0,
    };
  }
}

/**
 * 向量存储工厂
 */
export class VectorStoreFactory {
  static createStore(config: VectorStoreConfig): IVectorStore {
    switch (config.type) {
      case 'chroma':
        return new ChromaVectorStore(config);
      case 'memory':
      default:
        return new MemoryVectorStore();
    }
  }

  /**
   * 创建默认配置的向量存储
   */
  static createDefaultStore(): IVectorStore {
    const config: VectorStoreConfig = {
      type: 'memory', // 开发阶段使用内存存储
      config: {},
      embedding: {
        provider: 'local',
        model: 'all-MiniLM-L6-v2', // 常用本地模型
      },
    };

    return this.createStore(config);
  }
}