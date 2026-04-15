# SCAME Selection Tool - Testing Strategy and Practices

## Overview

This document defines the testing strategy, tools, and practices for the SCAME Selection Tool. Testing is critical to ensure technical accuracy, reliability, and user confidence in the selection recommendations.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Testing Tools](#testing-tools)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Test Organization](#test-organization)
8. [Test Data Management](#test-data-management)
9. [Test Coverage](#test-coverage)
10. [CI/CD Integration](#cicd-integration)
11. [SCAME-Specific Testing](#scame-specific-testing)
12. [Performance Testing](#performance-testing)
13. [Accessibility Testing](#accessibility-testing)

## Testing Philosophy

### Core Principles
1. **Technical Accuracy First**: All SCAME product specifications must be tested against official documentation
2. **No Technical Hallucinations**: Test that the system never invents or approximates technical parameters
3. **Defense in Depth**: Multiple layers of testing to catch different types of issues
4. **Fast Feedback**: Tests should run quickly to enable rapid development
5. **Deterministic Tests**: Tests should be reliable and not flaky

### Testing Goals
- **Reliability**: Ensure the system produces correct technical recommendations
- **Accuracy**: Verify all SCAME coding rules and technical specifications
- **Usability**: Test user interactions and workflows
- **Performance**: Ensure acceptable response times
- **Security**: Validate input sanitization and data protection

## Testing Pyramid

```
        /¯¯¯¯¯¯¯¯¯¯\
       /  E2E Tests  \      ~10% of tests
      /______________\
     /                \
    / Integration Tests \   ~20% of tests
   /____________________\
  /                      \
 /     Unit Tests         \  ~70% of tests
/__________________________\
```

### Test Distribution
- **Unit Tests**: 70% - Test individual functions and components in isolation
- **Integration Tests**: 20% - Test interactions between components
- **E2E Tests**: 10% - Test complete user workflows

## Testing Tools

### Test Framework Stack
```json
{
  "unit": {
    "framework": "Vitest",
    "assertion": "Vitest assertions",
    "mocking": "Vitest vi.mock()",
    "coverage": "V8 coverage provider"
  },
  "component": {
    "framework": "React Testing Library",
    "render": "@testing-library/react",
    "user events": "@testing-library/user-event",
    "matchers": "@testing-library/jest-dom"
  },
  "e2e": {
    "framework": "Playwright",
    "browsers": "Chromium, Firefox, WebKit",
    "reporting": "Playwright HTML reporter"
  }
}
```

### Configuration Files
- **vite.config.ts**: Vitest configuration
- **playwright.config.ts**: Playwright configuration
- **src/test/setup.ts**: Test setup and global configurations

## Unit Testing

### Testing Business Logic
```typescript
// Example: Testing SCAME coding parser
import { parsePartNumber, ScameCodingParser } from '@/lib/scame/coding';

describe('ScameCodingParser', () => {
  describe('parsePartNumber', () => {
    it('should parse valid OPTIMA part number', () => {
      const result = parsePartNumber('513.63532T');
      
      expect(result.isValid).toBe(true);
      expect(result.current).toBe('63A');
      expect(result.poles).toBe('3P+E');
      expect(result.protection).toBe('IP44/IP54');
      expect(result.series).toBe('OPTIMA-TOP');
    });

    it('should reject invalid format', () => {
      const result = parsePartNumber('invalid');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('订货号格式不正确');
    });

    it('should handle edge cases', () => {
      // Test boundary conditions
      const edgeCases = [
        '213.16320',  // Minimum valid
        '899.AL1AB123', // High current format
        '513.63532T', // With variant
      ];

      edgeCases.forEach(partNumber => {
        const result = parsePartNumber(partNumber);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('generateReplacements', () => {
    it('should generate correct replacement suggestions', () => {
      const parser = new ScameCodingParser();
      const replacements = parser.generateReplacements('213.32370');
      
      expect(replacements).toHaveLength(3);
      expect(replacements[0].relationship).toBe('插头 → 移动连接器');
      expect(replacements[0].confidence).toBeGreaterThan(0.7);
    });
  });
});
```

### Testing React Components
```typescript
// Example: Testing ProductCard component
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '@/components/product/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '513.63532T',
    name: 'OPTIMA-TOP 63A 3P+E IP44',
    current: '63A',
    poles: '3P+E',
    protection: 'IP44/IP54',
    series: 'OPTIMA-TOP'
  };

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} onSelect={mockOnSelect} />);
    
    expect(screen.getByText('OPTIMA-TOP 63A 3P+E IP44')).toBeInTheDocument();
    expect(screen.getByText('63A')).toBeInTheDocument();
    expect(screen.getByText('3P+E')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onSelect={mockOnSelect} />);
    
    const selectButton = screen.getByRole('button', { name: /select/i });
    await user.click(selectButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('513.63532T');
  });

  it('should show selected state', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onSelect={mockOnSelect}
        isSelected={true}
      />
    );
    
    expect(screen.getByTestId('product-card')).toHaveClass('selected');
  });
});
```

### Testing Hooks
```typescript
// Example: Testing custom hook
import { renderHook, act } from '@testing-library/react';
import { useProductSelection } from '@/hooks/useProductSelection';

describe('useProductSelection', () => {
  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useProductSelection());
    
    expect(result.current.selectedProducts).toEqual([]);
    expect(result.current.selectionCount).toBe(0);
  });

  it('should add product to selection', () => {
    const { result } = renderHook(() => useProductSelection());
    
    act(() => {
      result.current.selectProduct('513.63532T');
    });
    
    expect(result.current.selectedProducts).toContain('513.63532T');
    expect(result.current.selectionCount).toBe(1);
  });

  it('should not add duplicate products', () => {
    const { result } = renderHook(() => useProductSelection());
    
    act(() => {
      result.current.selectProduct('513.63532T');
      result.current.selectProduct('513.63532T');
    });
    
    expect(result.current.selectionCount).toBe(1);
  });
});
```

## Integration Testing

### Component Integration Tests
```typescript
// Example: Testing product selection flow
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductSelectionPage from '@/pages/ProductSelectionPage';
import { ProductProvider } from '@/contexts/ProductContext';

describe('ProductSelectionPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          {component}
        </ProductProvider>
      </QueryClientProvider>
    );
  };

  it('should load and display products', async () => {
    renderWithProviders(<ProductSelectionPage />);
    
    // Show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('OPTIMA-TOP 63A 3P+E IP44')).toBeInTheDocument();
    });
  });

  it('should filter products by current rating', async () => {
    renderWithProviders(<ProductSelectionPage />);
    
    await waitFor(() => {
      expect(screen.getByText('OPTIMA-TOP 63A 3P+E IP44')).toBeInTheDocument();
    });
    
    // Select 32A filter
    const filterButton = screen.getByRole('button', { name: '32A' });
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      expect(screen.queryByText('OPTIMA-TOP 63A 3P+E IP44')).not.toBeInTheDocument();
      expect(screen.getByText('OPTIMA-TOP 32A 3P+E IP44')).toBeInTheDocument();
    });
  });
});
```

### API Integration Tests
```typescript
// Example: Testing API integration
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { useProductQuery } from '@/hooks/useProductQuery';

const server = setupServer(
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '513.63532T', name: 'OPTIMA-TOP 63A 3P+E IP44' },
      { id: '513.32370', name: 'OPTIMA-TOP 32A 3P+E IP44' },
    ]);
  })
);

describe('useProductQuery', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should fetch products from API', async () => {
    const { result } = renderHook(() => useProductQuery());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].id).toBe('513.63532T');
  });

  it('should handle API errors', async () => {
    server.use(
      http.get('/api/products', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    const { result } = renderHook(() => useProductQuery());
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    
    expect(result.current.error).toBeDefined();
  });
});
```

## End-to-End Testing

### Playwright Test Structure
```typescript
// Example: E2E test for product selection workflow
import { test, expect } from '@playwright/test';

test.describe('Product Selection Workflow', () => {
  test('should complete product selection', async ({ page }) => {
    // Navigate to application
    await page.goto('/');
    
    // Verify landing page
    await expect(page).toHaveTitle(/SCAME选型工具/);
    await expect(page.getByText('智能工业电气选型系统')).toBeVisible();
    
    // Navigate to forward selection
    await page.getByRole('link', { name: '正向选型' }).click();
    
    // Fill selection parameters
    await page.selectOption('select[name="current"]', '63A');
    await page.selectOption('select[name="poles"]', '3P+E');
    await page.selectOption('select[name="protection"]', 'IP44/IP54');
    
    // Submit selection
    await page.getByRole('button', { name: '查找产品' }).click();
    
    // Verify results
    await expect(page.getByText('找到 3 个匹配产品')).toBeVisible();
    await expect(page.getByText('OPTIMA-TOP 63A 3P+E IP44')).toBeVisible();
    
    // Select a product
    await page.getByRole('button', { name: '选择', exact: true }).first().click();
    
    // Verify selection confirmation
    await expect(page.getByText('已选择 1 个产品')).toBeVisible();
  });

  test('should handle invalid parameters', async ({ page }) => {
    await page.goto('/forward-selection');
    
    // Submit without required parameters
    await page.getByRole('button', { name: '查找产品' }).click();
    
    // Verify validation errors
    await expect(page.getByText('请选择电流规格')).toBeVisible();
    await expect(page.getByText('请选择极数配置')).toBeVisible();
  });
});
```

### Cross-Browser Testing
```typescript
// Example: Cross-browser test configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

## Test Organization

### Directory Structure
```
tests/
├── unit/                    # Unit tests
│   ├── lib/               # Business logic tests
│   │   ├── scame/        # SCAME coding tests
│   │   │   ├── coding.test.ts
│   │   │   ├── matching.test.ts
│   │   │   └── validation.test.ts
│   │   └── rag/          # RAG system tests
│   │       ├── ScameRAGService.test.ts
│   │       └── VectorStore.test.ts
│   ├── components/        # Component unit tests
│   │   ├── product/
│   │   ├── selection/
│   │   └── layout/
│   ├── hooks/            # Custom hook tests
│   └── utils/            # Utility function tests
├── integration/           # Integration tests
│   ├── components/       # Component integration
│   ├── api/             # API integration
│   └── workflows/       # User workflow tests
├── e2e/                  # End-to-end tests
│   ├── selection/       # Selection workflows
│   ├── navigation/      # Navigation tests
│   ├── error-handling/  # Error scenarios
│   └── performance/     # Performance tests
├── fixtures/             # Test data and fixtures
│   ├── products/        # Product test data
│   ├── documents/       # RAG document fixtures
│   └── users/          # User test data
└── mocks/               # Mock implementations
    ├── api/            # API mocks
    ├── services/       # Service mocks
    └── browser/        # Browser API mocks
```

### Test File Naming
- **Unit Tests**: `[filename].test.ts` or `[filename].test.tsx`
- **Integration Tests**: `[filename].integration.test.ts`
- **E2E Tests**: `[feature].spec.ts` in e2e directory
- **Test Utilities**: `test-utils.ts` or `test-helpers.ts`

## Test Data Management

### Test Fixtures
```typescript
// Example: Product test fixtures
export const PRODUCT_FIXTURES = {
  validProducts: [
    '513.63532T',  // OPTIMA-TOP 63A 3P+E IP44
    '213.32370',   // OPTIMA 32A 3P+E IP44
    '899.AL1AB123', // High current product
  ],
  
  invalidProducts: [
    'invalid',
    '123',         // Missing suffix
    '123.456',     // Too short
    '123.456789',  // Too long
  ],
  
  edgeCases: [
    '213.16320',   // Minimum valid
    '899.AS9ZZ999', // Maximum high current
    '513.63532T',  // With variant
  ],
} as const;
```

### Mock Data Factories
```typescript
// Example: Factory for test data
import { faker } from '@faker-js/faker';

export function createMockProduct(overrides = {}) {
  const baseProduct = {
    id: `513.${faker.string.numeric(5)}T`,
    name: `OPTIMA-TOP ${faker.helpers.arrayElement(['16A', '32A', '63A'])} 3P+E IP44`,
    current: faker.helpers.arrayElement(['16A', '32A', '63A']),
    poles: faker.helpers.arrayElement(['2P+E', '3P+E', '3P+N+E']),
    protection: faker.helpers.arrayElement(['IP44', 'IP54', 'IP66']),
    series: 'OPTIMA-TOP',
    price: faker.commerce.price({ min: 100, max: 1000 }),
    stock: faker.number.int({ min: 0, max: 100 }),
  };
  
  return { ...baseProduct, ...overrides };
}
```

### Test Data Isolation
- Each test should be independent
- Reset state between tests
- Use beforeEach/afterEach for cleanup
- Mock external dependencies

## Test Coverage

### Coverage Requirements
```typescript
// Minimum coverage thresholds
const COVERAGE_THRESHOLDS = {
  statements: 80,
  branches: 75,
  functions: 85,
  lines: 80,
};
```

### Coverage Configuration
```typescript
// vite.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts', // Barrel files
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 85,
        lines: 80,
      },
    },
  },
});
```

### Coverage Reports
- **Text**: Console output for quick feedback
- **JSON**: For CI/CD integration
- **HTML**: Detailed browser-based report
- **LCOV**: For code coverage badges

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Unit tests
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: E2E tests
      run: npm run test:e2e
    
    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Quality Gates
- **Linting**: Must pass with no errors
- **Type Checking**: Must pass with no errors
- **Unit Tests**: Must pass with required coverage
- **E2E Tests**: Must pass critical path tests
- **Build**: Must succeed without errors

## SCAME-Specific Testing

### Technical Accuracy Tests
```typescript
describe('SCAME Technical Accuracy', () => {
  // Test against official SCAME documentation
  const OFFICIAL_SPECIFICATIONS = [
    {
      partNumber: '513.63532T',
      expected: {
        current: '63A',
        poles: '3P+E',
        protection: 'IP44/IP54',
        voltage: '380-415V',
        series: 'OPTIMA-TOP',
      },
      source: 'SCAME官方手册第45页',
    },
    // More official specifications...
  ];

  OFFICIAL_SPECIFICATIONS.forEach(({ partNumber, expected, source }) => {
    test(`should match official specification for ${partNumber} (${source})`, () => {
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

### No-Hallucination Tests
```typescript
describe('No Technical Hallucinations', () => {
  test('should never invent technical parameters', () => {
    const invalidPartNumbers = [
      '999.99999',  // Non-existent category
      '513.99999',  // Non-existent current
      '213.99999',  // Non-existent configuration
    ];
    
    invalidPartNumbers.forEach(partNumber => {
      const result = parsePartNumber(partNumber);
      
      // Should not create fake technical parameters
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Should not have guessed values
      if (result.current) {
        expect(CURRENT_BY_CODE).toHaveProperty(
          Object.keys(CURRENT_BY_CODE).find(
            key => CURRENT_BY_CODE[key] === result.current
          )
        );
      }
    });
  });
});
```

### Replacement Rule Tests
```typescript
describe('Golden Replacement Rules', () => {
  const REPLACEMENT_TEST_CASES = [
    {
      original: '213.32370',
      expectedReplacements: ['313.32370', '413.32370', '513.32370'],
      relationships: [
        '插头 → 移动连接器',
        '插头 → 暗装插座',
        '插头 → 明装插座',
      ],
    },
    // More replacement test cases...
  ];

  REPLACEMENT_TEST_CASES.forEach(({ original, expectedReplacements, relationships }) => {
    test(`should generate correct replacements for ${original}`, () => {
      const parser = new ScameCodingParser();
      const replacements = parser.generateReplacements(original);
      
      expect(replacements).toHaveLength(expectedReplacements.length);
      
      replacements.forEach((replacement, index) => {
        expect(replacement.replacement).toBe(expectedReplacements[index]);
        expect(replacement.relationship).toBe(relationships[index]);
        expect(replacement.confidence).toBeGreaterThan(0.7);
      });
    });
  });
});
```

## Performance Testing

### Load Testing
```typescript
// Example: Performance test for critical paths
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load selection page within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/forward-selection');
    
    await expect(page.getByText('正向选型')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 2 seconds
    
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('should search products within 1 second', async ({ page }) => {
    await page.goto('/forward-selection');
    
    // Fill search criteria
    await page.selectOption('select[name="current"]', '63A');
    
    const startTime = Date.now();
    await page.getByRole('button', { name: '查找产品' }).click();
    
    await expect(page.getByText('找到产品')).toBeVisible();
    
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(1000); // 1 second
    
    console.log(`Product search completed in ${searchTime}ms`);
  });
});
```

### Memory Leak Tests
```typescript
// Example: Memory leak detection
describe('Memory Management', () => {
  test('should not leak memory during product parsing', () => {
    const parser = new ScameCodingParser();
    const iterations = 1000;
    
    const initialMemory = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < iterations; i++) {
      parser.parse(`513.${String(i).padStart(5, '0')}`);
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Allow some increase but not exponential
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
  });
});
```

## Accessibility Testing

### Automated Accessibility Tests
```typescript
// Example: Accessibility testing with Playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('href', '/');
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('正向选型');
    
    // Test enter key on links
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/forward-selection');
  });
});
```

### Screen Reader Compatibility
```typescript
test('should have proper ARIA labels', async ({ page }) => {
  await page.goto('/forward-selection');
  
  // Check form controls
  const currentSelect = page.getByLabel('电流规格');
  await expect(currentSelect).toBeVisible();
  await expect(currentSelect).toHaveAttribute('aria-required', 'true');
  
  // Check search button
  const searchButton = page.getByRole('button', { name: '查找产品' });
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toBeEnabled();
});
```

## Test Maintenance

### Test Documentation
- Document test purpose in describe/it blocks
- Include references to requirements or user stories
- Note any assumptions or preconditions
- Document test data sources

### Test Review Checklist
- [ ] Tests are independent and isolated
- [ ] Tests cover edge cases and error scenarios
- [ ] Tests are not flaky or timing-dependent
- [ ] Test data is appropriate and realistic
- [ ] Tests follow naming conventions
- [ ] Tests have clear assertions
- [ ] Tests clean up after themselves
- [ ] Tests are properly organized

### Test Refactoring
- Extract common test setup to helpers
- Use factory functions for test data
- Group related tests in describe blocks
- Remove duplicate test logic
- Update tests when requirements change

## Conclusion

This testing strategy ensures that the SCAME Selection Tool is reliable, accurate, and user-friendly. The multi-layered approach provides defense in depth, catching issues at different levels of the application.

Remember: **Technical accuracy is non-negotiable**. All tests related to SCAME product specifications must be verified against official documentation.

---

*Last Updated: 2026-04-15*  
*Version: 1.0*  
*Based on analysis of existing codebase and project requirements*