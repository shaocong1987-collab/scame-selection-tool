import { LlmLineItem, LlmParsedDemand } from './llmDemand';

export interface ScameProduct {
  product_code: string;
  面价匹配状态: string;
  产品描述: string;
  产品类型: string;
  '面价/pcs': string;
  最小起订量: string;
  产品图片链接: string;
  产品技术说明书链接: string;
  系列: string;
  子系列: string;
  产品大类: string;
  安装方式: string;
  结构方向: string;
  防护等级: string;
  安装尺寸: string;
  端子类型: string;
  功能配置: string;
  外观标签: string;
  电流: string;
  极数_标准化: string;
  频率: string;
  时钟位_h: string;
  电压: string;
  电缆范围: string;
  原始Poles: string;
  原始极数: string;
  来源工作表: string;
  来源行号: string;
  来源列描述: string;
  来源记录数: string;
}

interface RagRecord {
  structured: ScameProduct;
}

export interface SelectionParams {
  productType: string;
  current: string;
  poles: string;
  clock: string;
  voltage: string;
  protection: string;
}

export interface SelectionSearchOptions {
  installMode?: string;
  orientation?: string;
}

export interface StockRecord {
  product_code: string;
  warehouse: string;
  item_name: string;
  spec: string;
  unit: string;
  available_quantity: number;
  balance_quantity: number;
  pending_delivery_quantity: number;
}

export interface QuoteSelectionContext {
  industry?: string;
  application?: string;
  productType?: string;
  installMode?: string;
  orientation?: string;
  needsCompanionRecommendation: boolean;
  notes: string[];
}

export interface ParsedQuery {
  productCode?: string;
  params: Partial<SelectionParams>;
  missing: Array<keyof SelectionParams>;
}

export interface QuoteSelectionLine {
  quantity: number;
  rawText: string;
  params: SelectionParams;
  searchOptions: SelectionSearchOptions;
  inferences: string[];
  candidates: ScameProduct[];
  orientationOptions: ScameProduct[];
  companionRecommendations: ScameProduct[];
}

const PRODUCT_DATA_URL = '/data/sample_products_for_rag.jsonl';
const STOCK_DATA_URL = '/data/sample_stock.json';
const REQUIRED_FIELDS: Array<keyof SelectionParams> = [
  'productType',
  'current',
  'poles',
  'clock',
  'voltage',
  'protection',
];

let productCache: ScameProduct[] | null = null;
let stockCache: StockRecord[] | null = null;

export async function loadSampleProducts(): Promise<ScameProduct[]> {
  if (productCache) {
    return productCache;
  }

  const response = await fetch(PRODUCT_DATA_URL);
  if (!response.ok) {
    throw new Error(`测试样本加载失败: ${response.status}`);
  }

  const text = await response.text();
  productCache = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (JSON.parse(line) as RagRecord).structured);

  return productCache;
}

export async function loadSampleStock(): Promise<StockRecord[]> {
  if (stockCache) {
    return stockCache;
  }

  const response = await fetch(STOCK_DATA_URL);
  if (!response.ok) {
    throw new Error(`库存样本加载失败: ${response.status}`);
  }

  stockCache = (await response.json()) as StockRecord[];
  return stockCache;
}

export function findStockByCode(stockRecords: StockRecord[], rawCode: string): StockRecord | undefined {
  const normalizedCode = normalizeProductCode(rawCode);
  return stockRecords.find((record) => normalizeProductCode(record.product_code) === normalizedCode);
}

export function findProductByCode(products: ScameProduct[], rawCode: string): ScameProduct | undefined {
  const normalizedCode = normalizeProductCode(rawCode);
  return products.find((product) => normalizeProductCode(product.product_code) === normalizedCode);
}

export function parseUserQuery(input: string): ParsedQuery {
  const productCode = input.match(/[A-Z]{0,4}\d{3}\.[A-Z0-9.-]+/i)?.[0];
  const normalizedInput = normalizeInput(input);
  const params: Partial<SelectionParams> = {
    productType: parseProductType(normalizedInput),
    current: normalizedInput.match(/\b(16|32|63|160|250|420)\s*A\b/i)?.[0].replace(/\s+/g, '').toUpperCase(),
    poles: normalizedInput.match(/\b(2P\+E|3P\+E|3P\+N\+E)\b/i)?.[0].toUpperCase(),
    clock: normalizedInput.match(/\b([1-9]|1[0-2])\s*h\b/i)?.[1],
    voltage: parseVoltage(normalizedInput),
    protection: normalizedInput.match(/\bIP(?:44\/IP54|66\/IP67\/IP69|44|54|66|67|69)\b/i)?.[0].toUpperCase(),
  };

  return {
    productCode,
    params,
    missing: getMissingParams(params),
  };
}

export function getMissingParams(params: Partial<SelectionParams>): Array<keyof SelectionParams> {
  return REQUIRED_FIELDS.filter((field) => !params[field]);
}

export function searchByConfirmedParams(
  products: ScameProduct[],
  params: SelectionParams,
  options: SelectionSearchOptions = {},
): ScameProduct[] {
  return products
    .filter((product) => product.产品大类 === params.productType)
    .filter((product) => !options.installMode || product.安装方式 === options.installMode)
    .filter((product) => !options.orientation || product.结构方向 === options.orientation)
    .filter((product) => product.电流 === params.current)
    .filter((product) => product.极数_标准化 === params.poles)
    .filter((product) => product.时钟位_h === params.clock)
    .filter((product) => normalizeVoltage(product.电压) === normalizeVoltage(params.voltage))
    .filter((product) => protectionMatches(product.防护等级, params.protection))
    .sort((a, b) => scoreBaseProduct(b) - scoreBaseProduct(a));
}

export function findOrientationOptions(products: ScameProduct[], params: SelectionParams, options: SelectionSearchOptions = {}): ScameProduct[] {
  return searchByConfirmedParams(products, params, { ...options, orientation: undefined });
}

export function parseQuoteSelectionRequest(
  input: string,
  products: ScameProduct[],
  llmParsed?: LlmParsedDemand,
): QuoteSelectionLine[] {
  const llmLines = parseLlmQuoteSelectionRequest(input, products, llmParsed);

  if (llmLines.length > 0) {
    return llmLines;
  }

  const context = parseQuoteSelectionContext(input);

  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseQuoteSelectionLine(line, products, context))
    .filter((line): line is QuoteSelectionLine => Boolean(line));
}

export function paramsFromLlmDemand(llmParsed?: LlmParsedDemand): Partial<SelectionParams> {
  if (!llmParsed) {
    return {};
  }

  return paramsFromLlmFields(llmParsed);
}

export function calculateLineAmount(product: ScameProduct, quantity: number): number | null {
  const price = Number(product['面价/pcs']);
  return Number.isFinite(price) ? price * quantity : null;
}

export function findCompanionProducts(
  products: ScameProduct[],
  source: ScameProduct,
): ScameProduct[] {
  const sourceIsPlug = source.产品大类 === '插头';
  const compatibleTypes = sourceIsPlug ? ['插座', '连接器', '机械联锁插座'] : ['插头'];

  return products
    .filter((product) => product.product_code !== source.product_code)
    .filter((product) => compatibleTypes.includes(product.产品大类))
    .filter((product) => product.电流 === source.电流)
    .filter((product) => product.极数_标准化 === source.极数_标准化)
    .filter((product) => product.时钟位_h === source.时钟位_h)
    .filter((product) => normalizeVoltage(product.电压) === normalizeVoltage(source.电压))
    .filter((product) => product.防护等级 === source.防护等级)
    .slice(0, 6);
}

export function findDerivativeProducts(
  products: ScameProduct[],
  source: ScameProduct,
): ScameProduct[] {
  const baseCode = source.product_code.split('.')[0];
  return products
    .filter((product) => product.product_code !== source.product_code)
    .filter((product) => product.product_code.startsWith(`${baseCode}.`))
    .slice(0, 8);
}

export function getFieldOptions(products: ScameProduct[], field: keyof SelectionParams): string[] {
  const fieldMap: Record<keyof SelectionParams, keyof ScameProduct> = {
    productType: '产品大类',
    current: '电流',
    poles: '极数_标准化',
    clock: '时钟位_h',
    voltage: '电压',
    protection: '防护等级',
  };

  return Array.from(new Set(products.map((product) => product[fieldMap[field]]).filter(Boolean))).sort(
    naturalSort,
  );
}

export function getDisplayName(product: ScameProduct): string {
  return product.产品描述 || `${product.电流} ${product.极数_标准化} ${product.防护等级} ${product.产品大类}`;
}

export function formatPrice(product: ScameProduct): string {
  const price = Number(product['面价/pcs']);
  return Number.isFinite(price) ? `¥${price.toLocaleString('zh-CN')}` : '未提供';
}

function parseProductType(input: string): string | undefined {
  if (/机械|联锁/.test(input)) {
    return '机械联锁插座';
  }
  if (/插头|plug/i.test(input)) {
    return '插头';
  }
  if (/插座|socket/i.test(input)) {
    return '插座';
  }
  if (/连接器|connector/i.test(input)) {
    return '连接器';
  }
  return undefined;
}

function parseVoltage(input: string): string | undefined {
  if (/1000\s*V/i.test(input)) {
    return '1000V';
  }

  return input.match(/\b(200-250|346-415|100-130)\s*V?\b/i)?.[1];
}

function parseQuoteSelectionContext(input: string): QuoteSelectionContext {
  const normalizedInput = normalizeInput(input);
  const isDataCenterCabinet = /数据中心|列头柜/.test(normalizedInput);
  const notes: string[] = [];

  if (isDataCenterCabinet) {
    notes.push('行业/场景识别为数据中心列头柜，优先按柜体面板暗装插座处理');
    notes.push('客户暂不需要插头时，仍保留配套插头推荐');
  }

  return {
    industry: isDataCenterCabinet ? '数据中心' : undefined,
    application: isDataCenterCabinet ? '列头柜' : undefined,
    productType: isDataCenterCabinet ? '插座' : undefined,
    installMode: isDataCenterCabinet ? '暗装' : undefined,
    orientation: isDataCenterCabinet ? '直式' : undefined,
    needsCompanionRecommendation: isDataCenterCabinet,
    notes,
  };
}

function parseQuoteSelectionLine(
  line: string,
  products: ScameProduct[],
  context: QuoteSelectionContext,
): QuoteSelectionLine | null {
  if (!/\d+\s*(?:个|只|台|套|pcs?|PC|PCS)?/i.test(line)) {
    return null;
  }

  const quantity = Number(line.match(/(\d+)\s*(?:个|只|台|套|pcs?|PC|PCS)?/i)?.[1]);
  const parsed = parseUserQuery(line);
  const inferences: string[] = [];

  if (!Number.isFinite(quantity) || !parsed.params.current || !parsed.params.poles || !parsed.params.protection) {
    return null;
  }

  const inferredClock = parsed.params.clock ?? inferClock(parsed.params.poles, parsed.params.voltage);
  const inferredVoltage = parsed.params.voltage ?? inferVoltage(parsed.params.poles);

  if (!parsed.params.productType && !context.productType) {
    return null;
  }

  if (!inferredClock || !inferredVoltage) {
    return null;
  }

  const params: SelectionParams = {
    productType: parsed.params.productType ?? context.productType ?? '',
    current: parsed.params.current,
    poles: parsed.params.poles,
    clock: inferredClock,
    voltage: inferredVoltage,
    protection: parsed.params.protection,
  };

  if (!parsed.params.productType && context.productType) {
    inferences.push(...context.notes);
  }
  if (!parsed.params.clock) {
    inferences.push(`${params.poles} 按 IEC 常用极数/电压关系推导为 ${params.clock}h`);
  }
  if (!parsed.params.voltage) {
    inferences.push(`${params.poles} 通常对应主表电压 ${params.voltage}V`);
  }

  const searchOptions: SelectionSearchOptions = {
    installMode: /明装/.test(line) ? '明装' : /暗装/.test(line) ? '暗装' : context.installMode,
    orientation: /斜式/.test(line) ? '斜式' : /直式/.test(line) ? '直式' : context.orientation,
  };

  if (!/明装|暗装/.test(line) && context.installMode) {
    inferences.push(`安装方式来自行业/场景经验：${context.installMode}`);
  }
  if (!/直式|斜式/.test(line) && context.orientation) {
    inferences.push(`结构方向来自行业/场景经验：${context.orientation}；后续需由库存模块校验平替`);
  }

  const candidates = searchByConfirmedParams(products, params, searchOptions);

  return {
    quantity,
    rawText: line,
    params,
    searchOptions,
    inferences,
    candidates,
    orientationOptions: findOrientationOptions(products, params, searchOptions),
    companionRecommendations: context.needsCompanionRecommendation
      ? candidates.flatMap((candidate) => findCompanionProducts(products, candidate)).slice(0, 4)
      : [],
  };
}

function parseLlmQuoteSelectionRequest(
  input: string,
  products: ScameProduct[],
  llmParsed?: LlmParsedDemand,
): QuoteSelectionLine[] {
  if (!llmParsed?.line_items?.length) {
    return [];
  }

  return llmParsed.line_items
    .map((item) => parseLlmQuoteSelectionLine(item, input, products, llmParsed))
    .filter((line): line is QuoteSelectionLine => Boolean(line));
}

function parseLlmQuoteSelectionLine(
  item: LlmLineItem,
  input: string,
  products: ScameProduct[],
  llmParsed: LlmParsedDemand,
): QuoteSelectionLine | null {
  const quantity = normalizeQuantity(item.quantity ?? llmParsed.quantity);

  if (!quantity) {
    return null;
  }

  const params: Partial<SelectionParams> = paramsFromLlmFields({
    product_type: item.product_type || llmParsed.product_type,
    current: item.current || llmParsed.current,
    poles: item.poles || llmParsed.poles,
    ip: item.ip || llmParsed.ip,
    clock: item.clock || llmParsed.clock,
    voltage: item.voltage || llmParsed.voltage,
  });
  const context = parseQuoteSelectionContext(input);
  const inferences = [
    ...(llmParsed.inferred_fields ?? []),
    ...(llmParsed.reasoning_notes ?? []),
  ].filter(Boolean);

  if (!params.clock) {
    params.clock = inferClock(params.poles, params.voltage);
    if (params.clock) {
      inferences.push(`本地规则根据 ${params.poles} 补全为 ${params.clock}h`);
    }
  }
  if (!params.voltage) {
    params.voltage = inferVoltage(params.poles);
    if (params.voltage) {
      inferences.push(`本地规则根据 ${params.poles} 补全为 ${params.voltage}V`);
    }
  }

  const completeParams = completeSelectionParams(params);

  if (!completeParams) {
    return null;
  }

  const searchOptions: SelectionSearchOptions = {
    installMode: normalizeInstallMode(item.install_mode || llmParsed.install_mode) || context.installMode,
    orientation: normalizeOrientation(item.orientation || llmParsed.orientation) || context.orientation,
  };
  const candidates = searchByConfirmedParams(products, completeParams, searchOptions);

  return {
    quantity,
    rawText: item.raw_text || input,
    params: completeParams,
    searchOptions,
    inferences,
    candidates,
    orientationOptions: findOrientationOptions(products, completeParams, searchOptions),
    companionRecommendations: llmParsed.needs_companion_recommendation
      ? candidates.flatMap((candidate) => findCompanionProducts(products, candidate)).slice(0, 4)
      : [],
  };
}

function paramsFromLlmFields(fields: Partial<LlmParsedDemand & LlmLineItem>): Partial<SelectionParams> {
  return {
    productType: normalizeProductType(fields.product_type),
    current: normalizeCurrent(fields.current),
    poles: normalizePoles(fields.poles),
    clock: normalizeClock(fields.clock),
    voltage: normalizeParsedVoltage(fields.voltage),
    protection: normalizeProtection(fields.ip),
  };
}

