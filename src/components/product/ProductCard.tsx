import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, ArrowRight } from 'lucide-react';
import { parsePartNumber } from '@/lib/scame/coding';

interface ProductCardProps {
  product: {
    partNumber: string;
    name: string;
    series: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const parsed = parsePartNumber(product.partNumber);
  const isValid = parsed.isValid;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
          <Cpu className={`h-5 w-5 ${isValid ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {product.series}
        </span>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">订货号</div>
        <div className="font-mono text-lg font-bold text-gray-900">
          {product.partNumber}
        </div>
        {!isValid && (
          <div className="text-xs text-red-600 mt-1">
            无效的订货号格式
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2">
        {product.name}
      </h3>

      {isValid ? (
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm">
            <Zap className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">电流:</span>
            <span className="font-medium text-gray-900 ml-1">{parsed.current}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="h-4 w-4 flex items-center justify-center text-gray-400 mr-2">
              <span className="text-xs font-bold">P</span>
            </div>
            <span className="text-gray-600">极数:</span>
            <span className="font-medium text-gray-900 ml-1">{parsed.poles}</span>
          </div>
          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">防护:</span>
            <span className="font-medium text-gray-900 ml-1">{parsed.protection}</span>
          </div>
          {parsed.voltage && (
            <div className="flex items-center text-sm">
              <div className="h-4 w-4 flex items-center justify-center text-gray-400 mr-2">
                <span className="text-xs font-bold">V</span>
              </div>
              <span className="text-gray-600">电压:</span>
              <span className="font-medium text-gray-900 ml-1">{parsed.voltage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="text-sm text-gray-500">
            无法解析技术参数，请检查订货号格式
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          to={`/products/${product.partNumber}`}
          className="flex items-center text-scame-blue hover:text-blue-700 font-medium text-sm"
        >
          查看详情
          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="text-xs text-gray-500">
          {parsed.category}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;