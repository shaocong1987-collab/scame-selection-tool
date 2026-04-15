import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface QuickSelectionCardProps {
  title: string;
  description: string;
  current: string;
  poles: string;
  protection: string;
  voltage: string;
}

const QuickSelectionCard: React.FC<QuickSelectionCardProps> = ({
  title,
  description,
  current,
  poles,
  protection,
  voltage,
}) => {
  const handleQuickSelect = () => {
    // 这里实现快速选型逻辑
    console.log('快速选型:', { title, current, poles, protection, voltage });
    // 在实际应用中，这里会导航到选型结果页面或打开模态框
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Zap className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
          推荐
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">电流</span>
          <span className="font-medium text-gray-900">{current}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">极数配置</span>
          <span className="font-medium text-gray-900">{poles}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">防护等级</span>
          <span className="font-medium text-gray-900">{protection}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">电压范围</span>
          <span className="font-medium text-gray-900">{voltage}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleQuickSelect}
          className="flex items-center text-scame-blue hover:text-blue-700 font-medium text-sm"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          立即选型
        </button>
        <Link
          to="/quick-select"
          className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
        >
          详细设置
          <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default QuickSelectionCard;