import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Search, Layers } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">页面未找到</h2>
        <p className="text-gray-600 mb-8">
          您访问的页面不存在或已被移动。请检查URL是否正确，或返回首页继续使用选型工具。
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-scame-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            返回首页
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/forward-selection"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              正向选型
            </Link>
            <Link
              to="/reverse-selection"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Layers className="h-4 w-4 mr-2" />
              反向选型
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">常见页面</h3>
          <div className="space-y-2 text-sm">
            <Link to="/quick-select" className="block text-blue-600 hover:text-blue-800 hover:underline">
              快速选型
            </Link>
            <Link to="/products" className="block text-blue-600 hover:text-blue-800 hover:underline">
              产品浏览
            </Link>
            <Link to="/knowledge" className="block text-blue-600 hover:text-blue-800 hover:underline">
              知识库检索
            </Link>
            <Link to="/help" className="block text-blue-600 hover:text-blue-800 hover:underline">
              帮助文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;