function completeSelectionParams(params: Partial<SelectionParams>): SelectionParams | null {
  const missing = getMissingParams(params);

  if (missing.length > 0) {
    return null;
  }

  return params as SelectionParams;
}

function inferClock(poles?: string, voltage?: string): string | undefined {
  if (poles === '3P+N+E' || poles === '2P+E') {
    return '6';
  }
  if (voltage === '346-415' || voltage === '200-250') {
    return '6';
  }
  return undefined;
}

function inferVoltage(poles?: string): string | undefined {
  if (poles === '3P+N+E') {
    return '346-415';
  }
  if (poles === '2P+E') {
    return '200-250';
  }
  return undefined;
}

function normalizeQuantity(quantity?: number | string): number | null {
  if (typeof quantity === 'number') {
    return Number.isFinite(quantity) && quantity > 0 ? quantity : null;
  }

  const parsed = Number(String(quantity ?? '').match(/\d+/)?.[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function normalizeProductType(productType?: string): string | undefined {
  if (!productType) {
    return undefined;
  }

  if (/机械|联锁/.test(productType)) {
    return '机械联锁插座';
  }
  if (/插头|plug/i.test(productType)) {
    return '插头';
  }
  if (/插座|socket/i.test(productType)) {
    return '插座';
  }
  if (/连接器|connector/i.test(productType)) {
    return '连接器';
  }
  return productType;
}

function normalizeCurrent(current?: string): string | undefined {
  return current?.match(/\b(16|32|63|160|250|420)\s*A?\b/i)?.[1].concat('A');
}

function normalizePoles(poles?: string): string | undefined {
  const normalized = poles?.replace(/\bPE\b/gi, 'E').replace(/\s+/g, '').toUpperCase();
  return normalized?.match(/\b(2P\+E|3P\+E|3P\+N\+E)\b/)?.[1];
}

function normalizeClock(clock?: string): string | undefined {
  return clock?.match(/\b([1-9]|1[0-2])\s*h?\b/i)?.[1];
}

function normalizeParsedVoltage(voltage?: string): string | undefined {
  if (!voltage) {
    return undefined;
  }

  if (/1000\s*V?/i.test(voltage)) {
    return '1000V';
  }

  return voltage.match(/\b(200-250|346-415|100-130)\s*V?\b/i)?.[1];
}

function normalizeProtection(protection?: string): string | undefined {
  return protection?.match(/\bIP(?:44\/IP54|66\/IP67\/IP69|44|54|66|67|69)\b/i)?.[0].toUpperCase();
}

function normalizeInstallMode(installMode?: string): string | undefined {
  if (/暗装/.test(installMode ?? '')) {
    return '暗装';
  }
  if (/明装/.test(installMode ?? '')) {
    return '明装';
  }
  return undefined;
}

function normalizeOrientation(orientation?: string): string | undefined {
  if (/直式/.test(orientation ?? '')) {
    return '直式';
  }
  if (/斜式/.test(orientation ?? '')) {
    return '斜式';
  }
  return undefined;
}

function normalizeProductCode(code: string): string {
  return code.trim().toUpperCase();
}

function normalizeInput(input: string): string {
  return input.replace(/\bPE\b/gi, 'E');
}

function normalizeVoltage(voltage: string): string {
  return voltage.replace(/\s+/g, '').replace(/V$/i, '');
}

function protectionMatches(productProtection: string, requestedProtection: string): boolean {
  const requested = requestedProtection.toUpperCase();
  return productProtection
    .toUpperCase()
    .split('/')
    .map((part) => part.trim())
    .includes(requested);
}

function scoreBaseProduct(product: ScameProduct): number {
  let score = 0;
  if (!/[.](TR|K|PW|H)$/i.test(product.product_code)) {
    score += 2;
  }
  if (!product.外观标签) {
    score += 1;
  }
  return score;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, 'zh-CN', { numeric: true });
}
