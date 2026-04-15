import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  BarChart3,
  FileText,
  BookOpen,
  FolderTree,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import DocumentUpload from '../components/rag/DocumentUpload';

interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  type: 'manual' | 'training' | 'rule' | 'case' | 'product';
  language: 'zh' | 'en';
  chunks: number;
  size: string;
  lastUpdated: string;
  status: 'active' | 'processing' | 'outdated';
}

const DocumentManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // 模拟知识库文档数据
  const documents: KnowledgeDocument[] = [
    { id: '1', title: 'OPTIMA系列产品技术手册', source: 'SCAME官方文档', type: 'manual', language: 'zh', chunks: 145, size: '15.2MB', lastUpdated: '2025-12-01', status: 'active' },
    { id: '2', title: '工业插头插座选型指南', source: 'SCAME技术培训', type: 'training', language: 'zh', chunks: 89, size: '8.7MB', lastUpdated: '2025-10-15', status: 'active' },
    { id: '3', title: 'SCAME产品编码规则文档', source: 'SCAME编码规则', type: 'rule', language: 'zh', chunks: 67, size: '5.3MB', lastUpdated: '2025-11-20', status: 'active' },
    { id: '4', title: '港口码头供电解决方案', source: '应用案例库', type: 'case', language: 'zh', chunks: 42, size: '3.8MB', lastUpdated: '2025-09-10', status: 'active' },
    { id: '5', title: 'EUREKA-HD系列产品手册', source: 'SCAME官方文档', type: 'manual', language: 'zh', chunks: 132, size: '14.1MB', lastUpdated: '2025-11-05', status: 'outdated' },
    { id: '6', title: 'XENIA系列技术规范', source: 'SCAME官方文档', type: 'manual', language: 'zh', chunks: 98, size: '10.5MB', lastUpdated: '2025-08-22', status: 'active' },
    { id: '7', title: 'ADVANCE2机械连锁插座培训', source: 'SCAME技术培训', type: 'training', language: 'zh', chunks: 76, size: '7.2MB', lastUpdated: '2025-10-30', status: 'active' },
    { id: '8', title: '轨道交通应用案例集', source: '应用案例库', type: 'case', language: 'zh', chunks: 54, size: '4.9MB', lastUpdated: '2025-07-18', status: 'active' },
  ];

  // 知识库统计
  const stats = {
    totalDocuments: 1245,
    totalChunks: 58732,
    sources: 8,
    lastUpdated: '2025-12-01',
  };

  // 文档类型统计
  const typeStats = {
    manual: { count: 450, color: 'bg-blue-100 text-blue-600' },
    training: { count: 320, color: 'bg-green-100 text-green-600' },
    rule: { count: 180, color: 'bg-purple-100 text-purple-600' },
    case: { count: 300, color: 'bg-orange-100 text-orange-600' },
    product: { count: 0, color: 'bg-gray-100 text-gray-600' },
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || doc.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleSelectDocument = (id: string) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.length > 0) {
      // 实际实现中会调用API删除文档
      console.log('删除文档:', selectedDocuments);
      setSelectedDocuments([]);
    }
  };

  const handleUpdateKnowledgeBase = () => {
    // 实际实现中会触发知识库更新
    console.log('更新知识库');
  };

  const getTypeIcon = (type: KnowledgeDocument['type']) => {
    switch (type) {
      case 'manual': return <BookOpen className="h-4 w-4" />;
      case 'training': return <FileText className="h-4 w-4" />;
      case 'rule': return <FolderTree className="h-4 w-4" />;
      case 'case': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: KnowledgeDocument['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> 可用
          </span>
        );
      case 'outdated':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" /> 需更新
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> 处理中
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">知识库管理</h1>
            <p className="text-gray-600 mt-2">
              管理SCAME知识库文档，支持文档上传、处理和检索
            </p>
          </div>
          <button
            onClick={handleUpdateKnowledgeBase}
            className="px-4 py-2 bg-scame-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            更新知识库
          </button>
        </div>
      </div>

      {/* 知识库统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
              <Database className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalDocuments.toLocaleString()}</span>
          </div>
          <div className="text-sm font-medium text-gray-900">文档总数</div>
          <div className="text-sm text-gray-500">来自 {stats.sources} 个来源</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-green-100 text-green-600`}>
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalChunks.toLocaleString()}</span>
          </div>
          <div className="text-sm font-medium text-gray-900">知识块数量</div>
          <div className="text-sm text-gray-500">用于智能检索</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-purple-100 text-purple-600`}>
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{typeStats.manual.count}</div>
              <div className="text-xs text-gray-500">产品手册</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-900">手册文档</div>
          <div className="text-sm text-gray-500">官方技术规格</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-orange-100 text-orange-600`}>
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{typeStats.case.count}</div>
              <div className="text-xs text-gray-500">应用案例</div>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-900">案例文档</div>
          <div className="text-sm text-gray-500">实际工程应用</div>
        </div>
      </div>

      {/* 文档上传区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">上传新文档</h2>
          <p className="text-gray-600 text-sm mt-1">
            上传SCAME技术文档，系统将自动处理并添加到知识库
          </p>
        </div>
        <div className="p-6">
          <DocumentUpload
            onUploadComplete={(docs) => console.log('上传完成:', docs)}
          />
        </div>
      </div>

      {/* 文档管理区域 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">知识库文档</h2>
              <p className="text-gray-600 text-sm mt-1">
                管理已添加到知识库的文档，支持搜索、筛选和批量操作
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {selectedDocuments.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除选中 ({selectedDocuments.length})
                </button>
              )}
            </div>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文档标题或来源..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scame-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-scame-blue"
                >
                  <option value="all">所有类型</option>
                  <option value="manual">产品手册</option>
                  <option value="training">培训资料</option>
                  <option value="rule">编码规则</option>
                  <option value="case">应用案例</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 文档列表 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-scame-blue rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  文档信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  知识块
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleSelectDocument(doc.id)}
                      className="h-4 w-4 text-scame-blue rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${typeStats[doc.type]?.color || 'bg-gray-100'} mr-3`}>
                          {getTypeIcon(doc.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{doc.title}</div>
                          <div className="text-sm text-gray-500">
                            {doc.source} • {doc.size} • {doc.language.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeStats[doc.type]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {doc.type === 'manual' ? '产品手册' :
                       doc.type === 'training' ? '培训资料' :
                       doc.type === 'rule' ? '编码规则' : '应用案例'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{doc.chunks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">知识块</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(doc.status)}
                    <div className="text-xs text-gray-500 mt-1">{doc.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        title="预览"
                        className="p-2 text-gray-400 hover:text-scame-blue hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="下载"
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        title="删除"
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleSelectDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500">未找到匹配的文档</div>
              <div className="text-sm text-gray-400 mt-1">尝试调整搜索条件或上传新文档</div>
            </div>
          )}
        </div>

        {/* 分页和统计 */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              显示 {filteredDocuments.length} 个文档，共 {documents.length} 个
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                上一页
              </button>
              <button className="px-3 py-2 bg-scame-blue text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <span className="px-2">...</span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">12</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 操作指南 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">知识库管理指南</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">文档上传</div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 支持PDF、DOCX、PPTX等格式</li>
              <li>• 自动提取文本和元数据</li>
              <li>• 智能分块和索引建立</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">文档管理</div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 支持批量选择和操作</li>
              <li>• 实时搜索和筛选</li>
              <li>• 文档状态跟踪</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">质量控制</div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• 定期检查文档时效性</li>
              <li>• 手动审核重要文档</li>
              <li>• 版本控制和回滚</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagementPage;