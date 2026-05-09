import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Cpu, ArrowRight, ExternalLink, Download } from 'lucide-react';
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

  // 生成产品链接和技术单页链接
  const generateProductLinks = (partNumber: string) => {
    const productUrl = `https://www.scame.com/web/scame-global/p/${partNumber}`;
    const techsheetUrl = `https://techsheet.scame.com/infodata/en/${partNumber}.pdf?_gl=1*v4w7d1*_gcl_au*MTAyOTU5NzcuMTc3MjgwMjQxNy4xNjg2ODUwMzQ0LjE3NzM4ODUxOTMuMTc3Mzg4NTIxNg`;
    return { productUrl, techsheetUrl };
  };

  const { productUrl, techsheetUrl } = generateProductLinks(product.partNumber);

  return (
    <div className="bg-white rounded-[28px] border border-black/10 p-6 hover:shadow-industrial-lg transition-all group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${isValid ? 'bg-industrial-accent-safety/10' : 'bg-industrial-accent-danger/10'}`}>
          <Cpu className={`h-5 w-5 ${isValid ? 'text-industrial-accent-safety' : 'text-industrial-accent-danger'}`} />
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-[#f5f5f7] text-[#6e6e73] rounded border border-black/10">
          {product.series}
        </span>
      </div>

      <div className="mb-4">
        <div className="text-sm text-[#6e6e73] mb-1">订货号</div>
        <div className="font-mono text-lg font-bold text-[#111111]">
          {product.partNumber}
        </div>
        {!isValid && (
          <div className="text-xs text-industrial-accent-danger mt-1">
            无效的订货号格式
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-[#111111] mb-3 line-clamp-2">
        {product.name}
      </h3>

      {isValid ? (
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm">
            <Zap className="h-4 w-4 text-[#6e6e73] mr-2" />
            <span className="text-[#6e6e73]">电流:</span>
            <span className="font-medium text-[#111111] ml-1">{parsed.current}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="h-4 w-4 flex items-center justify-center text-[#6e6e73] mr-2">
              <span className="text-xs font-bold text-[#6e6e73]">P</span>
            </div>
            <span className="text-[#6e6e73]">极数:</span>
            <span className="font-medium text-[#111111] ml-1">{parsed.poles}</span>
          </div>
          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 text-[#6e6e73] mr-2" />
            <span className="text-[#6e6e73]">防护:</span>
            <span className="font-medium text-[#111111] ml-1">{parsed.protection}</span>
          </div>
          {parsed.voltage && (
            <div className="flex items-center text-sm">
              <div className="h-4 w-4 flex items-center justify-center text-[#6e6e73] mr-2">
                <span className="text-xs font-bold text-[#6e6e73]">V</span>
              </div>
              <span className="text-[#6e6e73]">电压:</span>
              <span className="font-medium text-[#111111] ml-1">{parsed.voltage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="text-sm text-[#6e6e73]">
            无法解析技术参数，请检查订货号格式
          </div>
        </div>
      )}

      {/* 产品链接区域 */}
      <div className="flex items-center justify-between pt-4 border-t border-black/10">
        <div className="flex items-center space-x-3">
          <Link
            to={`/products/${product.partNumber}`}
            className="flex items-center text-industrial-accent-electric hover:text-industrial-blue-light font-medium text-sm"
          >
            查看详情
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 产品官网链接 */}
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#6e6e73] hover:text-industrial-accent-electric text-sm transition-colors"
            title="查看产品官网"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            官网
          </a>

          {/* 技术单页下载 */}
          <a
            href={techsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-[#6e6e73] hover:text-industrial-accent-electric text-sm transition-colors"
            title="下载技术单页PDF"
          >
            <Download className="h-3 w-3 mr-1" />
            技术单
          </a>
        </div>

        <div className="text-xs text-[#6e6e73]">
          {parsed.category}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;