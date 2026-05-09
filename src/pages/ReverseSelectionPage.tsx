import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, Search } from 'lucide-react';
import { LlmParsedDemand, LlmParseStatus, LlmUsage, parseDemandWithLlm } from '@/lib/scame/llmDemand';
import {
  findStockByCode,
  findCompanionProducts,
  formatPrice,
  getFieldOptions,
  getDisplayName,
  getMissingParams,
  loadSampleProducts,
  loadSampleStock,
  paramsFromLlmDemand,
  parseQuoteSelectionRequest,
  parseUserQuery,
  QuoteSelectionLine,
  ScameProduct,
  SelectionParams,
  searchByConfirmedParams,
  StockRecord,
} from '@/lib/scame/sampleProducts';

const FIELD_LABELS: Record<keyof SelectionParams, string> = {
  productType: '产品形式',
  current: '电流',
  poles: '极数',
  clock: '时钟位 h',
  voltage: '电压',
  protection: 'IP',
};

const DEFAULT_DEMAND = `场景：数据中心行业，客户生产列头柜，已确认暂不需要插头
166个 型号:3P+N+PE IP44 63A
40个 型号:3P+N+PE IP44 32A
您给报个价格吧`;

const ReverseSelectionPage: React.FC = () => {
  const [products, setProducts] = useState<ScameProduct[]>([]);
  const [stockRecords, setStockRecords] = useState<StockRecord[]>([]);
  const [demand, setDemand] = useState(DEFAULT_DEMAND);
  const [submittedDemand, setSubmittedDemand] = useState(DEFAULT_DEMAND);
  const [discounts, setDiscounts] = useState<Record<string, string>>({});
  const [paramOverrides, setParamOverrides] = useState<Partial<SelectionParams>>({});
  const [llmStatus, setLlmStatus] = useState<LlmParseStatus>('idle');
  const [llmParsed, setLlmParsed] = useState<LlmParsedDemand | undefined>();
  const [llmUsage, setLlmUsage] = useState<LlmUsage | undefined>();
  const [llmError, setLlmError] = useState<string | undefined>();

  useEffect(() => {
    loadSampleProducts().then(setProducts);
    loadSampleStock().then(setStockRecords);
  }, []);

  const fieldOptions = useMemo(() => buildFieldOptions(products), [products]);
  const demo = useMemo(
    () => buildReverseDemo(products, submittedDemand, llmParsed, paramOverrides),
    [products, submittedDemand, llmParsed, paramOverrides],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedDemand(demand);
    setParamOverrides({});
    setLlmStatus('loading');
    setLlmError(undefined);
    setLlmParsed(undefined);
    setLlmUsage(undefined);

    try {
      const result = await parseDemandWithLlm(demand);
      setLlmParsed(result.parsed);
      setLlmUsage(result.usage);
      setLlmStatus('success');
    } catch (error) {
      setLlmStatus('fallback');
      setLlmError(error instanceof Error ? error.message : 'LLM 解析失败');
    }
  };

  return (
    <div className="space-y-5 text-[#111111]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Reverse Selection Demo</p>
          <h1 className="mt-2 text-2xl font-bold text-[#111111]">反向选型演示版</h1>
        </div>
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-800">
          演示版：用于内部验证自然语言选型和报价复刻，暂不作为完整生产闭环
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#0066cc]" />
            <h2 className="font-semibold text-[#111111]">需求文本</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={demand}
              onChange={(event) => setDemand(event.target.value)}
              className="min-h-[170px] w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm leading-6 text-[#111111] outline-none focus:border-industrial-accent-electric"
              placeholder="例如：166个 型号:3P+N+PE IP44 63A"
            />
            <button
              type="submit"
              disabled={llmStatus === 'loading'}
              className="inline-flex items-center rounded-2xl bg-industrial-accent-electric px-4 py-2 text-sm font-semibold text-white transition hover:bg-industrial-blue-light hover:text-slate-950"
            >
              <Search className="mr-2 h-4 w-4" />
              {llmStatus === 'loading' ? 'LLM 解析中' : '生成演示筛选'}
            </button>
          </form>

          <LlmStatusPanel status={llmStatus} parsed={llmParsed} usage={llmUsage} error={llmError} />

          <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              演示边界
            </div>
            该页面只围绕 47 个测试样本运行；参数缺失时不会输出候选型号。后续生产版再接入
            `产品选型表_简化无图.xlsx` 的完整工作表规则。
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-[#111111]">参数解析结果</h2>
            <span className="text-xs text-[#6e6e73]">
              {demo.missing.length === 0 ? '参数完整' : `缺少 ${demo.missing.length} 项`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {(Object.keys(FIELD_LABELS) as Array<keyof SelectionParams>).map((field) => (
              <div key={field} className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-3">
                <label className="text-xs text-[#6e6e73]" htmlFor={`param-${field}`}>
                  {FIELD_LABELS[field]}
                </label>
                <select
                  id={`param-${field}`}
                  value={demo.params[field] || ''}
                  onChange={(event) =>
                    setParamOverrides((current) => ({
                      ...current,
                      [field]: event.target.value || undefined,
                    }))
                  }
                  className="mt-1 h-9 w-full rounded-2xl border border-black/10 bg-white px-2 text-sm font-semibold text-[#111111] outline-none focus:border-industrial-accent-electric"
                >
                  <option value="">未识别</option>
                  {fieldOptions[field].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {demo.missing.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-700">
              参数不完整：{demo.missing.map((field) => FIELD_LABELS[field]).join('、')}。本演示不会输出型号。
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mr-1 inline h-4 w-4" />
              参数完整，最终型号来自参数解析结果和结构化测试数据。
            </div>
          )}
        </div>
      </section>

      {demo.quoteLines.length > 0 && (
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#111111]">真实报价复刻</h2>
              <p className="mt-1 text-sm text-[#6e6e73]">
                行业/场景识别为数据中心列头柜后，按柜体面板暗装插座复刻；每个型号可单独输入折扣。
              </p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-700">
              {formatTotal(demo.quoteLines, discounts)}
            </span>
          </div>
          <QuoteLinesTable
            lines={demo.quoteLines}
            stockRecords={stockRecords}
            discounts={discounts}
            onDiscountChange={(productCode, value) => setDiscounts((current) => ({ ...current, [productCode]: value }))}
          />
        </section>
      )}

      <section>
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-industrial">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#111111]">演示候选结果</h2>
            <span className="text-sm text-[#6e6e73]">{demo.candidates.length} 个候选</span>
          </div>

          {demo.candidates.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-6 text-sm leading-6 text-[#6e6e73]">
              {products.length === 0 ? '正在加载测试样本...' : '没有可输出候选。请补齐参数或更换测试样本范围内的需求。'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {demo.candidates.map((product) => (
                <Link
                  key={product.product_code}
                  to={`/products/${encodeURIComponent(product.product_code)}`}
                  className="group rounded-2xl border border-black/10 bg-[#f5f5f7] p-4 transition hover:border-industrial-accent-electric/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-lg font-bold text-[#0066cc]">{product.product_code}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6e6e73]">
                        {getDisplayName(product)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#6e6e73] transition group-hover:text-[#0066cc]" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-[#6e6e73]">
                    <span>{product.电流}</span>
                    <span>{product.极数_标准化}</span>
                    <span>{product.防护等级}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-sm">
                    <span className="text-[#6e6e73]">{product.安装方式 || product.产品大类}</span>
                    <span className="text-emerald-700">{formatPrice(product)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-black/10 bg-[#f5f5f7] p-3 text-sm leading-6 text-[#6e6e73]">
            当前候选结果以参数解析结果中的下拉选择为准；IP44 可匹配主表中的 IP44/IP54，但不会匹配 IP66/IP67。
          </div>
        </div>
      </section>
    </div>
  );
};

function buildFieldOptions(products: ScameProduct[]): Record<keyof SelectionParams, string[]> {
  return {
    productType: getFieldOptions(products, 'productType'),
    current: getFieldOptions(products, 'current'),
    poles: getFieldOptions(products, 'poles'),
    clock: getFieldOptions(products, 'clock'),
    voltage: getFieldOptions(products, 'voltage'),
    protection: getFieldOptions(products, 'protection'),
  };
}

function buildReverseDemo(
  products: ScameProduct[],
  input: string,
  llmParsed?: LlmParsedDemand,
  paramOverrides: Partial<SelectionParams> = {},
) {
  const quoteLines = applyQuoteParamOverrides(parseQuoteSelectionRequest(input, products, llmParsed), products, paramOverrides, llmParsed);
  const parsed = parseUserQuery(input);
  const params = {
    ...(quoteLines[0]?.params ?? { ...parsed.params, ...paramsFromLlmDemand(llmParsed) }),
    ...removeEmptyParams(paramOverrides),
  };
  const missing = getMissingParams(params);
  const complete = missing.length === 0;
  const searchOptions = quoteLines[0]?.searchOptions;
  const candidates = complete ? searchByConfirmedParams(products, params as SelectionParams, searchOptions) : [];

  return {
    params,
    missing,
    quoteLines,
    candidates,
  };
}

function applyQuoteParamOverrides(
  lines: QuoteSelectionLine[],
  products: ScameProduct[],
  paramOverrides: Partial<SelectionParams>,
  llmParsed?: LlmParsedDemand,
): QuoteSelectionLine[] {
  const overrides = removeEmptyParams(paramOverrides);

  if (Object.keys(overrides).length === 0) {
    return lines;
  }

  return lines.map((line) => {
    const params = { ...line.params, ...overrides };
    const candidates = searchByConfirmedParams(products, params, line.searchOptions);

    return {
      ...line,
      params,
      candidates,
      companionRecommendations: llmParsed?.needs_companion_recommendation
        ? candidates.flatMap((candidate) => findCompanionProducts(products, candidate)).slice(0, 4)
        : line.companionRecommendations,
    };
  });
}

function removeEmptyParams(params: Partial<SelectionParams>): Partial<SelectionParams> {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => Boolean(value))) as Partial<SelectionParams>;
}

function formatTotal(lines: QuoteSelectionLine[], discounts: Record<string, string>): string {
  const total = lines.reduce((sum, line) => {
    const product = line.candidates[0];
    const discount = product ? parseDiscount(discounts[product.product_code]) : 1;
    const amount = product ? calculateQuoteTotal(product, line.quantity, discount) : null;
    return amount === null ? sum : sum + amount;
  }, 0);

  return `折后合计 ¥${formatMoney(total)}`;
}

function calculateDiscountedUnitPrice(product: ScameProduct, discount: number): number | null {
  const price = Number(product['面价/pcs']);
  return Number.isFinite(price) ? price * discount : null;
}

function calculateQuoteTotal(product: ScameProduct, quantity: number, discount: number): number | null {
  const discountedUnitPrice = calculateDiscountedUnitPrice(product, discount);
  return discountedUnitPrice === null ? null : discountedUnitPrice * quantity;
}

function parseDiscount(value: string | undefined): number {
  if (value === undefined || value.trim() === '') {
    return 1;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 1;
}

function formatMoney(value: number): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

interface LlmStatusPanelProps {
  status: LlmParseStatus;
  parsed?: LlmParsedDemand;
  usage?: LlmUsage;
  error?: string;
}

const LlmStatusPanel: React.FC<LlmStatusPanelProps> = ({ status, parsed, usage, error }) => {
  const statusText = {
    idle: '等待解析',
    loading: 'LLM 解析中',
    success: 'LLM 解析成功',
    fallback: 'LLM 不可用，已回退本地规则解析',
  }[status];
  const statusClass =
    status === 'success'
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-800'
      : status === 'fallback'
        ? 'border-amber-400/30 bg-amber-500/10 text-amber-800'
        : 'border-black/10 bg-[#f5f5f7] text-[#6e6e73]';

  return (
    <div className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${statusClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold">{statusText}</span>
        {usage && (
          <span className="text-xs">
            tokens {usage.total_tokens} · 约 ¥{usage.estimated_cost_cny.toFixed(6)}
          </span>
        )}
      </div>

      {error && <p className="mt-2 text-xs opacity-90">{error}</p>}

      {parsed && (
        <div className="mt-3 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {formatLlmFields(parsed).map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#f5f5f7] px-2 py-1">
                <span className="text-[#6e6e73]">{label}：</span>
                <span className="text-[#111111]">{value || '-'}</span>
              </div>
            ))}
          </div>
          <LlmList label="推断字段" items={parsed.inferred_fields} />
          <LlmList label="缺失字段" items={parsed.missing_fields} />
          <LlmList label="需确认字段" items={parsed.confirmation_required} />
        </div>
      )}
    </div>
  );
};

function formatLlmFields(parsed: LlmParsedDemand): Array<[string, string | number | boolean | undefined]> {
  return [
    ['行业', sanitizeDisplayValue(parsed.industry)],
    ['产品形式', parsed.product_type],
    ['电流', parsed.current],
    ['极数', parsed.poles],
    ['IP', parsed.ip],
    ['h', parsed.clock],
    ['电压', parsed.voltage],
    ['安装', parsed.install_mode],
    ['方向', parsed.orientation],
  ];
}

interface LlmListProps {
  label: string;
  items?: string[];
}

const LlmList: React.FC<LlmListProps> = ({ label, items }) => (
  <p>
    <span className="text-[#6e6e73]">{label}：</span>
    <span className="text-[#111111]">{filterTechnicalDisplayItems(items).join('、') || '-'}</span>
  </p>
);

function filterTechnicalDisplayItems(items?: string[]): string[] {
  return (items ?? [])
    .map(sanitizeDisplayValue)
    .filter((item): item is string => Boolean(item));
}

function sanitizeDisplayValue(value?: string | number | boolean): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const text = String(value);
  return /产品形态|店铺|门店|货架|柜台/.test(text) ? undefined : text;
}

interface QuoteLinesTableProps {
  lines: QuoteSelectionLine[];
  stockRecords: StockRecord[];
  discounts: Record<string, string>;
  onDiscountChange: (productCode: string, value: string) => void;
}

const QuoteLinesTable: React.FC<QuoteLinesTableProps> = ({ lines, stockRecords, discounts, onDiscountChange }) => (
  <div className="overflow-x-auto rounded-2xl border border-black/10">
    <table className="min-w-[1200px] table-fixed border-collapse text-sm">
      <colgroup>
        <col className="w-[280px]" />
        <col className="w-[120px]" />
        <col className="w-[110px]" />
        <col className="w-[90px]" />
        <col className="w-[120px]" />
        <col className="w-[80px]" />
        <col className="w-[130px]" />
        <col className="w-[160px]" />
        <col className="w-[110px]" />
      </colgroup>
      <thead className="bg-[#f5f5f7] text-xs font-semibold text-[#6e6e73]">
        <tr>
          <th className="px-3 py-2 text-left">选型结果</th>
          <th className="px-3 py-2 text-left">库存</th>
          <th className="px-3 py-2 text-left">面价</th>
          <th className="px-3 py-2 text-left">折扣</th>
          <th className="px-3 py-2 text-left">折后金额</th>
          <th className="px-3 py-2 text-left">数量</th>
          <th className="px-3 py-2 text-left">报价总价</th>
          <th className="px-3 py-2 text-left">连接插头</th>
          <th className="px-3 py-2 text-left">状态</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-black/10">
      {lines.map((line) => {
        const product = line.candidates[0];
        const discountValue = product ? (discounts[product.product_code] ?? '1') : '1';
        const discount = parseDiscount(discountValue);
        const discountedUnitPrice = product ? calculateDiscountedUnitPrice(product, discount) : null;
        const quoteTotal = product ? calculateQuoteTotal(product, line.quantity, discount) : null;
        const stock = product ? findStockByCode(stockRecords, product.product_code) : undefined;
        const isEnough = stock ? stock.available_quantity >= line.quantity : false;

        return (
          <tr key={line.rawText} className="align-top">
            <td className="px-3 py-3">
              {product ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/products/${encodeURIComponent(product.product_code)}`}
                    className="font-mono font-bold text-[#0066cc] hover:text-[#004a99]"
                  >
                    {product.product_code}
                  </Link>
                  <span className="text-xs text-[#6e6e73]">
                    {product.结构方向 || product.安装方式 || product.产品大类}
                  </span>
                </div>
              ) : (
                <span className="text-red-700">未输出</span>
              )}
              <p className="mt-1 text-[#6e6e73]">{product ? getDisplayName(product) : line.rawText}</p>
              <p className="mt-2 text-xs leading-5 text-amber-700">{filterTechnicalDisplayItems(line.inferences).join('；')}</p>
            </td>
            <td className={`px-3 py-3 ${isEnough ? 'text-emerald-700' : 'text-amber-700'}`}>
              {stock ? `${formatQuantity(stock.available_quantity)} 可用` : '待接入'}
            </td>
            <td className="px-3 py-3 text-emerald-700">{product ? formatPrice(product) : '-'}</td>
            <td className="px-3 py-3">
              {product ? (
                <input
                  value={discountValue}
                  onChange={(event) => onDiscountChange(product.product_code, event.target.value)}
                  className="h-8 w-20 rounded-2xl border border-black/10 bg-white px-2 text-sm text-[#111111] outline-none focus:border-industrial-accent-electric"
                  inputMode="decimal"
                  aria-label={`${product.product_code} 折扣`}
                />
              ) : (
                '-'
              )}
            </td>
            <td className="px-3 py-3 text-[#111111]">
              {discountedUnitPrice === null ? '-' : `¥${formatMoney(discountedUnitPrice)}`}
            </td>
            <td className="px-3 py-3 text-[#111111]">{line.quantity}</td>
            <td className="px-3 py-3 text-[#111111]">{quoteTotal === null ? '-' : `¥${formatMoney(quoteTotal)}`}</td>
            <td className="space-y-1 px-3 py-3">
              {line.companionRecommendations.length > 0 ? (
                line.companionRecommendations.map((companion) => (
                  <Link
                    key={companion.product_code}
                    to={`/products/${encodeURIComponent(companion.product_code)}`}
                    className="block font-mono text-xs font-semibold text-[#0066cc] hover:text-[#004a99]"
                  >
                    {companion.product_code}
                  </Link>
                ))
              ) : (
                <span className="text-[#6e6e73]">-</span>
              )}
            </td>
            <td className={`px-3 py-3 ${product ? 'text-emerald-700' : 'text-red-700'}`}>
              {product ? (isEnough ? '可报价' : '库存不足') : '需补参'}
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  </div>
);

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export default ReverseSelectionPage;
