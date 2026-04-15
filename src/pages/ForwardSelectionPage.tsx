import React, { useState } from 'react';
import { Search, Filter, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import SelectionExplanation from '@/components/rag/SelectionExplanation';
import {
  ProductCategory,
  CurrentRating,
  PolesConfiguration,
  ProtectionRating,
  ProductSeries
} from '@/lib/scame/coding';

const ForwardSelectionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    current: '' as CurrentRating | '',
    poles: '' as PolesConfiguration | '',
    protection: '' as ProtectionRating | '',
    voltage: '',
    category: '' as ProductCategory | '',
    series: '' as ProductSeries | '',
    application: '',
  });

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentOptions = Object.values(CurrentRating);
  const polesOptions = Object.values(PolesConfiguration);
  const protectionOptions = Object.values(ProtectionRating);
  const categoryOptions = Object.values(ProductCategory);
  const seriesOptions = Object.values(ProductSeries);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟API调用
    setTimeout(() => {
      setResults([
        {
          partNumber: '213.3237',
          name: '32A 3P+N+E IP44工业插头',
          series: 'OPTIMA',
          current: '32A',
          poles: '3P+N+E',
          protection: 'IP44/IP54',
          voltage: '200-250V',
          price: '¥1,280',
          stock: 45,
          matchScore: 0.95
        },
        {
          partNumber: '313.3237',
          name: '32A 3P+N+E IP44移动连接器',
          series: 'OPTIMA',
          current: '32A',
          poles: '3P+N+E',
          protection: 'IP44/IP54',
          voltage: '200-250V',
          price: '¥1,450',
          stock: 32,
          matchScore: 0.92
        },
        {
          partNumber: '413.3267',
          name: '32A 3P+N+E IP44暗装插座',
          series: 'OPTIMA',
          current: '32A',
          poles: '3P+N+E',
          protection: 'IP44/IP54',
          voltage: '200-250V',
          price: '¥1,650',
          stock: 28,
          matchScore: 0.90
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      current: '',
      poles: '',
      protection: '',
      voltage: '',
      category: '',
      series: '',
      application: '',
    });
    setResults([]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">正向选型</h1>
        <p className="text-gray-600 mt-2">
          通过技术参数查找匹配的SCAME产品
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 表单区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">筛选条件</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    电流规格 *
                  </label>
                  <select
                    value={formData.current}
                    onChange={(e) => handleInputChange('current', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">请选择电流</option>
                    {currentOptions.map(current => (
                      <option key={current} value={current}>
                        {current}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    极数配置 *
                  </label>
                  <select
                    value={formData.poles}
                    onChange={(e) => handleInputChange('poles', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">请选择极数</option>
                    {polesOptions.map(poles => (
                      <option key={poles} value={poles}>
                        {poles}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    防护等级 *
                  </label>
                  <select
                    value={formData.protection}
                    onChange={(e) => handleInputChange('protection', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">请选择防护等级</option>
                    {protectionOptions.map(protection => (
                      <option key={protection} value={protection}>
                        {protection}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    电压范围
                  </label>
                  <input
                    type="text"
                    value={formData.voltage}
                    onChange={(e) => handleInputChange('voltage', e.target.value)}
                    className="input"
                    placeholder="如：200-250V, 380-415V"
                  />
                </div>

                <div>
                  <label className="label">
                    产品类别
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input"
                  >
                    <option value="">不限类别</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    产品系列
                  </label>
                  <select
                    value={formData.series}
                    onChange={(e) => handleInputChange('series', e.target.value)}
                    className="input"
                  >
                    <option value="">不限系列</option>
                    {seriesOptions.map(series => (
                      <option key={series} value={series}>
                        {series}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  应用场景描述
                </label>
                <textarea
                  value={formData.application}
                  onChange={(e) => handleInputChange('application', e.target.value)}
                  className="input min-h-[100px]"
                  placeholder="描述您的应用场景，系统将提供更精准的推荐..."
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      开始选型
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置条件
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 提示区域 */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start mb-3">
              <Zap className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">选型提示</h3>
                <p className="text-blue-700 text-sm mt-1">
                  填写必要的技术参数（带*号），系统将匹配最合适的产品
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                电流和极数必须匹配设备需求
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                防护等级应根据使用环境选择
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                详细的应用描述有助于智能推荐
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <div className="flex items-start mb-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">重要提醒</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  选型结果基于SCAME官方技术规范
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                严禁技术参数幻觉
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                不确定的参数请留空或咨询专家
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                最终选型需工程师确认
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">参数说明</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-gray-700">电流规格</dt>
                <dd className="text-gray-600">设备额定电流，必须匹配</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">极数配置</dt>
                <dd className="text-gray-600">2P+E, 3P+E, 3P+N+E等</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">防护等级</dt>
                <dd className="text-gray-600">IP44（防溅）/ IP66（防水）</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* 结果区域 */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  找到 {results.length} 个匹配产品
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                按匹配度排序
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {results.map((product) => (
              <div key={product.partNumber} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-mono font-bold text-lg text-gray-900 mr-4">
                        {product.partNumber}
                      </span>
                      <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {product.series}
                      </span>
                      <div className="ml-4 flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-sm text-green-600 font-medium">
                          匹配度 {(product.matchScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {product.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">电流</div>
                        <div className="font-medium text-gray-900">{product.current}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">极数</div>
                        <div className="font-medium text-gray-900">{product.poles}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">防护</div>
                        <div className="font-medium text-gray-900">{product.protection}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">电压</div>
                        <div className="font-medium text-gray-900">{product.voltage}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-500">价格: </span>
                          <span className="font-bold text-gray-900">{product.price}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">库存: </span>
                          <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {product.stock} 件
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                          查看详情
                        </button>
                        <button className="px-4 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                          加入方案
                        </button>
                      </div>

                      {/* RAG增强的选型解释 */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <SelectionExplanation
                          product={product}
                          applicationContext={formData.application}
                          autoLoad={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">等待选型</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            填写技术参数并点击"开始选型"，系统将匹配最合适的SCAME产品
          </p>
        </div>
      )}
    </div>
  );
};

export default ForwardSelectionPage;