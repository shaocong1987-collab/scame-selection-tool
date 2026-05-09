import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';

const navigation = [
  { name: '首页', href: '/' },
  { name: '快速选型', href: '/quick-select' },
  { name: '正向查询', href: '/forward-selection' },
  { name: '反向选型', href: '/reverse-selection' },
  { name: '产品库', href: '/products' },
  { name: '知识库', href: '/knowledge' },
];

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/78 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-sm font-semibold text-white shadow-sm transition group-hover:scale-105">
              S
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-[#111111]">SCAME Selector</div>
              <div className="hidden text-xs text-[#86868b] sm:block">Industrial Intelligence</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#424245] hover:bg-black/[0.04] hover:text-[#111111]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-2 text-sm text-[#86868b] md:flex">
              <Search className="h-4 w-4" />
              <span>型号 / 参数 / 场景</span>
            </div>
            <Link
              to="/reverse-selection"
              className="inline-flex items-center rounded-full bg-[#0066cc] px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#004a99] hover:shadow-lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              开始选型
            </Link>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-3 lg:hidden">
          {navigation.slice(0, 5).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isActive ? 'bg-[#111111] text-white' : 'bg-[#f5f5f7] text-[#424245]'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
