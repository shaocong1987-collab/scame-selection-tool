// 测试环境配置
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 全局测试配置
global.console = {
  ...console,
  // 在测试中静音某些日志
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// 配置fetch模拟
global.fetch = vi.fn();

// 测试环境变量
process.env.NODE_ENV = 'test';

// 清理测试环境
afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});