import React, { useState } from 'react';
import { Search, BookOpen, FileText, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

const KnowledgePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const knowledgeCategories = [
    {
      title: '产品手册',
      description: 'SCAME官方产品技术手册，包含完整技术参数',
      icon: BookOpen,
      count: '450份',
      color: 'bg-blue-100 text-blue-600',
      items: ['OPTIMA系列手册', 'EUREKA-HD手册', 'ADVANCE2手册', 'XENIA手册']
    },
    {
      title: '技术培训',
      description: '产品选型、安装、维护培训资料',
      icon: FileText,
      count: '320份',
      color: 'bg-green-100 text-green-600',
      items: ['选型指南', '安装规范', '安全操作', '故障排查']
    },
    {
      title: '编码规则',
      description: 'SCAME产品编码体系和匹配规则',
      icon: HelpCircle,
      count: '180份',
      color: 'bg-purple-100 text-purple-600',
      items: ['编码解析', '替换法则', '兼容性矩阵', '特殊编码']
    },
    {
      title: '应用案例',
      description: '实际工程应用案例和解决方案',
      icon: CheckCircle,
      count: '300个',
      color: 'bg-orange-100 text-orange-600',
      items: ['数据中心', '港口码头', '轨道交通', '工业制造']
    }
  ];

  const recentSearches = [
    'OPTIMA系列IP44和IP66的区别',
    '32A 3P+N+E插头选型',
    '港口码头防水插座要求',
    '机械连锁插座工作原理',
    '大电流产品899系列规格'
  ];

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);

    // 模拟搜索
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          title: 'OPTIMA系列产品技术手册',
          source: 'SCAME官方文档',
          type: 'manual',
          relevance: 0.95,
          excerpt: 'OPTIMA系列产品适用于工业环境，防护等级IP44/IP54，电流范围16-125A。提供多种极数配置和电压选项。',
          link: '#'
        },
        {
          id: 2,
          title: '工业插头插座选型指南',
          source: '技术培训资料',
          type: 'training',
          relevance: 0.88,
          excerpt: '选型时需考虑电流匹配、防护等级、使用环境等因素。插头电流不应超过插座额定电流。',
          link: '#'
        },
        {
          id: 3,
          title: '港口码头供电解决方案',
          source: '应用案例',
          type: 'case',
          relevance: 0.82,
          excerpt: '使用OPTIMA-TOP系列IP66/67产品，抗盐雾腐蚀，适用于户外恶劣环境。需要定期维护检查。',
          link: '#'
        }
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">知识库</h1>
        <p className="text-gray-600 mt-2">
          基于SCAME官方文档和知识图谱的智能检索系统
        </p>
      </div>

      {/* 搜索区域 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">知识检索</h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入技术问题，如：'32A IP44插头选型' 或 'OPTIMA系列技术参数'"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scame-blue focus:border-transparent text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">快速搜索：</span>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(search)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">
              支持自然语言查询，系统将检索相关技术文档
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="px-6 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? '检索中...' : '开始检索'}
            </button>
          </div>
        </div>
      </div>

      {/* 知识分类 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">知识分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {knowledgeCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">{category.count}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                <ul className="space-y-1">
                  {category.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-500 flex items-center">
                      <div className="h-1.5 w-1.5 bg-gray-300 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full py-2 text-center text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                  浏览
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 检索结果 */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  检索结果 ({searchResults.length}条)
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                按相关性排序
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-900 text-lg">{result.title}</span>
                      <span className="ml-4 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {result.type === 'manual' ? '产品手册' :
                         result.type === 'training' ? '培训资料' :
                         result.type === 'case' ? '应用案例' : '其他'}
                      </span>
                      <div className="ml-auto flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-sm text-green-600 font-medium">
                          相关度 {(result.relevance * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{result.source}</div>
                    <p className="text-gray-700 mb-4">{result.excerpt}</p>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 text-scame-blue hover:text-blue-700 font-medium border border-gray-300 rounded-lg hover:border-scame-blue transition-colors">
                        查看原文
                      </button>
                      <button className="px-4 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                        引用此内容
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start mb-4">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">如何使用知识库</h3>
              <p className="text-blue-700 text-sm mt-1">
                获取准确技术信息的最佳实践
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              使用具体的技术参数进行查询，如"32A 3P+N+E IP44"
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              对于复杂问题，可以拆分成多个简单查询
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              查看多个来源的内容，确保信息完整
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              引用技术手册内容时，请注明来源
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">重要提醒</h3>
              <p className="text-yellow-700 text-sm mt-1">
                确保技术信息的准确性
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              所有技术参数必须基于SCAME官方文档
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              注意文档版本和发布时间
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              对于不确定的内容，请咨询SCAME专家
            </li>
            <li className="flex items-start">
              <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              严禁技术参数幻觉和猜测
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;