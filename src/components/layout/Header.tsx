import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-scame-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SCAME选型工具</h1>
                <p className="text-xs text-gray-500">智能工业电气选型系统</p>
              </div>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="搜索产品型号、技术参数或应用场景..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scame-blue focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">工程师</span>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="搜索产品型号、技术参数或应用场景..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scame-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;