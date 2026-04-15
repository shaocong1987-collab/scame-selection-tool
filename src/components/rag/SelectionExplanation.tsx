import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, AlertCircle, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { queryScameKnowledge } from '@/lib/rag';

interface SelectionExplanationProps {
  /** 产品信息 */
  product: {
    partNumber: string;
    name: string;
    series: string;
    current: string;
    poles: string;
    protection: string;
    voltage: string;
  };

  /** 应用场景描述 */
  applicationContext?: string;

  /** 是否自动加载 */
  autoLoad?: boolean;
}

interface RAGExplanation {
  /** 技术依据 */
  technicalBasis: string;

  /** 应用建议 */
  applicationAdvice: string[];

  /** 注意事项 */
  warnings: string[];

  /** 兼容性信息 */
  compatibility: {
    matchingProducts: string[];
    replacementSeries: string[];
  };

  /** 引用来源 */
  sources: Array<{
    title: string;
    page?: number;
    relevance: number;
  }>;

  /** 置信度 */
  confidence: number;

  /** 加载状态 */
  isLoading: boolean;

  /** 错误信息 */
  error?: string;
}

const SelectionExplanation: React.FC<SelectionExplanationProps> = ({
  product,
  applicationContext,
  autoLoad = true,
}) => {
  const [explanation, setExplanation] = useState<RAGExplanation>({
    technicalBasis: '',
    applicationAdvice: [],
    warnings: [],
    compatibility: {
      matchingProducts: [],
      replacementSeries: [],
    },
    sources: [],
    confidence: 0,
    isLoading: false,
  });

  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (autoLoad) {
      loadExplanation();
    }
  }, [product.partNumber, applicationContext]);

  const loadExplanation = async () => {
    setExplanation(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // 构建查询问题
      const question = `请为产品${product.partNumber} (${product.name}) 提供选型解释和技术依据。技术参数：电流${product.current}，极数${product.poles}，防护等级${product.protection}，电压${product.voltage}。${applicationContext ? `应用场景：${applicationContext}` : ''}`;

      // 调用RAG服务
      const result = await queryScameKnowledge(question, {
        partNumber: product.partNumber,
        technicalParams: {
          current: product.current,
          poles: product.poles,
          protection: product.protection,
          voltage: product.voltage,
          series: product.series,
        },
        application: applicationContext,
      });

      // 解析RAG结果
      const technicalBasis = result.answer;

      // 提取应用建议和警告
      const applicationAdvice: string[] = [];
      const warnings: string[] = result.warnings ? [...result.warnings] : [];

      result.suggestions.forEach(suggestion => {
        if (suggestion.includes('建议') || suggestion.includes('推荐')) {
          applicationAdvice.push(suggestion);
        } else if (suggestion.includes('注意') || suggestion.includes('警告')) {
          warnings.push(suggestion);
        }
      });

      // 提取兼容性信息（从答案中推断）
      const compatibility = {
        matchingProducts: [],
        replacementSeries: [],
      };

      // 解析来源
      const sources = result.sources.map(source => ({
        title: source.chunk.metadata.title,
        page: source.chunk.metadata.page,
        relevance: source.relevance,
      }));

      setExplanation({
        technicalBasis,
        applicationAdvice,
        warnings,
        compatibility,
        sources,
        confidence: result.confidence,
        isLoading: false,
      });

    } catch (error) {
      console.error('加载选型解释失败:', error);
      setExplanation(prev => ({
        ...prev,
        error: '无法加载技术解释，请稍后重试',
        isLoading: false,
      }));
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`;
  };

  if (explanation.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-900">解释加载失败</div>
            <div className="text-sm text-red-700 mt-1">{explanation.error}</div>
            <button
              onClick={loadExplanation}
              className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              重试加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 标题栏 */}
      <div
        className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">选型解释与技术依据</span>
          {explanation.confidence > 0 && (
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(explanation.confidence)}`}>
              置信度: {formatConfidence(explanation.confidence)}
            </span>
          )}
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          {/* 加载状态 */}
          {explanation.isLoading && (
            <div className="text-center py-6">
              <div className="inline-block h-8 w-8 border-2 border-scame-blue border-t-transparent rounded-full animate-spin mb-3"></div>
              <div className="text-gray-600">正在从知识库加载技术解释...</div>
            </div>
          )}

          {!explanation.isLoading && (
            <div className="space-y-6">
              {/* 技术依据 */}
              {explanation.technicalBasis && (
                <div>
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">技术依据</h4>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {explanation.technicalBasis}
                  </div>
                </div>
              )}

              {/* 应用建议 */}
              {explanation.applicationAdvice.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">应用建议</h4>
                  </div>
                  <ul className="space-y-2">
                    {explanation.applicationAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 注意事项 */}
              {explanation.warnings.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">注意事项</h4>
                  </div>
                  <ul className="space-y-2">
                    {explanation.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start text-sm text-yellow-700">
                        <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 兼容性信息 */}
              {(explanation.compatibility.matchingProducts.length > 0 ||
                explanation.compatibility.replacementSeries.length > 0) && (
                <div>
                  <div className="flex items-center mb-3">
                    <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">兼容性信息</h4>
                  </div>
                  <div className="space-y-3">
                    {explanation.compatibility.matchingProducts.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">配套产品</div>
                        <div className="flex flex-wrap gap-2">
                          {explanation.compatibility.matchingProducts.map((product, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {explanation.compatibility.replacementSeries.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">可替换系列</div>
                        <div className="flex flex-wrap gap-2">
                          {explanation.compatibility.replacementSeries.map((series, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                            >
                              {series}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 引用来源 */}
              {explanation.sources.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">引用来源</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {explanation.sources.map((source, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        <div>
                          {source.title}
                          {source.page && ` (第${source.page}页)`}
                          <span className="ml-2 text-xs text-gray-500">
                            相关度: {(source.relevance * 100).toFixed(0)}%
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    基于SCAME官方知识库的智能解释
                  </div>
                  <button
                    onClick={loadExplanation}
                    className="px-3 py-1 text-sm text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors"
                  >
                    刷新解释
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionExplanation;