/**
 * SCAME 文档处理器
 *
 * 负责将各种格式的文档转换为RAG系统可用的文档块
 * 支持PDF、DOCX、PPTX、Markdown、HTML等格式
 */

import { DocumentChunk } from './ScameRAGService';

export interface DocumentProcessingOptions {
  /** 是否拆分文档为小块 */
  splitIntoChunks: boolean;

  /** 块大小（字符数） */
  chunkSize: number;

  /** 块重叠（字符数） */
  chunkOverlap: number;

  /** 是否提取元数据 */
  extractMetadata: boolean;

  /** 语言检测 */
  detectLanguage: boolean;

  /** 自定义元数据 */
  customMetadata?: Record<string, any>;
}

export interface DocumentMetadata {
  /** 文档标题 */
  title: string;

  /** 文档来源 */
  source: string;

  /** 文档类型 */
  type: 'manual' | 'training' | 'rule' | 'case' | 'product' | 'other';

  /** 文件路径 */
  filePath: string;

  /** 文件大小（字节） */
  fileSize: number;

  /** 文件修改时间 */
  lastModified: Date;

  /** 语言 */
  language: 'zh' | 'en' | 'unknown';

  /** 页数（如果适用） */
  pageCount?: number;

  /** 作者 */
  author?: string;

  /** 版本 */
  version?: string;

  /** 发布日期 */
  publishDate?: Date;
}

export interface ProcessedDocument {
  /** 原始文档路径 */
  originalPath: string;

  /** 处理后的文档块 */
  chunks: DocumentChunk[];

  /** 文档元数据 */
  metadata: DocumentMetadata;

  /** 处理状态 */
  status: 'success' | 'partial' | 'failed';

  /** 错误信息 */
  error?: string;

  /** 处理耗时（毫秒） */
  processingTime: number;
}

/**
 * SCAME文档处理器
 */
export class ScameDocumentProcessor {
  private options: DocumentProcessingOptions;

  constructor(options: Partial<DocumentProcessingOptions> = {}) {
    this.options = {
      splitIntoChunks: true,
      chunkSize: 1000,
      chunkOverlap: 200,
      extractMetadata: true,
      detectLanguage: true,
      ...options,
    };
  }

  /**
   * 处理文档文件
   */
  async processDocument(filePath: string): Promise<ProcessedDocument> {
    const startTime = Date.now();

    try {
      // 1. 检测文件类型
      const fileType = this.detectFileType(filePath);

      // 2. 读取文件内容
      const fileContent = await this.readFileContent(filePath, fileType);

      // 3. 提取元数据
      const metadata = await this.extractMetadata(filePath, fileType, fileContent);

      // 4. 提取文本内容
      const textContent = await this.extractText(fileContent, fileType);

      // 5. 处理文本（清理、分段）
      const processedText = this.processText(textContent);

      // 6. 分块（如果需要）
      const chunks = this.options.splitIntoChunks
        ? this.splitIntoChunks(processedText, metadata)
        : this.createSingleChunk(processedText, metadata);

      // 7. 后处理块（清理、标记）
      const finalChunks = this.postProcessChunks(chunks);

      return {
        originalPath: filePath,
        chunks: finalChunks,
        metadata,
        status: 'success',
        processingTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error(`文档处理失败: ${filePath}`, error);

      // 返回部分结果或错误
      const metadata: DocumentMetadata = {
        title: this.getFileName(filePath),
        source: 'unknown',
        type: 'other',
        filePath,
        fileSize: 0,
        lastModified: new Date(),
        language: 'unknown',
      };

      return {
        originalPath: filePath,
        chunks: [],
        metadata,
        status: 'failed',
        error: error instanceof Error ? error.message : '未知错误',
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * 批量处理文档
   */
  async processDocuments(filePaths: string[]): Promise<ProcessedDocument[]> {
    const results: ProcessedDocument[] = [];

    // 限制并发数量
    const batchSize = 5;
    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(filePath => this.processDocument(filePath))
      );
      results.push(...batchResults);

      // 进度日志
      console.log(`已处理 ${i + batch.length}/${filePaths.length} 个文档`);
    }

    return results;
  }

  /**
   * 检测文件类型
   */
  private detectFileType(filePath: string): string {
    const extension = filePath.toLowerCase().split('.').pop() || '';

    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'docx';
    if (['ppt', 'pptx'].includes(extension)) return 'pptx';
    if (['xls', 'xlsx'].includes(extension)) return 'xlsx';
    if (['md', 'markdown'].includes(extension)) return 'markdown';
    if (['html', 'htm'].includes(extension)) return 'html';
    if (['txt', 'text'].includes(extension)) return 'text';
    if (['csv'].includes(extension)) return 'csv';
    if (['json'].includes(extension)) return 'json';

    return 'unknown';
  }

  /**
   * 读取文件内容
   */
  private async readFileContent(filePath: string, _fileType: string): Promise<Buffer> {
    // 实际实现中会根据文件类型使用不同的读取方式
    // 这里使用简单的文件读取
    const response = await fetch(`file://${filePath}`);
    if (!response.ok) {
      throw new Error(`无法读取文件: ${filePath}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 提取元数据
   */
  private async extractMetadata(
    filePath: string,
    fileType: string,
    content: Buffer
  ): Promise<DocumentMetadata> {
    const stats = await this.getFileStats(filePath);
    const fileName = this.getFileName(filePath);

    // 基础元数据
    const metadata: DocumentMetadata = {
      title: fileName,
      source: this.inferSource(filePath),
      type: this.inferDocumentType(filePath),
      filePath,
      fileSize: stats.size,
      lastModified: stats.mtime,
      language: 'unknown',
    };

    // 尝试从文件名和路径推断更多信息
    this.enrichMetadataFromPath(metadata, filePath);

    // 对于特定文件类型，可以提取更多元数据
    if (fileType === 'pdf') {
      await this.extractPdfMetadata(metadata, content);
    } else if (fileType === 'docx') {
      await this.extractDocxMetadata(metadata, content);
    }

    // 语言检测
    if (this.options.detectLanguage) {
      metadata.language = await this.detectLanguage(metadata.title);
    }

    return metadata;
  }

  /**
   * 提取文本内容
   */
  private async extractText(content: Buffer, fileType: string): Promise<string> {
    // 实际实现中会根据文件类型使用不同的提取方法
    // 这里返回模拟文本

    switch (fileType) {
      case 'pdf':
        return this.extractTextFromPdf(content);
      case 'docx':
        return this.extractTextFromDocx(content);
      case 'pptx':
        return this.extractTextFromPptx(content);
      case 'xlsx':
        return this.extractTextFromXlsx(content);
      case 'markdown':
      case 'html':
      case 'text':
      case 'csv':
      case 'json':
        return content.toString('utf-8');
      default:
        // 对于未知类型，尝试作为文本处理
        try {
          return content.toString('utf-8');
        } catch {
          throw new Error(`不支持的文件类型: ${fileType}`);
        }
    }
  }

  /**
   * 处理文本
   */
  private processText(text: string): string {
    // 1. 清理空白字符
    let processed = text.replace(/\s+/g, ' ').trim();

    // 2. 标准化换行符
    processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 3. 清理特殊字符（保留中文、英文、数字和基本标点）
    processed = processed.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s,.!?;:()\-"'\[\]{}]/g, ' ');

    // 4. 合并多个空格
    processed = processed.replace(/\s+/g, ' ');

    return processed;
  }

  /**
   * 分块文本
   */
  private splitIntoChunks(text: string, metadata: DocumentMetadata): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const chunkSize = this.options.chunkSize;
    const overlap = this.options.chunkOverlap;

    let position = 0;
    let chunkIndex = 0;

    while (position < text.length) {
      const end = Math.min(position + chunkSize, text.length);

      // 尝试在句子边界处结束
      let adjustedEnd = end;
      if (end < text.length) {
        // 寻找句子结束符
        const sentenceEnd = Math.min(
          text.indexOf('.', end - 50) + 1,
          text.indexOf('。', end - 50) + 1,
          text.indexOf('!', end - 50) + 1,
          text.indexOf('！', end - 50) + 1,
          text.indexOf('?', end - 50) + 1,
          text.indexOf('？', end - 50) + 1,
          text.indexOf('\n', end - 50) + 1,
          end
        );

        if (sentenceEnd > position + chunkSize * 0.5) {
          adjustedEnd = sentenceEnd;
        }
      }

      const chunkText = text.slice(position, adjustedEnd).trim();

      if (chunkText.length > 0) {
        const chunkId = `${metadata.source}-${metadata.title}-${chunkIndex}`.replace(/[^a-zA-Z0-9\-]/g, '_');

        chunks.push({
          id: chunkId,
          content: chunkText,
          metadata: {
            source: metadata.source,
            type: metadata.type,
            title: metadata.title,
            page: this.extractPageNumber(text, position, metadata),
            section: this.extractSection(text, position, metadata),
            language: metadata.language,
            filePath: metadata.filePath,
            timestamp: metadata.lastModified,
          },
        });
      }

      position = adjustedEnd - overlap;
      chunkIndex++;
    }

    return chunks;
  }

  /**
   * 创建单个块
   */
  private createSingleChunk(text: string, metadata: DocumentMetadata): DocumentChunk[] {
    const chunkId = `${metadata.source}-${metadata.title}`.replace(/[^a-zA-Z0-9\-]/g, '_');

    return [{
      id: chunkId,
      content: text,
      metadata: {
        source: metadata.source,
        type: metadata.type,
        title: metadata.title,
        language: metadata.language,
        filePath: metadata.filePath,
        timestamp: metadata.lastModified,
      },
    }];
  }

  /**
   * 后处理块
   */
  private postProcessChunks(chunks: DocumentChunk[]): DocumentChunk[] {
    return chunks.map((chunk, index) => {
      // 添加上下文信息
      let enhancedContent = chunk.content;

      if (chunks.length > 1) {
        enhancedContent = `[块 ${index + 1}/${chunks.length}] ${enhancedContent}`;
      }

      // 清理内容
      enhancedContent = enhancedContent.replace(/\s+/g, ' ').trim();

      return {
        ...chunk,
        content: enhancedContent,
      };
    });
  }

  // ============================================================================
  // 辅助方法
  // ============================================================================

  private async getFileStats(_filePath: string): Promise<{ size: number; mtime: Date }> {
    // 实际实现中会使用fs.stat
    return {
      size: 1024, // 模拟
      mtime: new Date(),
    };
  }

  private getFileName(filePath: string): string {
    return filePath.split('/').pop() || 'unknown';
  }

  private inferSource(filePath: string): string {
    const path = filePath.toLowerCase();

    if (path.includes('scame') || path.includes('斯卡姆')) {
      return 'SCAME官方文档';
    }

    if (path.includes('wiki')) {
      return 'SCAME知识图谱';
    }

    if (path.includes('training') || path.includes('培训')) {
      return 'SCAME技术培训';
    }

    if (path.includes('manual') || path.includes('手册')) {
      return 'SCAME产品手册';
    }

    if (path.includes('rule') || path.includes('规则')) {
      return 'SCAME编码规则';
    }

    if (path.includes('case') || path.includes('案例')) {
      return 'SCAME应用案例';
    }

    return '未知来源';
  }

  private inferDocumentType(filePath: string): DocumentMetadata['type'] {
    const path = filePath.toLowerCase();

    if (path.includes('manual') || path.includes('手册')) {
      return 'manual';
    }

    if (path.includes('training') || path.includes('培训')) {
      return 'training';
    }

    if (path.includes('rule') || path.includes('规则')) {
      return 'rule';
    }

    if (path.includes('case') || path.includes('案例')) {
      return 'case';
    }

    if (path.includes('product') || path.includes('产品')) {
      return 'product';
    }

    return 'other';
  }

  private enrichMetadataFromPath(metadata: DocumentMetadata, filePath: string): void {
    // 从路径中提取系列信息
    const path = filePath.toLowerCase();

    if (path.includes('optima')) {
      metadata.title = `OPTIMA系列 - ${metadata.title}`;
    } else if (path.includes('eureka')) {
      metadata.title = `EUREKA系列 - ${metadata.title}`;
    } else if (path.includes('libra')) {
      metadata.title = `LIBRA系列 - ${metadata.title}`;
    } else if (path.includes('advance')) {
      metadata.title = `ADVANCE系列 - ${metadata.title}`;
    } else if (path.includes('xenia')) {
      metadata.title = `XENIA系列 - ${metadata.title}`;
    }

    // 从路径中提取版本信息
    const versionMatch = filePath.match(/v?(\d+\.\d+\.?\d*)/i);
    if (versionMatch) {
      metadata.version = versionMatch[1];
    }
  }

  private async extractPdfMetadata(metadata: DocumentMetadata, content: Buffer): Promise<void> {
    // 实际实现中会使用pdf-lib或类似的库
    // 这里设置模拟值
    metadata.pageCount = 10;
    metadata.author = 'SCAME Technical Department';
  }

  private async extractDocxMetadata(metadata: DocumentMetadata, content: Buffer): Promise<void> {
    // 实际实现中会使用mammoth或类似的库
    metadata.author = 'SCAME Technical Department';
  }

  private async detectLanguage(text: string): Promise<'zh' | 'en' | 'unknown'> {
    // 简单的语言检测
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

    if (chineseChars > englishWords * 2) {
      return 'zh';
    } else if (englishWords > chineseChars * 2) {
      return 'en';
    } else {
      return 'unknown';
    }
  }

  private extractPageNumber(text: string, position: number, metadata: DocumentMetadata): number | undefined {
    // 简单估算页码
    if (metadata.pageCount) {
      const ratio = position / text.length;
      return Math.floor(ratio * metadata.pageCount) + 1;
    }
    return undefined;
  }

  private extractSection(text: string, position: number, metadata: DocumentMetadata): string | undefined {
    // 查找当前位置附近的章节标题
    const searchStart = Math.max(0, position - 500);
    const searchEnd = Math.min(text.length, position + 500);
    const context = text.slice(searchStart, searchEnd);

    // 查找章节标题模式
    const sectionMatch = context.match(/第[一二三四五六七八九十]+章\s+[^\n]+/g) ||
                        context.match(/[0-9]+\.[0-9]+\s+[^\n]+/g) ||
                        context.match(/[A-Z]+\.[0-9]+\s+[^\n]+/g);

    if (sectionMatch && sectionMatch.length > 0) {
      return sectionMatch[0].trim();
    }

    return undefined;
  }

  // ============================================================================
  // 文件类型特定的提取方法（模拟实现）
  // ============================================================================

  private async extractTextFromPdf(content: Buffer): Promise<string> {
    // 实际实现中会使用pdf-parse或类似的库
    return 'PDF文档内容 - 需要安装pdf-parse库';
  }

  private async extractTextFromDocx(content: Buffer): Promise<string> {
    // 实际实现中会使用mammoth或类似的库
    return 'DOCX文档内容 - 需要安装mammoth库';
  }

  private async extractTextFromPptx(content: Buffer): Promise<string> {
    // 实际实现中会使用ppt-extractor或类似的库
    return 'PPTX文档内容 - 需要安装相应的库';
  }

  private async extractTextFromXlsx(content: Buffer): Promise<string> {
    // 实际实现中会使用xlsx或类似的库
    return 'XLSX文档内容 - 需要安装xlsx库';
  }
}

/**
 * 工厂函数：创建文档处理器
 */
export function createDocumentProcessor(options?: Partial<DocumentProcessingOptions>): ScameDocumentProcessor {
  return new ScameDocumentProcessor(options);
}