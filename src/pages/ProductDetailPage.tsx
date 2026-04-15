import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Zap, Shield, Cpu } from 'lucide-react';
import SelectionExplanation from '@/components/rag/SelectionExplanation';

const ProductDetailPage: React.FC = () => {
  const { partNumber } = useParams<{ partNumber: string }>();

  // 模拟产品数据
  const product = {
    partNumber: partNumber || '213.3237',
    name: '32A 3P+N+E IP44工业插头',
    series: 'OPTIMA',
    current: '32A',
    poles: '3P+N+E',
    protection: 'IP44/IP54',
    voltage: '200-250V',
    price: '¥1,280',
    stock: 45,
    weight: '0.85kg',
    material: '聚碳酸酯 + 热塑性弹性体',
    temperature: '-25°C ~ +40°C',
    certification: 'CE, RoHS, IP44',
    description: 'OPTIMA系列工业插头，适用于工业环境中的电气连接，提供可靠的IP44防护等级，防止灰尘和水溅。',
  };

  return (
    <div className="space-y-8">
      {/* 返回按钮 */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回产品列表
        </Link>
      </div>

      {/* 产品标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-2 flex items-center space-x-4">
          <span className="font-mono text-xl text-gray-700">{product.partNumber}</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {product.series}
          </span>
          <div className="text-sm text-gray-500">
            库存: <span className="font-medium text-green-600">{product.stock} 件</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：技术参数 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 技术参数卡片 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <Cpu className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">技术参数</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">电气参数</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">电流规格</dt>
                    <dd className="font-medium text-gray-900">{product.current}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">极数配置</dt>
                    <dd className="font-medium text-gray-900">{product.poles}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">电压范围</dt>
                    <dd className="font-medium text-gray-900">{product.voltage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">防护等级</dt>
                    <dd className="font-medium text-gray-900">{product.protection}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">物理参数</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">重量</dt>
                    <dd className="font-medium text-gray-900">{product.weight}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">材料</dt>
                    <dd className="font-medium text-gray-900">{product.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">工作温度</dt>
                    <dd className="font-medium text-gray-900">{product.temperature}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">认证</dt>
                    <dd className="font-medium text-gray-900">{product.certification}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">产品描述</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>

          {/* RAG增强解释 */}
          <div>
            <SelectionExplanation
              product={{
                partNumber: product.partNumber,
                name: product.name,
                series: product.series,
                current: product.current,
                poles: product.poles,
                protection: product.protection,
                voltage: product.voltage,
              }}
              autoLoad={true}
            />
          </div>
        </div>

        {/* 右侧：操作面板 */}
        <div className="space-y-6">
          {/* 价格和库存 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">价格与库存</h3>
              </div>
              <div className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                有货
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{product.price}</div>
                <div className="text-sm text-gray-500 mt-1">含税价格</div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="w-full py-3 bg-scame-blue text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  加入购物车
                </button>
                <button className="w-full mt-3 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  加入方案对比
                </button>
              </div>
            </div>
          </div>

          {/* 应用提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start mb-3">
              <Zap className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">应用建议</h3>
                <p className="text-blue-700 text-sm mt-1">
                  适合以下应用场景
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                工业车间设备连接
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                户外临时电力供应
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                建筑工地用电设备
              </li>
            </ul>
          </div>

          {/* 安全提醒 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <div className="flex items-start mb-3">
              <Shield className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900">安全提醒</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  安装和使用注意事项
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                必须由专业电工安装
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr=2 flex-shrink-0"></div>
                确保连接前断电操作
              </li>
              <li className="flex items-start">
                <div className="h-1.5 w-1.5 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                定期检查插头插座状态
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;