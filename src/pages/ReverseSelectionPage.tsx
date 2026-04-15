import React, { useState } from 'react';
import { Search, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parsePartNumber, getReplacements } from '@/lib/scame/coding';
import { validateCompatibility } from '@/lib/scame/matching';
import SelectionExplanation from '@/components/rag/SelectionExplanation';

const ReverseSelectionPage: React.FC = () => {
  const [partNumber, setPartNumber] = useState('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [replacements, setReplacements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!partNumber.trim()) {
      setError('请输入订货号');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 解析订货号
      const parsed = parsePartNumber(partNumber);
      setParsedResult(parsed);

      if (parsed.isValid) {
        // 获取替换建议
        const reps = getReplacements(partNumber);
        setReplacements(reps);

        // 验证兼容性
        const compatibilityResults = [];
        for (const rep of reps.slice(0, 3)) {
          const validation = await validateCompatibility(partNumber, rep.replacement);
          compatibilityResults.push({
            ...rep,
            validation
          });
        }
        setReplacements(compatibilityResults);
      } else {
        setReplacements([]);
        setError(`订货号无效: ${parsed.errors.join(', ')}`);
      }
    } catch (err) {
      setError('解析过程中发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPartNumber('');
    setParsedResult(null);
    setReplacements([]);
    setError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">反向选型</h1>
        <p className="text-gray-600 mt-2">
          通过产品型号查询完整技术参数和兼容产品
        </p>
      </div>

      {/* 输入区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">订货号查询</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              请输入SCAME订货号
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="input flex-1"
                placeholder="例如：213.3237, 513.63532T, 899.AL2DE335"
              />
              <button
                onClick={handleParse}
                disabled={isLoading}
                className="px-6 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '解析中...' : '解析订货号'}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                清空
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              支持标准格式：XXX.XXXXX 或大电流格式：899.XXXXXXX
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 解析结果 */}
      {parsedResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className={`h-5 w-5 ${parsedResult.isValid ? 'text-green-500' : 'text-red-500'} mr-2`} />
                <h2 className="text-xl font-semibold text-gray-900">
                  订货号解析结果
                </h2>
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded ${parsedResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {parsedResult.isValid ? '有效' : '无效'}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">原始订货号</dt>
                    <dd className="font-mono font-bold text-gray-900">{parsedResult.partNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">前缀</dt>
                    <dd className="font-mono text-gray-900">{parsedResult.prefix}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">后缀</dt>
                    <dd className="font-mono text-gray-900">{parsedResult.suffix}</dd>
                  </div>
                  {parsedResult.variant && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">变体标识</dt>
                      <dd className="font-mono text-gray-900">{parsedResult.variant}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">技术参数</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">产品类别</dt>
                    <dd className="font-medium text-gray-900">{parsedResult.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">产品系列</dt>
                    <dd className="font-medium text-gray-900">{parsedResult.series}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">电流规格</dt>
                    <dd className="font-medium text-gray-900">{parsedResult.current}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">极数配置</dt>
                    <dd className="font-medium text-gray-900">{parsedResult.poles}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">防护等级</dt>
                    <dd className="font-medium text-gray-900">{parsedResult.protection}</dd>
                  </div>
                  {parsedResult.voltage && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">电压范围</dt>
                      <dd className="font-medium text-gray-900">{parsedResult.voltage}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* 原始产品的RAG解释 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <SelectionExplanation
                product={{
                  partNumber: parsedResult.partNumber,
                  name: `${parsedResult.series} ${parsedResult.category}`,
                  series: parsedResult.series,
                  current: parsedResult.current,
                  poles: parsedResult.poles,
                  protection: parsedResult.protection,
                  voltage: parsedResult.voltage || '',
                }}
                autoLoad={true}
              />
            </div>

            {parsedResult.warnings.length > 0 && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-900">警告信息</h4>
                </div>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {parsedResult.warnings.map((warning: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 替换建议 */}
      {replacements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">兼容产品推荐</h2>
            <p className="text-gray-600 text-sm mt-1">
              基于SCAME黄金替换法则的兼容产品
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {replacements.map((replacement, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="font-mono font-bold text-lg text-gray-900">
                        {replacement.replacement}
                      </span>
                      <span className="ml-4 text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {replacement.relationship}
                      </span>
                      <div className="ml-auto flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-sm text-green-600 font-medium">
                          置信度 {(replacement.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">匹配度</div>
                        <div className="font-medium text-gray-900">
                          {replacement.validation?.score ? `${(replacement.validation.score * 100).toFixed(0)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">状态</div>
                        <div className="font-medium">
                          {replacement.validation?.valid ? (
                            <span className="text-green-600">兼容</span>
                          ) : (
                            <span className="text-red-600">不兼容</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {replacement.differences && replacement.differences.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">主要差异</div>
                        <ul className="space-y-1">
                          {replacement.differences.map((diff: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              {diff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 替换产品的RAG解释 */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <SelectionExplanation
                        product={{
                          partNumber: replacement.replacement,
                          name: `替换产品: ${replacement.relationship}`,
                          series: parsedResult.series, // 使用原始产品的系列
                          current: parsedResult.current, // 假设电流相同
                          poles: parsedResult.poles, // 假设极数相同
                          protection: parsedResult.protection, // 假设防护等级相同
                          voltage: parsedResult.voltage || '',
                        }}
                        autoLoad={true}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button className="px-4 py-2 text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                        查看详情
                      </button>
                      <button className="px-4 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                        加入对比
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!parsedResult && !isLoading && !error && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">输入订货号开始解析</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            输入SCAME产品订货号，系统将解析技术参数并推荐兼容产品
          </p>
        </div>
      )}
    </div>
  );
};

export default ReverseSelectionPage;