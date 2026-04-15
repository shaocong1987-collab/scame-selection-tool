/**
 * SCAME RAG系统主入口
 */

export * from './ScameRAGService';

// 简化API
import { getRAGService, queryScameKnowledge, batchQueryScameKnowledge } from './ScameRAGService';

export const rag = {
  query: queryScameKnowledge,
  batchQuery: batchQueryScameKnowledge,
  getService: getRAGService,
  async quickAnswer(question: string, options?: { partNumber?: string }): Promise<string> {
    const result = await queryScameKnowledge(question, options);

    // 格式化简洁答案
    let answer = result.answer;

    if (result.sources.length > 0) {
      answer += '\n\n**来源**：';
      result.sources.forEach((source, index) => {
        answer += `\n${index + 1}. ${source.citation}`;
      });
    }

    if (result.warnings && result.warnings.length > 0) {
      answer += '\n\n**注意**：' + result.warnings.join('；');
    }

    if (result.suggestions.length > 0) {
      answer += '\n\n**建议**：' + result.suggestions.join('；');
    }

    return answer;
  }
};

// 默认导出
export default rag;