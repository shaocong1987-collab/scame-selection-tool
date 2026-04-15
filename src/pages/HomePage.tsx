import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Search, Layers, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import QuickSelectionCard from '../components/selection/QuickSelectionCard';
import ProductCard from '../components/product/ProductCard';

const HomePage: React.FC = () => {
  const features = [
    {
      title: '正向选型',
      description: '通过技术参数（电流、电压、极数等）查找匹配产品',
      icon: Search,
      color: 'bg-blue-100 text-blue-600',
      href: '/forward-selection'
    },
    {
      title: '反向选型',
      description: '通过产品型号查询完整技术参数和兼容产品',
      icon: Layers,
      color: 'bg-green-100 text-green-600',
      href: '/reverse-selection'
    },
    {
      title: '快速选型',
      description: '根据常见应用场景一键获取推荐产品套装',
      icon: Zap,
      color: 'bg-purple-100 text-purple-600',
      href: '/quick-select'
    },
    {
      title: '知识库',
      description: '查阅SCAME官方技术手册、编码规则和应用案例',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
      href: '/knowledge'
    }
  ];

  const popularProducts = [
    { partNumber: '213.3237', name: '32A 3P+N+E IP44工业插头', series: 'OPTIMA' },
    { partNumber: '513.63532T', name: '63A 2P+E IP44斜式明装插座', series: 'OPTIMA-TOP' },
    { partNumber: '413.3267', name: '32A 3P+N+E IP44暗装插座', series: 'OPTIMA' },
    { partNumber: '560.16832', name: '16A 2P+E IP44机械连锁插座', series: 'ADVANCE2' },
  ];

  const stats = [
    { label: '产品数量', value: '4,585', description: 'SCAME全系列产品' },
    { label: '电流范围', value: '16-800A', description: '覆盖标准到大电流' },
    { label: '防护等级', value: 'IP44-IP69', description: '室内到恶劣环境' },
    { label: '选型准确率', value: '99.9%', description: '基于官方规范' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-scame-blue to-blue-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            SCAME智能选型工具
          </h1>
          <p className="text-xl mb-6 opacity-90">
            基于SCAME官方技术规范的工业电气产品智能选型系统。
            支持正向/反向选型、智能匹配、RAG知识库增强。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/quick-select"
              className="inline-flex items-center px-6 py-3 bg-white text-scame-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Zap className="h-5 w-5 mr-2" />
              开始快速选型
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/forward-selection"
              className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              详细参数选型
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-scame-blue hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-scame-blue transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Selection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">快速选型</h2>
          <Link
            to="/quick-select"
            className="text-scame-blue hover:text-blue-700 font-medium flex items-center"
          >
            更多选项
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickSelectionCard
            title="数据中心"
            description="服务器机柜供电，需要高可靠性和冗余设计"
            current="32A"
            poles="3P+N+E"
            protection="IP44"
            voltage="200-250V"
          />
          <QuickSelectionCard
            title="港口码头"
            description="户外重型设备供电，需要防水防腐蚀"
            current="63A"
            poles="3P+N+E"
            protection="IP66/67"
            voltage="380-415V"
          />
          <QuickSelectionCard
            title="工业制造"
            description="生产线设备供电，需要机械连锁保护"
            current="16A"
            poles="2P+E"
            protection="IP44"
            voltage="200-250V"
          />
        </div>
      </div>

      {/* Popular Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">热门产品</h2>
          <Link
            to="/products"
            className="text-scame-blue hover:text-blue-700 font-medium flex items-center"
          >
            浏览所有产品
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.partNumber} product={product} />
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">为什么选择SCAME选型工具</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            '100%基于SCAME官方技术规范，杜绝参数幻觉',
            '智能编码解析，支持黄金替换法则',
            'RAG知识库增强，复杂查询提供技术依据',
            '多平台集成，支持企微、飞书、钉钉机器人',
            '严格验证IEC 60309标准兼容性',
            '实时更新产品数据和价格信息'
          ].map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;