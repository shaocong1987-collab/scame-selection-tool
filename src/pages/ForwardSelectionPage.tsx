import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, ExternalLink, Loader2, Search, Send, ShieldCheck } from 'lucide-react';
import {
  findCompanionProducts,
  findDerivativeProducts,
  findProductByCode,
  formatPrice,
  getDisplayName,
  getFieldOptions,
  getMissingParams,
  loadSampleProducts,
  parseUserQuery,
  ScameProduct,
  searchByConfirmedParams,
  SelectionParams,
} from '@/lib/scame/sampleProducts';

const FIELD_LABELS: Record<keyof SelectionParams, string> = {
  productType: '产品形式',
  current: '电流',
  poles: '极数',
  clock: '时钟位 h',
  voltage: '电压',
  protection: 'IP',
};

const ForwardSelectionPage: React.FC = () => {
  const [products, setProducts] = useState<ScameProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('418.6367');
  const [messages, setMessages] = useState<string[]>([
    '请输入型号，或描述产品形式、电流、极数、时钟位、电压和 IP。参数不完整时我只追问，不输出型号。',
  ]);
  const [draftParams, setDraftParams] = useState<Partial<SelectionParams>>({});
  const [selectedProduct, setSelectedProduct] = useState<ScameProduct | null>(null);
  const [results, setResults] = useState<ScameProduct[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    loadSampleProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const options = useMemo(
    () => ({
      productType: getFieldOptions(products, 'productType'),
      current: getFieldOptions(products, 'current'),
      poles: getFieldOptions(products, 'poles'),
      clock: getFieldOptions(products, 'clock'),
      voltage: getFieldOptions(products, 'voltage'),
      protection: getFieldOptions(products, 'protection'),
    }),
    [products],
  );

  const missing = getMissingParams(draftParams);
  const companions = selectedProduct ? findCompanionProducts(products, selectedProduct) : [];
  const derivatives = selectedProduct ? findDerivativeProducts(products, selectedProduct) : [];

  const submitQuery = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    const parsed = parseUserQuery(query);
    const product = parsed.productCode ? findProductByCode(products, parsed.productCode) : undefined;
    setMessages((prev) => [...prev, `用户：${query}`]);
    setConfirmed(false);

    if (product) {
      setSelectedProduct(product);
      setResults([product]);
      setDraftParams({
        productType: product.产品大类,
        current: product.电流,
        poles: product.极数_标准化,
        clock: product.时钟位_h,
        voltage: product.电压,
        protection: product.防护等级,
      });
      setMessages((prev) => [...prev, `系统：已命中测试样本 ${product.product_code}，请先确认参数卡。`]);
      return;
    }

    setSelectedProduct(null);
    setResults([]);
    setDraftParams((prev) => ({ ...prev, ...parsed.params }));

    if (parsed.productCode) {
      setMessages((prev) => [...prev, `系统：测试样本中没有 ${parsed.productCode}。宁可不输出，也不做猜测。`]);
      return;
    }

    const nextMissing = getMissingParams({ ...draftParams, ...parsed.params });
    setMessages((prev) => [
      ...prev,
      nextMissing.length
        ? `系统：已识别部分参数，还缺 ${nextMissing.map((field) => FIELD_LABELS[field]).join('、')}。`
        : '系统：参数已齐，请确认参数卡后由规则引擎检索。',
    ]);
  };

  const updateParam = (field: keyof SelectionParams, value: string) => {
    setDraftParams((prev) => ({ ...prev, [field]: value }));
    setConfirmed(false);
  };

  const confirmParams = () => {
    if (missing.length > 0) {
      setMessages((prev) => [...prev, `系统：仍缺 ${missing.map((field) => FIELD_LABELS[field]).join('、')}，暂不输出型号。`]);
      return;
    }

    const confirmedParams = draftParams as SelectionParams;
    const matched = searchByConfirmedParams(products, confirmedParams);
    setConfirmed(true);
    setResults(matched);
    setSelectedProduct(matched[0] ?? null);
    setMessages((prev) => [
      ...prev,
      matched.length
        ? `系统：确认完成，规则引擎找到 ${matched.length} 个严格匹配型号。`
        : '系统：确认完成，但测试样本中没有严格匹配型号，已停止输出。',
    ]);
  };

  return (
    <div className="space-y-5 text-[#111111]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0066cc]">
            Forward Query Main Path
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#111111]">正向查询主链路</h1>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-[#6e6e73]">
          数据源：47 条测试样本 JSONL，源自最终主表 CSV
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_0.78fr_1fr]">
        <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-industrial">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-[#0066cc]" />
            <h2 className="font-semibold text-[#111111]">聊天壳</h2>
          </div>
          <div className="mb-4 h-[170px] space-y-3 overflow-auto rounded-2xl border border-black/10 bg-[#f5f5f7] p-3">
            {messages.map((message, index) => (
              <div
                key={`${message}-${index}`}
                className="rounded-2xl bg-white px-3 py-2 text-sm leading-6 text-[#6e6e73]"
              >
                {message}
              </div>
            ))}
          </div>
          <form onSubmit={submitQuery} className="flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-industrial-accent-electric"
              placeholder="例如：418.6367 或 63A 3P+N+E 6h 346-415 IP66/IP67/IP69 暗装插座"
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-2xl bg-industrial-accent-electric px-3 py-2 text-sm font-semibold text-white transition hover:bg-industrial-blue-light hover:text-slate-950"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-industrial">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="font-semibold text-[#111111]">参数确认卡</h2>
            </div>
            <span className="text-xs text-[#6e6e73]">{confirmed ? '已确认' : '待确认'}</span>
          </div>
          <div className="space-y-3">
            {(Object.keys(FIELD_LABELS) as Array<keyof SelectionParams>).map((field) => (
              <label key={field} className="block">
                <span className="mb-1 block text-xs text-[#6e6e73]">{FIELD_LABELS[field]}</span>
                <select
                  value={draftParams[field] ?? ''}
                  onChange={(event) => updateParam(field, event.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-industrial-accent-electric"
                >
                  <option value="">未确认</option>
                  {options[field].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm leading-6 text-amber-800">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              输出闸门
            </div>
            {missing.length > 0
              ? `缺少 ${missing.map((field) => FIELD_LABELS[field]).join('、')}，不会输出型号。`
              : '参数完整，确认后才会调用规则引擎。IP 必须完全一致。'}
          </div>

          <button
            type="button"
            onClick={confirmParams}
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            确认并检索
          </button>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-industrial">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">结果详情</h2>
            <span className="text-xs text-[#6e6e73]">{results.length} 个严格匹配</span>
          </div>
          {selectedProduct ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/products/${encodeURIComponent(selectedProduct.product_code)}`}
                      className="font-mono text-xl font-bold text-[#0066cc] hover:text-[#004a99]"
                    >
                      {selectedProduct.product_code}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-[#6e6e73]">
                      {getDisplayName(selectedProduct)}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700">
                    {formatPrice(selectedProduct)}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['产品大类', selectedProduct.产品大类],
                    ['电流', selectedProduct.电流],
                    ['极数', selectedProduct.极数_标准化],
                    ['时钟位', selectedProduct.时钟位_h],
                    ['电压', selectedProduct.电压],
                    ['IP', selectedProduct.防护等级],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded bg-white px-3 py-2">
                      <span className="text-[#6e6e73]">{label}</span>
                      <span className="float-right text-[#111111]">{value || '-'}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/products/${encodeURIComponent(selectedProduct.product_code)}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#0066cc] hover:text-[#004a99]"
                >
                  打开产品详情页
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <FoldedList title="配套推荐" products={companions} emptyText="测试样本中暂无严格配套型号。" />
              <FoldedList title="衍生型号" products={derivatives} emptyText="暂无同前缀衍生型号。" />
            </div>
          ) : (
            <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6 text-sm leading-6 text-[#6e6e73]">
              {loading ? '正在加载测试样本...' : '等待型号命中，或等待确认卡完成后检索。'}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface FoldedListProps {
  title: string;
  products: ScameProduct[];
  emptyText: string;
}

const FoldedList: React.FC<FoldedListProps> = ({ title, products, emptyText }) => (
  <details className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-3">
    <summary className="cursor-pointer text-sm font-semibold text-[#111111]">
      {title} <span className="text-[#6e6e73]">({products.length})</span>
    </summary>
    <div className="mt-3 space-y-2">
      {products.length === 0 ? (
        <p className="text-sm text-[#6e6e73]">{emptyText}</p>
      ) : (
        products.map((product) => (
          <Link
            key={product.product_code}
            to={`/products/${encodeURIComponent(product.product_code)}`}
            className="block rounded bg-white px-3 py-2 text-sm text-[#6e6e73] hover:text-[#004a99]"
          >
            <span className="font-mono text-[#0066cc]">{product.product_code}</span>
            <span className="ml-2">{product.产品大类 || product.产品描述}</span>
          </Link>
        ))
      )}
    </div>
  </details>
);

export default ForwardSelectionPage;
