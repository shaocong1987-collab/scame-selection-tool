import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Search,
  Layers,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  Plug,
  Square,
  Cpu,
  Database,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '快速选型', href: '/quick-select', icon: Zap },
    { name: '正向选型', href: '/forward-selection', icon: Search },
    { name: '反向选型', href: '/reverse-selection', icon: Layers },
    { name: '产品浏览', href: '/products', icon: Cpu },
    { name: '插头库', href: '/plugs', icon: Plug },
    { name: '插座库', href: '/sockets', icon: Square },
    { name: '知识库检索', href: '/knowledge', icon: FileText },
    { name: '文档管理', href: '/knowledge/management', icon: Database },
    { name: '帮助', href: '/help', icon: HelpCircle },
    { name: '设置', href: '/settings', icon: Settings },
  ];

  const scameSeries = [
    'OPTIMA',
    'OPTIMA-TOP',
    'EUREKA-HD',
    'XENIA',
    'ADVANCE2',
    'SAFE-IN',
    'ADVANCE-GRP',
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-gray-200 bg-white">
      <nav className="flex-1 px-4 py-6 space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          导航菜单
        </h3>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-scame-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}

        <div className="pt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            SCAME产品系列
          </h3>
          <div className="space-y-1">
            {scameSeries.map((series) => (
              <button
                key={series}
                className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-scame-blue mr-3"></div>
                {series}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            技术参数
          </h3>
          <div className="space-y-2 px-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">电流:</span> 16A - 800A
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">电压:</span> 24V - 1000V
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">防护等级:</span> IP44 - IP69
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">极数:</span> 2P+E - 4P+N+E
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-scame-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">SCAME Expert</p>
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;