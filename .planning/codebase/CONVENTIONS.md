# SCAME Selection Tool - Code Conventions and Standards

## Overview

This document defines the coding conventions, standards, and best practices for the SCAME Selection Tool codebase. These conventions ensure code consistency, maintainability, and adherence to industry best practices.

## Table of Contents

1. [General Principles](#general-principles)
2. [File Organization](#file-organization)
3. [Naming Conventions](#naming-conventions)
4. [TypeScript Conventions](#typescript-conventions)
5. [React Conventions](#react-conventions)
6. [Code Formatting](#code-formatting)
7. [Import/Export Patterns](#importexport-patterns)
8. [Commenting and Documentation](#commenting-and-documentation)
9. [Error Handling](#error-handling)
10. [Performance Guidelines](#performance-guidelines)
11. [Security Guidelines](#security-guidelines)

## General Principles

### 1. Technical Accuracy First
- All SCAME product specifications must be accurate and verifiable
- No technical parameter hallucinations allowed
- Reference official SCAME documentation for all technical decisions

### 2. Code Quality Standards
- TypeScript strict mode enabled
- ESLint with strict rules
- Prettier for consistent formatting
- Comprehensive type definitions

### 3. Developer Experience
- Clear error messages
- Intuitive APIs
- Consistent patterns
- Good documentation

## File Organization

### Directory Structure
```
src/
├── components/           # React components
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   ├── product/         # Product-related components
│   ├── rag/             # RAG-related components
│   └── selection/       # Selection-related components
├── lib/                 # Library and utility code
│   ├── rag/            # RAG system implementation
│   └── scame/          # SCAME-specific business logic
├── pages/              # Page components
├── routes/             # Routing configuration
└── styles/             # Global styles
```

### File Naming Patterns
- **Components**: PascalCase with `.tsx` extension (`ComponentName.tsx`)
- **Utilities/Functions**: camelCase with `.ts` extension (`utilityName.ts`)
- **Types/Interfaces**: PascalCase with `.ts` extension (`TypeName.ts`)
- **Constants**: UPPER_SNAKE_CASE with `.ts` extension (`CONSTANTS.ts`)
- **Test Files**: Same name as source with `.test.ts` suffix
- **Configuration Files**: Lowercase with appropriate extension (`.config.js`, `.rc.json`)

## Naming Conventions

### Variables and Functions
```typescript
// ✅ Correct
const productList = [];
const currentRating = '16A';
function calculateTotal() {}
const isValidPartNumber = true;

// ❌ Incorrect
const ProductList = [];  // Should be camelCase
const current_rating = '16A';  // Should be camelCase
function CalculateTotal() {}  // Should be camelCase
const is_valid_part_number = true;  // Should be camelCase
```

### React Components
```typescript
// ✅ Correct - PascalCase for components
const ProductCard: React.FC = () => {};
export default ProductCard;

// ✅ Correct - Props interface
interface ProductCardProps {
  productId: string;
  onSelect: (id: string) => void;
}

// ❌ Incorrect
const product_card = () => {};  // Should be PascalCase
```

### TypeScript Types and Interfaces
```typescript
// ✅ Correct - PascalCase for types/interfaces
interface ParsedPartNumber {
  partNumber: string;
  isValid: boolean;
}

type VoltageRange = '24V' | '40-50V' | '100-130V';

enum ProductCategory {
  CIVILIAN = '民用面板及附件',
  INPUT_PLUG = '输入端/工业插头/器具插座'
}

// ❌ Incorrect
interface parsed_part_number {}  // Should be PascalCase
type voltage_range = string;     // Should be PascalCase
```

### Constants
```typescript
// ✅ Correct - UPPER_SNAKE_CASE for constants
const MAX_PRODUCTS_PER_PAGE = 50;
const DEFAULT_CURRENT_RATING = '16A';
const SCAME_BLUE = '#0066CC';

// ❌ Incorrect
const maxProductsPerPage = 50;  // Should be UPPER_SNAKE_CASE
const DefaultCurrentRating = '16A';  // Should be UPPER_SNAKE_CASE
```

## TypeScript Conventions

### Type Definitions
```typescript
// ✅ Use interfaces for object shapes
interface Product {
  id: string;
  name: string;
  currentRating: CurrentRating;
  voltageRange: VoltageRange;
}

// ✅ Use type aliases for unions, tuples, or complex types
type SelectionResult = Product | null;
type ProductFilter = (product: Product) => boolean;

// ✅ Use enums for fixed sets of values
enum ProtectionRating {
  IP44 = 'IP44',
  IP54 = 'IP54',
  IP66 = 'IP66'
}

// ❌ Avoid using `any` type
// ❌ Avoid using `Function` type
```

### Strict Mode Compliance
- `strict: true` enabled in tsconfig.json
- No implicit `any` types
- Strict null checks
- Strict function types
- Strict property initialization

### Type Guards and Assertions
```typescript
// ✅ Type guards for runtime type checking
function isProduct(obj: unknown): obj is Product {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'currentRating' in obj
  );
}

// ✅ Type assertions only when necessary
const element = document.getElementById('root') as HTMLElement;

// ❌ Avoid unnecessary type assertions
// ❌ Avoid using `as any` to bypass type checking
```

## React Conventions

### Component Structure
```typescript
// ✅ Functional components with TypeScript
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  // Component logic here
  
  return (
    <div className="product-card">
      {/* JSX content */}
    </div>
  );
};

export default ProductCard;
```

### Props and State Management
```typescript
// ✅ Define props interface
interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  isSelected?: boolean;
  className?: string;
}

// ✅ Use hooks for state management
const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
const { data, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

// ✅ Use Zustand for global state
const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
```

### Event Handlers
```typescript
// ✅ Inline handlers for simple logic
<button onClick={() => handleSelect(product.id)}>Select</button>

// ✅ Named handlers for complex logic
const handleProductSelect = useCallback((productId: string) => {
  // Complex logic here
  onSelect(productId);
  trackAnalytics('product_selected', { productId });
}, [onSelect]);

// ✅ Event handler typing
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};
```

### Styling with Tailwind CSS
```typescript
// ✅ Use Tailwind utility classes
<div className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow">
  {/* Content */}
</div>

// ✅ Use clsx/tailwind-merge for conditional classes
const cardClasses = clsx(
  'product-card',
  isSelected && 'border-2 border-scame-blue',
  className
);

// ✅ Extract complex styles to CSS when needed
// (Use sparingly - prefer Tailwind utilities)
```

## Code Formatting

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### Code Organization
```typescript
// ✅ Logical grouping with separators
// ============================================================================
// Type Definitions
// ============================================================================

interface Product {
  id: string;
  name: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PRODUCTS: Product[] = [];

// ============================================================================
// Functions
// ============================================================================

function processProduct(product: Product) {
  // Function implementation
}

// ✅ One export per line for clarity
export { Product };
export { DEFAULT_PRODUCTS };
export { processProduct };
```

### Line Length and Spacing
- Maximum line length: 100 characters
- Use 2 spaces for indentation (no tabs)
- Blank lines between logical sections
- No trailing whitespace

## Import/Export Patterns

### Import Order
```typescript
// 1. React and core libraries
import React from 'react';
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

// 3. Internal modules (absolute imports with @ alias)
import { Product } from '@/types/product';
import { parsePartNumber } from '@/lib/scame/coding';

// 4. Relative imports
import ProductCard from './ProductCard';
import { useProductStore } from '../stores/productStore';

// 5. CSS/Assets
import './ProductList.css';
```

### Export Patterns
```typescript
// ✅ Named exports for utilities and types
export interface Product { /* ... */ }
export function parsePartNumber(partNumber: string) { /* ... */ }
export const DEFAULT_CURRENT = '16A';

// ✅ Default export for React components
const ProductCard: React.FC = () => { /* ... */ };
export default ProductCard;

// ✅ Barrel exports for modules
// In lib/scame/index.ts:
export * from './coding';
export * from './matching';
export * from './validation';
```

### Path Aliases
- `@/` → `src/` (configured in vite.config.ts and tsconfig.json)
- Use absolute imports for better refactoring
```typescript
// ✅ Use path aliases
import { ProductCard } from '@/components/product/ProductCard';
import { parsePartNumber } from '@/lib/scame/coding';

// ❌ Avoid deep relative imports
import { ProductCard } from '../../../../components/product/ProductCard';
```

## Commenting and Documentation

### JSDoc Comments
```typescript
/**
 * 解析SCAME订货号
 * 
 * 基于SCAME官方编码规则，实现订货号解析、验证和替换功能。
 * 严格遵守SCAME编码规范，严禁技术参数幻觉。
 * 
 * @param partNumber - 订货号，如 "513.63532T"
 * @returns 解析结果，包含技术参数和验证状态
 * @throws {Error} 当订货号格式无效时抛出错误
 * @example
 * const result = parsePartNumber("513.63532T");
 * console.log(result.current); // "63A"
 * console.log(result.isValid); // true
 */
export function parsePartNumber(partNumber: string): ParsedPartNumber {
  // Implementation
}
```

### Inline Comments
```typescript
// ✅ Explain "why" not "what"
// 使用黄金替换法则：插头(2xx)可以替换为连接器(3xx)、暗装(4xx)、明装(5xx)
const replacementRules = {
  '2': ['3', '4', '5'],
  '3': ['2', '4', '5'],
  '4': ['2', '3', '5'],
  '5': ['2', '3', '4']
};

// ✅ Complex logic deserves explanation
// 处理大电流产品(899开头)的特殊格式
if (partNumber.startsWith('899')) {
  // 大电流产品使用不同的解析规则
  return parseHighCurrentPartNumber(partNumber);
}

// ❌ Avoid obvious comments
const count = 0; // 设置count为0
```

### TODO and FIXME Comments
```typescript
// TODO: 实现大电流产品的完整验证逻辑
// FIXME: 处理边界情况，当电流代码为3位数字时
// HACK: 临时解决方案，需要重构
// NOTE: 这个函数在RAG检索时被调用
```

## Error Handling

### Error Types
```typescript
// ✅ Custom error classes for different error types
class ScameValidationError extends Error {
  constructor(message: string, public partNumber: string) {
    super(message);
    this.name = 'ScameValidationError';
  }
}

class RagRetrievalError extends Error {
  constructor(message: string, public query: string) {
    super(message);
    this.name = 'RagRetrievalError';
  }
}

// ✅ Use error codes for API errors
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

### Error Handling Patterns
```typescript
// ✅ Try-catch with specific error handling
try {
  const result = parsePartNumber(partNumber);
  if (!result.isValid) {
    throw new ScameValidationError('无效的订货号', partNumber);
  }
  return result;
} catch (error) {
  if (error instanceof ScameValidationError) {
    // Handle validation errors
    logger.warn('订货号验证失败', { partNumber, error });
    return { isValid: false, errors: [error.message] };
  }
  // Handle unexpected errors
  logger.error('解析过程中发生意外错误', { partNumber, error });
  throw error;
}

// ✅ Graceful degradation
function getProductDetails(productId: string): ProductDetails | null {
  try {
    return fetchProductDetails(productId);
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return null; // Return null instead of crashing
  }
}
```

### Validation Functions
```typescript
// ✅ Validate early and often
function validatePartNumber(partNumber: string): ValidationResult {
  const errors: string[] = [];
  
  if (!partNumber) {
    errors.push('订货号不能为空');
  }
  
  if (!/^\d{3}\.\d{4,6}$/.test(partNumber)) {
    errors.push('订货号格式不正确');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ✅ Return validation results with errors
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
```

## Performance Guidelines

### React Performance
```typescript
// ✅ Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});

// ✅ Use useCallback for event handlers
const handleSelect = useCallback((productId: string) => {
  setSelectedId(productId);
}, []);

// ✅ Use useMemo for expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.currentRating === selectedCurrent
  );
}, [products, selectedCurrent]);

// ✅ Lazy load components
const ProductDetail = React.lazy(() => import('@/components/ProductDetail'));
```

### Data Fetching
```typescript
// ✅ Use React Query for data fetching
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => fetchProducts(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// ✅ Implement pagination for large datasets
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['products'],
  queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### Bundle Optimization
- Use dynamic imports for code splitting
- Tree-shake unused imports
- Optimize images and assets
- Monitor bundle size with source maps

## Security Guidelines

### Input Validation
```typescript
// ✅ Validate all user inputs
function sanitizeUserInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>]/g, '');
}

// ✅ Use Zod for schema validation
const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  currentRating: z.enum(['16A', '20A', '30A', '32A']),
});

// ✅ Never trust client-side validation alone
// Always validate on the server as well
```

### API Security
```typescript
// ✅ Use environment variables for sensitive data
const API_KEY = import.meta.env.VITE_API_KEY;

// ✅ Implement rate limiting
// ✅ Use HTTPS for all API calls
// ✅ Sanitize database queries
// ✅ Implement proper authentication and authorization
```

### Code Security
- Regular dependency updates
- Security scanning of dependencies
- No hardcoded secrets in source code
- Use Content Security Policy (CSP)

## SCAME-Specific Conventions

### Product Coding Rules
```typescript
// ✅ Follow SCAME official coding rules
const PRODUCT_CATEGORIES = {
  '1': '民用面板及附件',
  '2': '输入端/工业插头/器具插座',
  '3': '移动输出端/连接器',
  '4': '暗装输出端/面板插座',
  '5': '明装及高阶控制端',
  '6': '箱体与基座',
  '7': '线缆盘与照明',
  '8': '安装辅材类',
  '899': '大电流产品(特例)'
} as const;

// ✅ Use TypeScript enums for fixed values
enum CurrentRating {
  A16 = '16A',
  A20 = '20A',
  A30 = '30A',
  A32 = '32A'
}
```

### Technical Accuracy
- All technical parameters must reference official SCAME documentation
- No approximations or guesses for technical specifications
- Clear distinction between verified and inferred information
- Document sources for all technical data

### RAG System Conventions
```typescript
// ✅ Document chunk structure
interface DocumentChunk {
  content: string;
  metadata: {
    source: string;  // Official document source
    type: 'manual' | 'training' | 'rule';
    page?: number;   // Reference to exact location
  };
}

// ✅ Confidence scoring for RAG results
interface RAGAnswer {
  answer: string;
  confidence: number;  // 0-1 scale
  sources: Array<{
    chunk: DocumentChunk;
    relevance: number;
  }>;
}
```

## Code Review Checklist

### Before Submitting Code
- [ ] Code follows naming conventions
- [ ] TypeScript types are comprehensive
- [ ] No `any` types used
- [ ] Error handling is appropriate
- [ ] Tests are written and passing
- [ ] Code is formatted with Prettier
- [ ] No linting errors
- [ ] Documentation is updated
- [ ] Performance considerations addressed
- [ ] Security considerations addressed

### SCAME-Specific Checks
- [ ] Technical parameters are accurate
- [ ] References to official documentation
- [ ] No technical parameter hallucinations
- [ ] Follows SCAME coding rules
- [ ] Proper error messages for invalid inputs

## Tools and Automation

### Development Tools
- **IDE**: VS Code with recommended extensions
- **Package Manager**: pnpm (preferred) or npm
- **Version Control**: Git with conventional commits

### Automation Scripts
```bash
# Code quality checks
npm run lint        # ESLint
npm run format      # Prettier
npm run type-check  # TypeScript

# Testing
npm run test        # Unit tests
npm run test:coverage # Test coverage
npm run test:e2e    # E2E tests

# Development
npm run dev         # Start dev server
npm run build       # Build for production
```

### Git Hooks
- Pre-commit: Run linting and formatting
- Pre-push: Run tests
- Commit messages: Follow conventional commits

## Conclusion

These conventions ensure that the SCAME Selection Tool codebase remains maintainable, scalable, and of high quality. All developers should follow these guidelines to maintain consistency across the project.

Remember: **Technical accuracy is the highest priority**. All code related to SCAME product specifications must be verified against official documentation.

---

*Last Updated: 2026-04-15*  
*Version: 1.0*  
*Based on analysis of existing codebase and project requirements*