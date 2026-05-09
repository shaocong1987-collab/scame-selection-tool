import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { z } from 'zod';

const DEEPSEEK_DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEEPSEEK_DEFAULT_MODEL = 'deepseek-v4-flash';

const llmDemandSchema = z.object({
  industry: z.string().optional().default(''),
  scenario: z.string().optional().default(''),
  quantity: z.union([z.number(), z.string()]).optional().default(''),
  product_type: z.string().optional().default(''),
  current: z.string().optional().default(''),
  poles: z.string().optional().default(''),
  ip: z.string().optional().default(''),
  clock: z.string().optional().default(''),
  voltage: z.string().optional().default(''),
  install_mode: z.string().optional().default(''),
  orientation: z.string().optional().default(''),
  needs_companion_recommendation: z.boolean().optional().default(false),
  missing_fields: z.array(z.string()).optional().default([]),
  inferred_fields: z.array(z.string()).optional().default([]),
  confirmation_required: z.array(z.string()).optional().default([]),
  reasoning_notes: z.array(z.string()).optional().default([]),
  line_items: z
    .array(
      z.object({
        raw_text: z.string().optional().default(''),
        quantity: z.union([z.number(), z.string()]).optional().default(''),
        product_type: z.string().optional().default(''),
        current: z.string().optional().default(''),
        poles: z.string().optional().default(''),
        ip: z.string().optional().default(''),
        clock: z.string().optional().default(''),
        voltage: z.string().optional().default(''),
        install_mode: z.string().optional().default(''),
        orientation: z.string().optional().default(''),
      }),
    )
    .optional()
    .default([]),
});

const deepseekResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    }),
  ),
  usage: z
    .object({
      prompt_tokens: z.number().optional().default(0),
      completion_tokens: z.number().optional().default(0),
      total_tokens: z.number().optional().default(0),
    })
    .optional()
    .default({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }),
});

