import React from 'react';
import { Filter, Search, Grid, List, Plug, Zap, Shield, Cpu } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const PlugsPage: React.FC = () => {
  // 模拟产品数据 - 只包含首位数字为2的产品（工业插头）
  const products = [
    { partNumber: '213.3237', name: '32A 3P+N+E IP44工业插头', series: 'OPTIMA' },
    { partNumber: '221.1630', name: '16A 3P+E IP44 UL认证插头', series: 'EUREKA-HD' },
    { partNumber: '218.1632', name: '16A 2P+E IP44工业插头', series: 'OPTIMA' },
    { partNumber: '226.3267', name: '32A 3P+N+E IP44 UL认证插头', series: 'EUREKA-HD' },
    { partNumber: '214.1616', name: '16A 2P+E IP44紧凑型插头', series: 'XENIA' },
    { partNumber: '228.6367', name: '63A 3P+N+E IP44工业插头', series: 'OPTIMA' },
    { partNumber: '227.6316', name: '63A 2P+E IP44紧凑型插头', series: 'XENIA' },
    { partNumber: '223.16032', name: '160A 2P+E IP44大电流插头', series: 'EUREKA-HD' },
  ];

  const series = ['全部', 'OPTIMA', 'EUREKA-HD', 'XENIA'];


  // 计算插头统计信息
  const plugStats = {
    total: products.length,
    currentTypes: ['16A', '32A', '63A', '125A', '160A'],
    poleTypes: ['2P+E', '3P+E', '3P+N+E'],
    protectionTypes: ['IP44/IP54', 'IP66/67/69'],
    seriesTypes: ['OPTIMA', 'EUREKA-HD', 'XENIA']
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-2">
          <Plug className="h-8 w-8 text-industrial-accent-electric mr-3" />
          <h1 className="text-3xl font-bold text-industrial-light">工业插头库</h1>
        </div>
        <p className="text-industrial-light-gray mt-2">
          SCAME工业插头系列产品，编码首位数字为2，适用于工业环境连接需求
        </p>
      </div>

      {/* 产品类别标识 */}
      <div className="bg-industrial-dark rounded-industrial-lg border border-industrial-dark-steel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-1.5 bg-industrial-accent-electric/10 border border-industrial-accent-electric rounded-industrial">
              <Cpu className="h-4 w-4 text-industrial-accent-electric mr-2" />
              <span className="text-industrial-accent-electric text-sm font-medium">首位数字：2</span>
            </div>
            <div className="text-industrial-light-gray text-sm">
              产品类别：<span className="font-medium text-industrial-light">输入端/工业插头/器具插座</span>
            </div>
          </div>
          <div className="text-industrial-light-gray text-sm">
            编码规则：<span className="font-mono">2XX.XXXXX</span>
          </div>
        </div>
      </div>

      {/* 筛选工具栏 */}
      <div className="bg-industrial-dark-gray rounded-industrial-lg border border-industrial-dark-steel p-6 shadow-industrial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-industrial-light-gray" />
              <input
                type="search"
                placeholder="搜索插头型号、电流规格、防护等级..."
                className="w-full pl-10 pr-4 py-2 bg-industrial-dark border border-industrial-dark-steel rounded-industrial text-industrial-light placeholder-industrial-light-gray focus:outline-none focus:ring-2 focus:ring-industrial-accent-electric focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-industrial-light-gray" />
              <select className="bg-industrial-dark border border-industrial-dark-steel rounded-industrial px-3 py-2 text-industrial-light focus:outline-none focus:ring-2 focus:ring-industrial-accent-electric focus:border-transparent transition-colors">
                <option className="bg-industrial-dark">产品系列</option>
                {series.map(s => (
                  <option key={s} value={s} className="bg-industrial-dark">{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select className="bg-industrial-dark border border-industrial-dark-steel rounded-industrial px-3 py-2 text-industrial-light focus:outline-none focus:ring-2 focus:ring-industrial-accent-electric focus:border-transparent transition-colors">
                <option className="bg-industrial-dark">电流规格</option>
                <option className="bg-industrial-dark">16A</option>
                <option className="bg-industrial-dark">32A</option>
                <option className="bg-industrial-dark">63A</option>
                <option className="bg-industrial-dark">125A</option>
                <option className="bg-industrial-dark">160A+</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border-l border-industrial-dark-steel pl-4">
              <button className="p-2 rounded-industrial border border-industrial-dark-steel hover:bg-industrial-dark transition-colors">
                <Grid className="h-5 w-5 text-industrial-light-gray" />
              </button>
              <button className="p-2 rounded-industrial border border-industrial-accent-electric bg-industrial-accent-electric/10">
                <List className="h-5 w-5 text-industrial-accent-electric" />
              </button>
            </div>
          </div>
        </div>

        {/* 快速筛选标签 */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['OPTIMA', 'EUREKA-HD', 'IP44', 'IP66', '16A', '32A', '63A', '2P+E', '3P+E', '3P+N+E'].map(tag => (
            <button
              key={tag}
              className="px-3 py-1.5 text-sm border border-industrial-dark-steel rounded-full text-industrial-light-gray hover:border-industrial-accent-electric hover:text-industrial-accent-electric transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 产品统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{plugStats.total}</div>
          <div className="text-sm text-industrial-light-gray">插头型号总数</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{plugStats.seriesTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">产品系列</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{plugStats.currentTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">电流规格</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{plugStats.protectionTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">防护等级</div>
        </div>
      </div>

      {/* 技术参数说明 */}
      <div className="bg-industrial-dark rounded-industrial-lg border border-industrial-dark-steel p-5">
        <div className="flex items-center mb-4">
          <Zap className="h-5 w-5 text-industrial-accent-electric mr-2" />
          <h3 className="text-industrial-light font-medium">插头选型要点</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">电流匹配</div>
            <div className="text-industrial-light text-sm">插头电流 ≤ 插座电流，必须匹配设备需求</div>
          </div>
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">极数配置</div>
            <div className="text-industrial-light text-sm">2P+E, 3P+E, 3P+N+E 必须与插座完全匹配</div>
          </div>
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">防护等级</div>
            <div className="text-industrial-light text-sm">IP44（防溅）/ IP66（防水）根据使用环境选择</div>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-industrial-light">插头产品列表</h2>
          <div className="text-sm text-industrial-light-gray">
            显示 1-{products.length} 个产品，共 {products.length} 个
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.partNumber} product={product} />
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-8 flex items-center justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-industrial-dark-steel rounded-industrial text-industrial-light-gray hover:bg-industrial-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <button className="px-3 py-2 bg-industrial-accent-electric text-industrial-light rounded-industrial">1</button>
            <span className="px-2 text-industrial-light-gray">共 1 页</span>
            <button className="px-3 py-2 border border-industrial-dark-steel rounded-industrial text-industrial-light-gray hover:bg-industrial-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              下一页
            </button>
          </nav>
        </div>
      </div>

      {/* 配套建议 */}
      <div className="bg-industrial-dark rounded-industrial-lg border border-industrial-dark-steel p-5">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-industrial-accent-safety mr-2" />
          <h3 className="text-industrial-light font-medium">配套建议</h3>
        </div>
        <div className="text-industrial-light text-sm">
          工业插头需要配套的插座和连接器使用。根据「黄金替换法则」，插头（2XX）可以替换为：
        </div>
        <ul className="mt-3 space-y-2 text-industrial-light-gray text-sm">
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            移动连接器（3XX） - 用于设备端连接
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            暗装插座（4XX） - 用于墙面或配电箱安装
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            明装插座（5XX） - 用于表面安装或工业设备
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlugsPage;