import React from 'react';
import { Filter, Search, Grid, List } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

const ProductsPage: React.FC = () => {
  // 模拟产品数据
  const products = [
    { partNumber: '213.3237', name: '32A 3P+N+E IP44工业插头', series: 'OPTIMA' },
    { partNumber: '513.63532T', name: '63A 2P+E IP44斜式明装插座', series: 'OPTIMA-TOP' },
    { partNumber: '413.3267', name: '32A 3P+N+E IP44暗装插座', series: 'OPTIMA' },
    { partNumber: '560.16832', name: '16A 2P+E IP44机械连锁插座', series: 'ADVANCE2' },
    { partNumber: '221.1630', name: '16A 3P+E IP44 UL认证插头', series: 'EUREKA-HD' },
    { partNumber: '899.AL2DE335', name: '160A 3P+E IP67大电流插座', series: 'OPTIMA-METAL' },
    { partNumber: '313.3237', name: '32A 3P+N+E IP44移动连接器', series: 'OPTIMA' },
    { partNumber: '423.3267', name: '32A 3P+N+E IP44暗装直式插座', series: 'OPTIMA' },
  ];

  const series = ['全部', 'OPTIMA', 'OPTIMA-TOP', 'EUREKA-HD', 'XENIA', 'ADVANCE2', 'SAFE-IN'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">产品库</h1>
        <p className="text-gray-600 mt-2">
          浏览所有SCAME工业电气产品
        </p>
      </div>

      {/* 筛选工具栏 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="搜索产品型号、名称或技术参数..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scame-blue focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-scame-blue">
                <option>产品系列</option>
                {series.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-scame-blue">
                <option>电流规格</option>
                <option>16A</option>
                <option>32A</option>
                <option>63A</option>
                <option>125A</option>
                <option>160A+</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <Grid className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-scame-blue bg-blue-50">
                <List className="h-5 w-5 text-scame-blue" />
              </button>
            </div>
          </div>
        </div>

        {/* 快速筛选标签 */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['插头', '插座', '连接器', 'IP44', 'IP66', '16A', '32A', '63A'].map(tag => (
            <button
              key={tag}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:border-scame-blue hover:text-scame-blue transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 产品统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">4,585</div>
          <div className="text-sm text-gray-600">产品总数</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">产品系列</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600">电流规格</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">防护等级</div>
        </div>
      </div>

      {/* 产品列表 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">产品列表</h2>
          <div className="text-sm text-gray-500">
            显示 1-8 个产品，共 4,585 个
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
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              上一页
            </button>
            <button className="px-3 py-2 bg-scame-blue text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">48</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              下一页
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;