function deepseekProxyPlugin(): Plugin {
  return {
    name: 'scame-deepseek-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/llm/parse-demand', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = await readJsonBody(req);
          const input = z.object({ demand: z.string().min(1) }).parse(body).demand;
          const apiKey = process.env.DEEPSEEK_API_KEY;

          if (!apiKey) {
            throw new Error('DEEPSEEK_API_KEY is not configured');
          }

          const model = process.env.DEEPSEEK_MODEL || DEEPSEEK_DEFAULT_MODEL;
          const baseUrl = (process.env.DEEPSEEK_BASE_URL || DEEPSEEK_DEFAULT_BASE_URL).replace(/\/$/, '');
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 12000);

          const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${apiKey}`,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              model,
              response_format: { type: 'json_object' },
              temperature: 0.1,
              messages: [
                { role: 'system', content: buildDemandParseSystemPrompt() },
                { role: 'user', content: input },
              ],
            }),
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!llmResponse.ok) {
            throw new Error(`DeepSeek request failed: ${llmResponse.status}`);
          }

          const parsedResponse = deepseekResponseSchema.parse(await llmResponse.json());
          const content = parsedResponse.choices[0]?.message.content;
          const parsedDemand = sanitizeParsedDemand(llmDemandSchema.parse(JSON.parse(content)));
          const usage = parsedResponse.usage;

          sendJson(res, {
            source: 'deepseek',
            model,
            parsed: parsedDemand,
            usage: {
              prompt_tokens: usage.prompt_tokens,
              completion_tokens: usage.completion_tokens,
              total_tokens: usage.total_tokens,
              estimated_cost_cny: estimateDeepseekCostCny(usage.prompt_tokens, usage.completion_tokens),
            },
          });
        } catch (error) {
          sendJson(res, {
            source: 'fallback',
            error: error instanceof Error ? error.message : 'Unknown DeepSeek proxy error',
          });
        }
      });
    },
  };
}

function buildDemandParseSystemPrompt(): string {
  return `你是 SCAME 工业连接器选型系统中的参数解析器，不是最终选型器。
只把客户自然语言转换为标准 JSON，不能输出最终产品型号，不能编造型号。
LLM 只负责理解、翻译、追问建议和推断依据；最终型号必须由本地规则引擎决定。

输出必须是严格 JSON，字段固定如下：
{
  "industry": "",
  "scenario": "",
  "quantity": "",
  "product_type": "",
  "current": "",
  "poles": "",
  "ip": "",
  "clock": "",
  "voltage": "",
  "install_mode": "",
  "orientation": "",
  "needs_companion_recommendation": false,
  "missing_fields": [],
  "inferred_fields": [],
  "confirmation_required": [],
  "reasoning_notes": [],
  "line_items": [
    {
      "raw_text": "",
      "quantity": "",
      "product_type": "",
      "current": "",
      "poles": "",
      "ip": "",
      "clock": "",
      "voltage": "",
      "install_mode": "",
      "orientation": ""
    }
  ]
}

字段值规范：
- product_type 只能优先使用 插头 / 插座 / 连接器 / 机械联锁插座。
- poles 需要把 3P+N+PE 标准化为 3P+N+E。
- clock 使用 6 或 6h 均可，无法确认留空并放入 missing_fields。
- voltage 使用 346-415 或 346-415V 均可，无法确认留空并放入 missing_fields。
- ip 使用 IP44、IP44/IP54、IP66/IP67/IP69 等原始可确认值。
- install_mode 只能是 明装 / 暗装，否则必须留空。
- orientation 只能是 直式 / 斜式，否则必须留空。
- 不要把“货架、店铺、门店、仓库、柜台、产品形态、产品形式”等非 SCAME 技术参数词填入 product_type、install_mode 或 orientation。
- 如果用户同时说“想要插座”和“产品形式：货架”，应确认 product_type 为插座，并忽略货架这个无效技术参数值。
- 数据中心、列头柜、暂不需要插头、报价语境下，可推断为插座、暗装、直式、需要配套插头推荐，但必须写入 inferred_fields 和 confirmation_required。
- 如果客户多行报价，每一行商品需求都要放入 line_items。`;
}

function sanitizeParsedDemand(parsed: z.infer<typeof llmDemandSchema>): z.infer<typeof llmDemandSchema> {
  return {
    ...parsed,
    scenario: sanitizeScenario(parsed.scenario),
    product_type: sanitizeProductType(parsed.product_type),
    current: sanitizeCurrent(parsed.current),
    poles: sanitizePoles(parsed.poles),
    ip: sanitizeProtection(parsed.ip),
    clock: sanitizeClock(parsed.clock),
    voltage: sanitizeVoltage(parsed.voltage),
    install_mode: sanitizeInstallMode(parsed.install_mode),
    orientation: sanitizeOrientation(parsed.orientation),
    line_items: parsed.line_items.map((item) => ({
      ...item,
      product_type: sanitizeProductType(item.product_type),
      current: sanitizeCurrent(item.current),
      poles: sanitizePoles(item.poles),
      ip: sanitizeProtection(item.ip),
      clock: sanitizeClock(item.clock),
      voltage: sanitizeVoltage(item.voltage),
      install_mode: sanitizeInstallMode(item.install_mode),
      orientation: sanitizeOrientation(item.orientation),
    })),
  };
}

function sanitizeScenario(value: string): string {
  return /数据中心|列头柜|工厂|车间|户外|码头|矿山|轨道|铁路|电力|配电|设备柜/.test(value) ? value : '';
}

function sanitizeProductType(value: string): string {
  if (/机械|联锁/.test(value)) {
    return '机械联锁插座';
  }
  if (/插头|plug/i.test(value)) {
    return '插头';
  }
  if (/插座|socket/i.test(value)) {
    return '插座';
  }
  if (/连接器|connector/i.test(value)) {
    return '连接器';
  }
  return '';
}

function sanitizeCurrent(value: string): string {
  const match = value.match(/\b(16|32|63|125|160|250|420|800)\s*A?\b/i);
  return match ? `${match[1]}A` : '';
}

function sanitizePoles(value: string): string {
  const normalized = value.replace(/\bPE\b/gi, 'E').replace(/\s+/g, '').toUpperCase();
  return normalized.match(/\b(2P\+E|3P\+E|3P\+N\+E|3P)\b/)?.[1] ?? '';
}

function sanitizeProtection(value: string): string {
  return value.match(/\bIP(?:44\/IP54|66\/IP67\/IP69|44|54|66|67|69)\b/i)?.[0].toUpperCase() ?? '';
}

function sanitizeClock(value: string): string {
  return value.match(/\b([1-9]|1[0-2])\s*h?\b/i)?.[1] ?? '';
}

function sanitizeVoltage(value: string): string {
  if (/1000\s*V?/i.test(value)) {
    return '1000V';
  }
  return value.match(/\b(100-130|200-250|346-415|380-415|220-250)\s*V?\b/i)?.[1] ?? '';
}

function sanitizeInstallMode(value: string): string {
  if (/暗装/.test(value)) {
    return '暗装';
  }
  if (/明装/.test(value)) {
    return '明装';
  }
  return '';
}

function sanitizeOrientation(value: string): string {
  if (/直式/.test(value)) {
    return '直式';
  }
  if (/斜式/.test(value)) {
    return '斜式';
  }
  return '';
}

async function readJsonBody(req: NodeJS.ReadableStream): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function sendJson(res: { setHeader: (name: string, value: string) => void; end: (data: string) => void }, payload: unknown) {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(payload));
}

function estimateDeepseekCostCny(promptTokens: number, completionTokens: number): number {
  const inputCost = (promptTokens / 1_000_000) * 1;
  const outputCost = (completionTokens / 1_000_000) * 2;
  return Number((inputCost + outputCost).toFixed(6));
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), deepseekProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/test/', '**/*.d.ts'],
      },
    },
  };
});
