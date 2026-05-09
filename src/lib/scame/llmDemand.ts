export type LlmParseStatus = 'idle' | 'loading' | 'success' | 'fallback';

export interface LlmLineItem {
  raw_text?: string;
  quantity?: number | string;
  product_type?: string;
  current?: string;
  poles?: string;
  ip?: string;
  clock?: string;
  voltage?: string;
  install_mode?: string;
  orientation?: string;
}

export interface LlmParsedDemand {
  industry?: string;
  scenario?: string;
  quantity?: number | string;
  product_type?: string;
  current?: string;
  poles?: string;
  ip?: string;
  clock?: string;
  voltage?: string;
  install_mode?: string;
  orientation?: string;
  needs_companion_recommendation?: boolean;
  missing_fields?: string[];
  inferred_fields?: string[];
  confirmation_required?: string[];
  reasoning_notes?: string[];
  line_items?: LlmLineItem[];
}

export interface LlmUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  estimated_cost_cny: number;
}

export interface LlmParseResult {
  source: 'deepseek';
  model: string;
  parsed: LlmParsedDemand;
  usage: LlmUsage;
}

interface LlmFallbackResult {
  source: 'fallback';
  error?: string;
}

export async function parseDemandWithLlm(demand: string): Promise<LlmParseResult> {
  const response = await fetch('/api/llm/parse-demand', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ demand }),
  });

  if (!response.ok) {
    throw new Error('LLM parse request failed');
  }

  const result = (await response.json()) as LlmParseResult | LlmFallbackResult;

  if (result.source === 'fallback') {
    throw new Error(result.error || 'LLM parse request fell back');
  }

  return result;
}
