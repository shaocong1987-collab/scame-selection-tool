import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryVectorStore, VectorStoreFactory, type DocumentChunk } from '@/lib/rag/VectorStore';

describe('VectorStore', () => {
  describe('MemoryVectorStore', () => {
    let store: MemoryVectorStore;
    let testChunks: DocumentChunk[];

    beforeEach(() => {
      store = new MemoryVectorStore();
      testChunks = [
        {
          id: 'chunk-1',
          content: 'SCAME OPTIMA系列工业插头，16A，3P+E，IP44防护等级',
          metadata: {
            source: 'SCAME产品手册',
            type: 'product',
            title: 'OPTIMA插头技术规格',
            language: 'zh',
            filePath: '/docs/manuals/optima.pdf',
            timestamp: new Date('2026-01-15'),
          },
        },
        {
          id: 'chunk-2',
          content: 'SCAME EURECA系列防水插座，32A，2P+E，IP67防护等级',
          metadata: {
            source: 'SCAME技术培训',
            type: 'training',
            title: '防水插座选型指南',
            language: 'zh',
            filePath: '/docs/training/waterproof.pdf',
            timestamp: new Date('2026-02-20'),
          },
        },
        {
          id: 'chunk-3',
          content: 'SCAME编码规则：首位数字2表示输入端/工业插头',
          metadata: {
            source: 'SCAME编码规则',
            type: 'rule',
            title: 'SCAME编码规则文档',
            language: 'zh',
            filePath: '/docs/rules/coding.md',
            timestamp: new Date('2026-03-10'),
          },
        },
      ];
    });

    it('应该正确初始化', async () => {
      await store.initialize();
      // 初始化应该成功完成，没有错误
      expect(true).toBe(true);
    });

    it('应该能够添加和检索文档块', async () => {
      await store.initialize();
      await store.addChunks(testChunks);

      const stats = await store.getStats();
      expect(stats.totalChunks).toBe(3);
      expect(stats.collections).toContain('SCAME产品手册');
      expect(stats.collections).toContain('SCAME技术培训');
    });

    it('应该能够搜索相似文档', async () => {
      await store.initialize();
      await store.addChunks(testChunks);

      const results = await store.search('工业插头选型', {
        similarityThreshold: 0.1,
        maxResults: 5,
      });

      expect(results.length).toBeGreaterThan(0);
      // 应该能找到与查询相关的文档
      const found = results.some(chunk =>
        chunk.content.includes('插头') || chunk.metadata.type === 'product'
      );
      expect(found).toBe(true);
    });

    it('应该能够根据过滤条件搜索', async () => {
      await store.initialize();
      await store.addChunks(testChunks);

      const results = await store.search('插座', {
        similarityThreshold: 0.1,
        maxResults: 5,
        filter: {
          source: 'SCAME技术培训',
        },
      });

      expect(results.length).toBe(1);
      expect(results[0].metadata.source).toBe('SCAME技术培训');
      expect(results[0].content).toContain('插座');
    });

    it('应该能够删除文档块', async () => {
      await store.initialize();
      await store.addChunks(testChunks);

      await store.deleteChunks(['chunk-2']);

      const stats = await store.getStats();
      expect(stats.totalChunks).toBe(2);

      const results = await store.search('插座', {
        similarityThreshold: 0.1,
        maxResults: 5,
      });

      // chunk-2 应该已经被删除
      const deletedChunkFound = results.some(chunk => chunk.id === 'chunk-2');
      expect(deletedChunkFound).toBe(false);
    });

    it('应该能够清空存储', async () => {
      await store.initialize();
      await store.addChunks(testChunks);

      await store.clear();

      const stats = await store.getStats();
      expect(stats.totalChunks).toBe(0);
      expect(stats.collections).toEqual([]);
    });
  });

  describe('VectorStoreFactory', () => {
    it('应该能够创建内存向量存储', () => {
      const store = VectorStoreFactory.createStore({
        type: 'memory',
        config: {},
        embedding: {
          provider: 'local',
          model: 'all-MiniLM-L6-v2',
        },
      });

      expect(store).toBeDefined();
      expect(store).toBeInstanceOf(MemoryVectorStore);
    });

    it('应该能够创建默认存储', () => {
      const store = VectorStoreFactory.createDefaultStore();
      expect(store).toBeDefined();
      // 默认应该是内存存储
      expect(store).toBeInstanceOf(MemoryVectorStore);
    });

    it('应该能够尝试创建ChromaDB存储', () => {
      // 注意：这个测试可能会因为ChromaDB未安装而失败
      // 但我们只是测试工厂函数的行为
      const store = VectorStoreFactory.createStore({
        type: 'chroma',
        config: {
          url: 'http://localhost:8000',
          collectionName: 'test',
        },
        embedding: {
          provider: 'local',
          model: 'all-MiniLM-L6-v2',
        },
      });

      expect(store).toBeDefined();
      // 工厂应该返回一个对象，即使ChromaDB未安装
      expect(typeof store.initialize).toBe('function');
    });
  });
});