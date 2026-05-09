# Testing Patterns

**Analysis Date:** 2026-04-16

## Test Framework

**Runner:**
- Vitest 1.1.0 - Fast Vite-native test runner
- Config: `vite.config.ts` (test section)

**Assertion Library:**
- Vitest built-in assertions (Chai-style)
- Extended with `@testing-library/jest-dom` matchers

**Run Commands:**
```bash
npm test              # Run all tests
npm run test:ui       # Vitest UI mode
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run Playwright E2E tests
```

## Test File Organization

**Location:**
- Tests are co-located with source files (not yet implemented)
- Planned structure: `__tests__` directories or `.test.ts` files alongside source

**Naming:**
- `[filename].test.ts` for unit tests
- `[filename].test.tsx` for React component tests
- `[filename].spec.ts` for E2E tests

**Structure:**
```
tests/                    # Currently empty directory
src/                     # Source code
├── lib/
│   ├── scame/
│   │   ├── coding.ts    # Source
│   │   └── coding.test.ts # Planned test location
└── components/
    └── layout/
        ├── Header.tsx   # Source
        └── Header.test.tsx # Planned test location
```

## Test Structure

**Suite Organization:**
```typescript
// Example from existing code comments in src/lib/scame/coding.ts
describe('ScameCodingParser', () => {
  describe('parse', () => {
    it('should parse valid part number', () => {
      // Test implementation
    });
    
    it('should handle invalid format', () => {
      // Test implementation
    });
  });
  
  describe('generateReplacements', () => {
    it('should generate correct replacement suggestions', () => {
      // Test implementation
    });
  });
});
```

**Patterns:**
- Use `describe` blocks to group related tests
- Use `it` or `test` for individual test cases
- Follow Arrange-Act-Assert pattern
- Include clear test descriptions

## Mocking

**Framework:** Vitest vi.mock() API

**Patterns:**
```typescript
// Example mocking pattern (based on Vitest conventions)
import { vi } from 'vitest';
import { someModule } from './someModule';

vi.mock('./someModule', () => ({
  someFunction: vi.fn().mockReturnValue('mocked value'),
}));

describe('Component using mocked module', () => {
  it('should use mocked function', () => {
    // Test implementation
  });
});
```

**What to Mock:**
- External API calls
- File system operations
- Browser APIs (localStorage, fetch, etc.)
- Complex dependencies with side effects

**What NOT to Mock:**
- Pure utility functions
- Simple data transformations
- TypeScript interfaces and types
- Constants and configuration

## Fixtures and Factories

**Test Data:**
```typescript
// Example from src/lib/scame/coding.ts comments
const TEST_PART_NUMBERS = {
  valid: [
    '513.63532T',  // OPTIMA-TOP 63A 3P+E IP44
    '213.32370',   // OPTIMA 32A 3P+E IP44
    '899.AL1AB123', // High current product
  ],
  invalid: [
    'invalid',
    '123',         // Missing suffix
    '123.456',     // Too short
  ],
  edgeCases: [
    '213.16320',   // Minimum valid
    '899.AS9ZZ999', // Maximum high current
  ],
} as const;
```

**Location:**
- Planned: `tests/fixtures/` directory
- Test data factories for generating mock objects
- Reusable fixture objects for common test scenarios

## Coverage

**Requirements:** Not yet enforced (coverage configuration exists)

**View Coverage:**
```bash
npm run test:coverage
```

