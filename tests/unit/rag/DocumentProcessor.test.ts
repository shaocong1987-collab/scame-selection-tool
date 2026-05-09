import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScameDocumentProcessor, createDocumentProcessor } from '@/lib/rag/DocumentProcessor';

// 模拟文件读取
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  stat: vi.fn(),
}));

// 模拟fetch用于文件读取
global.fetch = vi.fn();

describe('DocumentProcessor', () => {
  let processor: ScameDocumentProcessor;

  beforeEach(() => {
    processor = createDocumentProcessor();
    vi.clearAllMocks();
  });

  describe('基本功能', () => {
    it('应该能够创建处理器实例', () => {
      expect(processor).toBeDefined();
      expect(processor).toBeInstanceOf(ScameDocumentProcessor);
    });

    it('应该能够使用自定义配置创建处理器', () => {
      const customProcessor = createDocumentProcessor({
        chunkSize: 2000,
        chunkOverlap: 500,
        splitIntoChunks: false,
      });

      expect(customProcessor).toBeDefined();
    });
  });

  describe('文件类型检测', () => {
    it('应该正确检测PDF文件', () => {
      const processor = createDocumentProcessor();
      // 通过私有方法测试 - 实际应用中可能需要重构为可测试
      const filePath = '/docs/test.pdf';
      // @ts-ignore - 访问私有方法进行测试
      const fileType = processor['detectFileType'](filePath);
      expect(fileType).toBe('pdf');
    });

    it('应该正确检测DOCX文件', () => {
      const processor = createDocumentProcessor();
      const filePath = '/docs/test.docx';
      // @ts-ignore
      const fileType = processor['detectFileType'](filePath);
      expect(fileType).toBe('docx');
    });

    it('应该正确检测Markdown文件', () => {
      const processor = createDocumentProcessor();
      const filePath = '/docs/test.md';
      // @ts-ignore
      const fileType = processor['detectFileType'](filePath);
      expect(fileType).toBe('markdown');
    });

    it('应该将未知类型文件标记为unknown', () => {
      const processor = createDocumentProcessor();
      const filePath = '/docs/test.xyz';
      // @ts-ignore
      const fileType = processor['detectFileType'](filePath);
      expect(fileType).toBe('unknown');
    });
  });

  describe('元数据推断', () => {
    it('应该从路径推断SCAME官方文档来源', () => {
      const processor = createDocumentProcessor();
      const filePath = '/docs/scame/manual.pdf';
      // @ts-ignore
      const source = processor['inferSource'](filePath);
      expect(source).toBe('SCAME官方文档');
    });

    it('应该从路径推断wiki知识图谱来源', () => {
      const processor = createDocumentProcessor();
      const filePath = '/wiki/scame/knowledge.md';
      // @ts-ignore
      const source = processor['inferSource'](filePath);
      expect(source).toBe('SCAME知识图谱');
    });

    it('应该从路径推断文档类型', () => {
      const processor = createDocumentProcessor();

      // @ts-ignore
      const manualType = processor['inferDocumentType']('/docs/manual.pdf');
      expect(manualType).toBe('manual');

      // @ts-ignore
      const trainingType = processor['inferDocumentType']('/training/slides.pptx');
      expect(trainingType).toBe('training');

      // @ts-ignore
      const ruleType = processor['inferDocumentType']('/rules/coding.md');
      expect(ruleType).toBe('rule');

      // @ts-ignore
      const productType = processor['inferDocumentType']('/products/catalog.pdf');
      expect(productType).toBe('product');

      // @ts-ignore
      const otherType = processor['inferDocumentType']('/other/file.txt');
      expect(otherType).toBe('other');
    });
  });

  describe('文本处理', () => {
    it('应该清理和标准化文本', () => {
      const processor = createDocumentProcessor();
      const dirtyText = '  这是  一段  有 很多  空格的 文本。\r\n还有\r不同的换行符。  ';
      // @ts-ignore
      const cleaned = processor['processText'](dirtyText);

      expect(cleaned).not.toContain('  ');
      expect(cleaned).not.toContain('\r');
      expect(cleaned).toBe('这是 一段 有 很多 空格的 文本。 还有 不同的换行符。');
    });

    it('应该分块文本', () => {
      const processor = createDocumentProcessor({
        chunkSize: 50,
        chunkOverlap: 10,
      });

      const longText = '这是一段较长的文本内容，需要被分割成多个块。每个块应该包含适当的内容，并且块之间应该有重叠。这样在进行向量搜索时能够保持上下文的连贯性。';

      const metadata = {
        title: '测试文档',
        source: '测试',
        type: 'other' as const,
        filePath: '/test.txt',
        fileSize: 100,
        lastModified: new Date(),
        language: 'zh' as const,
      };

      // @ts-ignore
      const chunks = processor['splitIntoChunks'](longText, metadata);

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].id).toBeDefined();
      expect(chunks[0].content.length).toBeLessThanOrEqual(50);
      expect(chunks[0].metadata.source).toBe('测试');
    });

    it('当不需要分块时应创建单个块', () => {
      const processor = createDocumentProcessor({
        splitIntoChunks: false,
      });

      const text = '这是一个不需要分块的短文本。';

      const metadata = {
        title: '测试文档',
        source: '测试',
        type: 'other' as const,
        filePath: '/test.txt',
        fileSize: 100,
        lastModified: new Date(),
        language: 'zh' as const,
      };

      // @ts-ignore
      const chunks = processor['createSingleChunk'](text, metadata);

      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toBe(text);
      expect(chunks[0].id).toContain('测试-测试文档');
    });
  });

  describe('语言检测', () => {
    it('应该检测中文文本', async () => {
      const processor = createDocumentProcessor();
      const chineseText = '这是一段中文文本，包含许多中文字符。';
      // @ts-ignore
      const language = await processor['detectLanguage'](chineseText);
      expect(language).toBe('zh');
    });

    it('应该检测英文文本', async () => {
      const processor = createDocumentProcessor();
      const englishText = 'This is an English text with many English words.';
      // @ts-ignore
      const language = await processor['detectLanguage'](englishText);
      expect(language).toBe('en');
    });

    it('应该将混合文本标记为unknown', async () => {
      const processor = createDocumentProcessor();
      const mixedText = 'This is mixed 中文 and English text.';
      // @ts-ignore
      const language = await processor['detectLanguage'](mixedText);
      expect(language).toBe('unknown');
    });
  });

  describe('错误处理', () => {
    it('应该处理文件读取失败', async () => {
      // 模拟fetch失败
      (global.fetch as any).mockRejectedValue(new Error('文件不存在'));

      const result = await processor.processDocument('/nonexistent.pdf');

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
      expect(result.chunks.length).toBe(0);
      expect(result.metadata.title).toBe('nonexistent.pdf');
    });

    it('应该处理不支持的文件类型', async () => {
      // 模拟成功读取文件，但类型不受支持
      (global.fetch as any).mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      });

      const result = await processor.processDocument('/test.xyz');

      expect(result.status).toBe('failed');
      expect(result.error).toContain('不支持的文件类型');
    });
  });
});