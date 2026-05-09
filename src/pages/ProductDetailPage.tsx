import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, ImageOff, Link2, PackageSearch } from 'lucide-react';
import {
  findCompanionProducts,
  findDerivativeProducts,
  findProductByCode,
  formatPrice,
  getDisplayName,
  loadSampleProducts,
  ScameProduct,
} from '@/lib/scame/sampleProducts';

const FIELD_GROUPS: Array<{ title: string; fields: Array<keyof ScameProduct> }> = [
  {
    title: '基础信息',
    fields: ['product_code', '产品描述', '产品类型', '系列', '子系列', '产品大类', '面价匹配状态'],
  },
  {
    title: '技术参数',
    fields: ['电流', '极数_标准化', '频率', '时钟位_h', '电压', '防护等级', '电缆范围'],
  },
  {
    title: '结构与安装',
    fields: ['安装方式', '结构方向', '安装尺寸', '端子类型', '功能配置', '外观标签'],
  },
  {
    title: '来源追溯',
    fields: ['来源工作表', '来源行号', '来源列描述', '来源记录数', '原始Poles', '原始极数'],
  },
];

const ProductDetailPage: React.FC = () => {
  const { partNumber } = useParams<{ partNumber: string }>();
  const [products, setProducts] = useState<ScameProduct[]>([]);
  const [product, setProduct] = useState<ScameProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSampleProducts()
      .then((loadedProducts) => {
        setProducts(loadedProducts);
        setProduct(findProductByCode(loadedProducts, decodeURIComponent(partNumber ?? '')) ?? null);
      })
      .finally(() => setLoading(false));
  }, [partNumber]);

  if (loading) {
    return <div className="text-[#6e6e73]">正在加载产品详情...</div>;
  }

  if (!product) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-[#111111]">
        <Link to="/forward-selection" className="mb-4 inline-flex items-center text-sm text-[#0066cc]">
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回正向查询
        </Link>
        <h1 className="text-2xl font-bold">未找到该测试型号</h1>
        <p className="mt-2 text-[#6e6e73]">当前 MVP 只接入 47 个测试样本。</p>
      </div>
    );
  }

  const companions = findCompanionProducts(products, product);
  const derivatives = findDerivativeProducts(products, product);

  return (
    <div className="space-y-5 text-[#111111]">
      <Link to="/forward-selection" className="inline-flex items-center text-sm text-[#0066cc] hover:text-[#004a99]">
        <ArrowLeft className="mr-1 h-4 w-4" />
        返回正向查询
      </Link>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-industrial">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f7]">
            {product.产品图片链接 ? (
              <img src={product.产品图片链接} alt={product.product_code} className="h-full w-full object-contain p-4" />
            ) : (
              <ImageOff className="h-12 w-12 text-[#6e6e73]" />
            )}
          </div>
          <div className="mt-4 space-y-3">
            <a
              href={product.产品技术说明书链接}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-2xl bg-industrial-accent-electric px-4 py-2 text-sm font-semibold text-white transition hover:bg-industrial-blue-light hover:text-slate-950"
            >
              <FileText className="mr-2 h-4 w-4" />
              技术说明书
            </a>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">
              面价：<span className="font-semibold">{formatPrice(product)}</span>
              <br />
              MOQ：{product.最小起订量 || '未提供'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-3xl font-bold text-[#0066cc]">{product.product_code}</p>
              <h1 className="mt-3 text-xl font-semibold text-[#111111]">{getDisplayName(product)}</h1>
            </div>
            <span className="rounded-full border border-black/10 bg-[#f5f5f7] px-3 py-1 text-sm text-[#6e6e73]">
              {product.系列 || '未标注系列'}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              ['产品大类', product.产品大类],
              ['电流', product.电流],
              ['极数', product.极数_标准化],
              ['时钟位', product.时钟位_h],
              ['电压', product.电压],
              ['IP', product.防护等级],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-3">
                <p className="text-xs text-[#6e6e73]">{label}</p>
                <p className="mt-1 font-semibold text-[#111111]">{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {FIELD_GROUPS.map((group) => (
            <div key={group.title} className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
              <h2 className="mb-4 font-semibold text-[#111111]">{group.title}</h2>
              <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {group.fields.map((field) => (
                  <div key={field} className="rounded bg-[#f5f5f7] px-3 py-2">
                    <dt className="text-xs text-[#6e6e73]">{field}</dt>
                    <dd className="mt-1 break-words text-sm text-[#111111]">{product[field] || '-'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <aside className="space-y-5">
          <RelatedPanel title="配套推荐" icon={Link2} products={companions} emptyText="暂无严格参数一致的配套型号。" />
          <RelatedPanel title="衍生型号" icon={PackageSearch} products={derivatives} emptyText="暂无同前缀衍生型号。" />
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800">
            配套推荐严格校验电流、极数、电压、时钟位和 IP；IP 不做向上兼容替代。
          </div>
        </aside>
      </section>
    </div>
  );
};

interface RelatedPanelProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  products: ScameProduct[];
  emptyText: string;
}

const RelatedPanel: React.FC<RelatedPanelProps> = ({ title, icon: Icon, products, emptyText }) => (
  <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-industrial">
    <div className="mb-3 flex items-center gap-2 font-semibold text-[#111111]">
      <Icon className="h-4 w-4 text-[#0066cc]" />
      {title}
    </div>
    <div className="space-y-2">
      {products.length === 0 ? (
        <p className="text-sm text-[#6e6e73]">{emptyText}</p>
      ) : (
        products.map((item) => (
          <Link
            key={item.product_code}
            to={`/products/${encodeURIComponent(item.product_code)}`}
            className="block rounded bg-[#f5f5f7] px-3 py-2 text-sm text-[#6e6e73] hover:text-[#004a99]"
          >
            <span className="font-mono text-[#0066cc]">{item.product_code}</span>
            <ExternalLink className="ml-1 inline h-3 w-3" />
            <p className="mt-1 line-clamp-2">{item.产品描述}</p>
          </Link>
        ))
      )}
    </div>
  </div>
);

export default ProductDetailPage;