**Coverage Configuration (from vite.config.ts):**
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/', 'src/test/', '**/*.d.ts'],
  },
}
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, classes, and components
- Approach: Isolated testing with mocked dependencies
- Location: Co-located with source files
- Examples: `ScameCodingParser.parse()`, `extractCurrentCode()`

**Integration Tests:**
- Scope: Component interactions, API integrations
- Approach: Test groups of components working together
- Location: Separate integration test files
- Examples: Product selection flow, form validation

**E2E Tests:**
- Framework: Playwright 1.40.1
- Scope: Complete user workflows
- Approach: Browser automation with real user interactions
- Location: `tests/e2e/` directory (planned)
- Examples: Complete selection workflow, error handling scenarios

## Common Patterns

**Async Testing:**
```typescript
// Pattern for async functions
describe('Async operations', () => {
  it('should handle async parsing', async () => {
    const result = await asyncParseFunction(partNumber);
    expect(result.isValid).toBe(true);
  });
  
  it('should handle async errors', async () => {
    await expect(asyncErrorFunction()).rejects.toThrow('Error message');
  });
});
```

**Error Testing:**
```typescript
// Pattern for error cases
describe('Error handling', () => {
  it('should return errors for invalid input', () => {
    const result = parsePartNumber('invalid');
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('订货号格式不正确');
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  it('should include warnings for non-fatal issues', () => {
    const result = parsePartNumber('213.99999');
    
    expect(result.isValid).toBe(false);
    expect(result.warnings).toContain('无法识别的产品系列前缀');
  });
});
```

**React Component Testing:**
```typescript
// Pattern for React components (planned)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ProductCard', () => {
  const mockProduct = {
    id: '513.63532T',
    name: 'OPTIMA-TOP 63A 3P+E IP44',
    current: '63A',
    poles: '3P+E',
    protection: 'IP44/IP54',
  };
  
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('OPTIMA-TOP 63A 3P+E IP44')).toBeInTheDocument();
    expect(screen.getByText('63A')).toBeInTheDocument();
  });
  
  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const mockOnSelect = vi.fn();
    
    render(<ProductCard product={mockProduct} onSelect={mockOnSelect} />);
    
    const selectButton = screen.getByRole('button', { name: /select/i });
    await user.click(selectButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('513.63532T');
  });
});
```

## SCAME-Specific Testing Patterns

**Technical Accuracy Tests:**
```typescript
// Must verify against official SCAME documentation
describe('SCAME Technical Accuracy', () => {
  const OFFICIAL_TEST_CASES = [
    {
      partNumber: '513.63532T',
      expected: {
        current: '63A',
        poles: '3P+E',
        protection: 'IP44/IP54',
        series: 'OPTIMA-TOP',
      },
      source: 'SCAME官方手册',
    },
    // More official test cases...
  ];
  
  OFFICIAL_TEST_CASES.forEach(({ partNumber, expected, source }) => {
    test(`matches ${source} for ${partNumber}`, () => {
      const result = parsePartNumber(partNumber);
      
      expect(result.isValid).toBe(true);
      expect(result.current).toBe(expected.current);
      expect(result.poles).toBe(expected.poles);
      expect(result.protection).toBe(expected.protection);
      expect(result.series).toBe(expected.series);
    });
  });
});
```

**No-Hallucination Tests:**
```typescript
// Ensure system never invents technical parameters
describe('No Technical Hallucinations', () => {
  test('rejects invalid part numbers with clear errors', () => {
    const invalidCases = [
      '999.99999',  // Non-existent category
      '513.99999',  // Non-existent configuration
      '213.99999',  // Invalid format
    ];
    
    invalidCases.forEach(partNumber => {
      const result = parsePartNumber(partNumber);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should not guess or invent values
      expect(result.current).not.toBe('16A'); // Default fallback
    });
  });
});
```

**Replacement Rule Tests:**
```typescript
// Test SCAME golden replacement rules
describe('Golden Replacement Rules', () => {
  const REPLACEMENT_CASES = [
    {
      original: '213.32370',
      expected: ['313.32370', '413.32370', '513.32370'],
      relationships: [
        '插头 → 移动连接器',
        '插头 → 暗装插座',
        '插头 → 明装插座',
      ],
    },
  ];
  
  REPLACEMENT_CASES.forEach(({ original, expected, relationships }) => {
    test(`generates correct replacements for ${original}`, () => {
      const parser = new ScameCodingParser();
      const replacements = parser.generateReplacements(original);
      
      expect(replacements).toHaveLength(expected.length);
      
      replacements.forEach((replacement, index) => {
        expect(replacement.replacement).toBe(expected[index]);
        expect(replacement.relationship).toBe(relationships[index]);
        expect(replacement.confidence).toBeGreaterThan(0.7);
      });
    });
  });
});
```

## Test Setup and Configuration

**Global Setup:**
```typescript
// Planned: src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mocks
vi.mock('@/lib/api', () => ({
  fetchProducts: vi.fn(),
}));

// Global test utilities
global.testProduct = {
  id: '513.63532T',
  name: 'OPTIMA-TOP 63A 3P+E IP44',
  // ... other properties
};
```

**Environment Configuration:**
- Test environment: `jsdom` (configured in vite.config.ts)
- Global flags: `globals: true` for Vitest
- TypeScript support: `vitest/globals` types included

## Test Execution Strategy

**Development Workflow:**
1. Write test alongside implementation
2. Run unit tests during development
3. Run integration tests before commits
4. Run E2E tests before merging

**CI/CD Integration:**
- Linting and type checking first
- Unit tests with coverage reporting
- Integration tests
- E2E tests on multiple browsers
- Performance and accessibility tests

## Current Test Status

**Implemented:**
- Test configuration in `vite.config.ts`
- Package dependencies for testing frameworks
- TypeScript configuration for test globals
- Basic test structure patterns in code comments

**Pending Implementation:**
- Actual test files (directory currently empty)
- Test fixtures and factories
- Coverage enforcement thresholds
- CI/CD test pipeline
- E2E test suite

**Recommended Next Steps:**
1. Create `src/test/setup.ts` for global test configuration
2. Add unit tests for `src/lib/scame/coding.ts`
3. Add component tests for key React components
4. Set up test data fixtures
5. Configure coverage thresholds
6. Implement E2E tests with Playwright

---

*Testing analysis: 2026-04-16*