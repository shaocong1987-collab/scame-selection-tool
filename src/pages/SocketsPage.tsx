import React from 'react';
import { Filter, Search, Grid, List, Power, Zap, Shield, Cpu } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const SocketsPage: React.FC = () => {
  // 模拟产品数据 - 只包含首位数字为4和5的产品（暗装/明装插座）
  const products = [
    { partNumber: '413.3267', name: '32A 3P+N+E IP44暗装插座', series: 'OPTIMA' },
    { partNumber: '423.3267', name: '32A 3P+N+E IP44暗装直式插座', series: 'OPTIMA' },
    { partNumber: '513.63532T', name: '63A 2P+E IP44斜式明装插座', series: 'OPTIMA-TOP' },
    { partNumber: '560.16832', name: '16A 2P+E IP44机械连锁插座', series: 'ADVANCE2' },
    { partNumber: '422.16016', name: '16A 2P+E IP44暗装插座', series: 'OPTIMA' },
    { partNumber: '525.6367', name: '63A 3P+N+E IP44明装插座', series: 'EUREKA-HD' },
    { partNumber: '415.1667', name: '16A 3P+E IP44暗装插座', series: 'OPTIMA' },
    { partNumber: '518.63532', name: '63A 3P+N+E IP44明装插座', series: 'OPTIMA-TOP' },
  ];

  const series = ['全部', 'OPTIMA', 'OPTIMA-TOP', 'EUREKA-HD', 'ADVANCE2', 'SAFE-IN'];


  // 计算插座统计信息
  const socketStats = {
    total: products.length,
    currentTypes: ['16A', '32A', '63A', '125A', '160A'],
    poleTypes: ['2P+E', '3P+E', '3P+N+E'],
    protectionTypes: ['IP44/IP54', 'IP66/67/69'],
    seriesTypes: ['OPTIMA', 'OPTIMA-TOP', 'EUREKA-HD', 'ADVANCE2'],
    socketTypes: ['暗装插座', '明装插座', '机械连锁插座']
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-2">
          <Power className="h-8 w-8 text-industrial-accent-electric mr-3" />
          <h1 className="text-3xl font-bold text-industrial-light">工业插座库</h1>
        </div>
        <p className="text-industrial-light-gray mt-2">
          SCAME工业插座系列产品，编码首位数字为4和5，适用于工业环境供电需求
        </p>
      </div>

      {/* 产品类别标识 */}
      <div className="bg-industrial-dark rounded-industrial-lg border border-industrial-dark-steel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-1.5 bg-industrial-accent-electric/10 border border-industrial-accent-electric rounded-industrial">
              <Cpu className="h-4 w-4 text-industrial-accent-electric mr-2" />
              <span className="text-industrial-accent-electric text-sm font-medium">首位数字：4, 5</span>
            </div>
            <div className="text-industrial-light-gray text-sm">
              产品类别：
              <span className="font-medium text-industrial-light ml-1">输出端/工业插座</span>
              <span className="text-industrial-light-gray mx-2">•</span>
              <span className="text-industrial-light-gray">4XX = 暗装插座</span>
              <span className="text-industrial-light-gray mx-2">•</span>
              <span className="text-industrial-light-gray">5XX = 明装插座</span>
            </div>
          </div>
          <div className="text-industrial-light-gray text-sm">
            编码规则：<span className="font-mono">4XX.XXXXX / 5XX.XXXXX</span>
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
                placeholder="搜索插座型号、安装方式、电流规格..."
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
                <option className="bg-industrial-dark">安装方式</option>
                <option className="bg-industrial-dark">暗装 (4XX)</option>
                <option className="bg-industrial-dark">明装 (5XX)</option>
                <option className="bg-industrial-dark">机械连锁</option>
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
          {['暗装插座', '明装插座', '机械连锁', 'OPTIMA', 'EUREKA-HD', 'IP44', 'IP66', '16A', '32A', '63A', '2P+E', '3P+E', '3P+N+E'].map(tag => (
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{socketStats.total}</div>
          <div className="text-sm text-industrial-light-gray">插座型号总数</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{socketStats.seriesTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">产品系列</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{socketStats.socketTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">安装类型</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{socketStats.currentTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">电流规格</div>
        </div>
        <div className="bg-industrial-dark-gray p-4 rounded-industrial-lg border border-industrial-dark-steel">
          <div className="text-2xl font-bold text-industrial-light">{socketStats.protectionTypes.length}</div>
          <div className="text-sm text-industrial-light-gray">防护等级</div>
        </div>
      </div>

      {/* 技术参数说明 */}
      <div className="bg-industrial-dark rounded-industrial-lg border border-industrial-dark-steel p-5">
        <div className="flex items-center mb-4">
          <Zap className="h-5 w-5 text-industrial-accent-electric mr-2" />
          <h3 className="text-industrial-light font-medium">插座选型要点</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">安装方式</div>
            <div className="text-industrial-light text-sm">暗装（墙面/配电箱） vs 明装（表面/设备）根据现场需求选择</div>
          </div>
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">电流匹配</div>
            <div className="text-industrial-light text-sm">插座电流 ≥ 插头电流，需匹配供电设备容量</div>
          </div>
          <div>
            <div className="text-industrial-light-gray text-sm mb-2">安全要求</div>
            <div className="text-industrial-light text-sm">机械连锁插座提供防误操作保护，适合高危环境</div>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-industrial-light">插座产品列表</h2>
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
          工业插座需要配套的插头和连接器使用。根据「黄金匹配法则」，插座（4XX/5XX）必须匹配：
        </div>
        <ul className="mt-3 space-y-2 text-industrial-light-gray text-sm">
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            工业插头（2XX）- 电流和极数必须完全匹配
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            移动连接器（3XX）- 用于设备端灵活连接
          </li>
          <li className="flex items-start">
            <div className="h-1.5 w-1.5 bg-industrial-accent-electric rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
            接线盒/配电箱- 暗装插座需要配套安装盒
          </li>
        </ul>
        <div className="mt-4 p-3 bg-industrial-dark-gray rounded-industrial border border-industrial-dark-steel">
          <div className="text-industrial-light font-medium text-sm mb-1">安全警告</div>
          <div className="text-industrial-light-gray text-sm">
            严禁不同电流规格的插头和插座混用！32A插座不能插入16A插头，反之亦然。
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocketsPage;