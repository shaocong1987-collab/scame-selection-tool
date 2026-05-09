# Coding Conventions

**Analysis Date:** 2026-04-16

## Naming Patterns

**Files:**
- PascalCase for React components: `Header.tsx`, `ProductCard.tsx`, `DocumentUpload.tsx`
- camelCase for utility files and services: `coding.ts`, `matching.ts`, `ScameRAGService.ts`
- kebab-case for directories: `document-management`, `quick-select`

**Functions:**
- camelCase for regular functions: `parsePartNumber()`, `generateReplacements()`, `extractCurrentCode()`
- PascalCase for class constructors: `ScameCodingParser`, `DocumentProcessor`
- Prefixes for specific types:
  - `get` for getter functions: `getParser()`, `getProductCategory()`, `getTechnicalSummary()`
  - `is` for boolean checks: `isValidPartNumber()`, `validateFormat()`
  - `extract` for data extraction: `extractCurrentCode()`, `extractPolesCode()`, `extractVariant()`
  - `generate` for creation: `generateReplacements()`, `generatePartNumberByParams()`

**Variables:**
- camelCase for local variables: `currentCode`, `parsedResult`, `targetPrefix`
- UPPER_SNAKE_CASE for constants: `CATEGORY_BY_FIRST_DIGIT`, `PROTECTION_BY_THIRD_DIGIT`, `CURRENT_BY_CODE`
- PascalCase for TypeScript enums: `ProductCategory`, `ProtectionRating`, `CurrentRating`

**Types:**
- PascalCase for interfaces and types: `ParsedPartNumber`, `ReplacementSuggestion`, `MatchValidationResult`
- Suffix `Result` for result types: `MatchValidationResult`, `ValidationResult`
- Suffix `Config` for configuration types: `CompatibilityConfig`

## Code Style

**Formatting:**
- Tool: Prettier with `.prettierrc.json` configuration
- Key settings:
  - `semi: true` - Always use semicolons
  - `singleQuote: true` - Use single quotes
  - `printWidth: 100` - Line length limit
  - `trailingComma: "es5"` - Trailing commas in ES5 style
  - `tabWidth: 2` - 2 spaces per indent
  - `useTabs: false` - Use spaces, not tabs
  - `endOfLine: "lf"` - Unix line endings

**Linting:**
- Tool: ESLint with `.eslintrc.cjs` configuration
- Key rules:
  - `@typescript-eslint/no-unused-vars` with ignore patterns for `^_` (args and vars)
  - `react-refresh/only-export-components` for React refresh safety
  - Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:react-hooks/recommended`
- Environment: `browser: true, es2020: true`

## Import Organization

**Order:**
1. External dependencies (React, libraries)
2. Internal modules (relative imports)
3. Type imports
4. Style imports

**Example from `src/lib/scame/matching.ts`:**
```typescript
import {
  ProductCategory,
  ProtectionRating,
  CurrentRating,
  PolesConfiguration,
  ParsedPartNumber,
  ScameCodingParser,
  getParser
} from './coding';
```

**Path Aliases:**
- `@/*` maps to `src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- Example: `import Layout from '@/components/layout/Layout';`
- Avoid deep relative imports like `../../../../components`

## Error Handling

**Patterns:**
- Use try-catch blocks for parsing operations
- Return result objects with `errors` and `warnings` arrays
- Distinguish between validation errors and warnings
- Include detailed error messages with context

**Example from `src/lib/scame/coding.ts`:**
```typescript
try {
  // parsing logic
} catch (error) {
  result.errors.push(`解析过程中发生错误: ${error}`);
}
```

**Validation Results:**
- Always include `isValid` boolean flag
- Separate `errors` (blocking) from `warnings` (non-blocking)
- Provide actionable error messages

## Logging

**Framework:** Console logging (no dedicated framework)

**Patterns:**
- Use `console.warn()` for non-critical issues and warnings
- Use `console.error()` for serious problems and errors
- Log structured data for debugging with context
- Avoid console.log in production code

## Comments

**When to Comment:**
- Document complex business logic (SCAME encoding rules)
- Explain why certain decisions were made
- Document TypeScript interfaces and enums
- Add section headers for large files
- Explain non-obvious algorithms or workarounds

**JSDoc/TSDoc:**
- Used for all public functions and classes
- Includes parameter descriptions and return types
- Includes examples for complex functions
- Documents exceptions and edge cases

**Example from `src/lib/scame/coding.ts`:**
```typescript
/**
 * 解析订货号
 * @param partNumber 订货号，如 "513.63532T"
 * @returns 解析结果
 */
parse(partNumber: string): ParsedPartNumber
```

**Section Headers:**
```typescript
// ============================================================================
// 类型定义
// ============================================================================

// ============================================================================
// 常量定义  
// ============================================================================

// ============================================================================
// 核心解析器类
// ============================================================================
```

## Function Design

**Size:** Functions are kept focused and single-purpose
- Most functions are under 50 lines
- Complex logic is broken into helper methods
- Private methods for internal implementation details

**Parameters:** Use object destructuring for multiple parameters
```typescript
generatePartNumberByParams(params: {
  category: ProductCategory;
  current: CurrentRating;
  poles: PolesConfiguration;
  protection: ProtectionRating;
  series?: ProductSeries;
}): string[]
```

**Return Values:** Consistent return patterns
- Always return the same type from a function
- Use interfaces for complex return types
- Include validation status in return objects
- Return empty arrays/objects instead of null when appropriate

## Module Design

**Exports:** 
- Named exports for utilities and types
- Default exports for React components
- Barrel files (`index.ts`) for organizing exports

**Barrel Files:** Used in `src/lib/rag/index.ts`:
```typescript
export { ScameRAGService } from './ScameRAGService';
export { VectorStore } from './VectorStore';
export { DocumentProcessor } from './DocumentProcessor';
```

**Singleton Pattern:** Used for parser instances
```typescript
let parserInstance: ScameCodingParser | null = null;

export function getParser(): ScameCodingParser {
  if (!parserInstance) {
    parserInstance = new ScameCodingParser();
  }
  return parserInstance;
}
```

## TypeScript Usage

**Strict Mode:** Enabled in `tsconfig.json`
- `noUnusedLocals: true` - Error on unused local variables
- `noUnusedParameters: true` - Error on unused parameters  
- `noFallthroughCasesInSwitch: true` - Prevent switch fallthrough
- `strict: true` - All strict type checking options

**Type Definitions:**
- Extensive use of TypeScript enums for fixed values
- Interfaces for data structures
- Type aliases for complex types
- `as const` assertions for literal type preservation

**Example enum usage:**
```typescript
export enum ProductCategory {
  CIVILIAN = '民用面板及附件',
  INPUT_PLUG = '输入端/工业插头/器具插座',
  MOBILE_CONNECTOR = '移动输出端/连接器',
  RECESSED_SOCKET = '暗装输出端/面板插座',
  SURFACE_MOUNT = '明装及高阶控制端',
  ENCLOSURE = '箱体与基座',
  CABLE_REEL = '线缆盘与照明',
  ACCESSORY = '安装辅材类',
  HIGH_CURRENT = '大电流产品'
}
```

**Const Assertions:**
```typescript
const CATEGORY_BY_FIRST_DIGIT: Record<string, ProductCategory> = {
  '1': ProductCategory.CIVILIAN,
  '2': ProductCategory.INPUT_PLUG,
  '3': ProductCategory.MOBILE_CONNECTOR,
  // ...
} as const;
```

## React Component Patterns

**Functional Components:** All components use React.FC or explicit typing
```typescript
const Header: React.FC = () => {
  return (
    // JSX
  );
};

// Alternative with explicit props
const ProductCard = ({ product }: ProductCardProps) => {
  return (
    // JSX  
  );
};
```

**Props:** Use TypeScript interfaces for props
**Hooks:** Use React hooks for state and effects
**Styling:** Tailwind CSS with custom industrial color palette

**Tailwind Usage:**
- Use custom color palette from `tailwind.config.js`
- Use `clsx` or `tailwind-merge` for conditional classes
- Follow responsive design patterns

## SCAME-Specific Conventions

**Technical Accuracy:** 
- All SCAME encoding rules must be strictly followed
- No technical parameter hallucinations allowed
- Reference official documentation in comments
- Distinguish between verified data and inferences

**Error Messages:**
- Provide clear, actionable error messages in Chinese
- Include SCAME-specific guidance and examples
- Suggest alternatives when possible
- Include confidence scores for suggestions

**Validation Rules:**
- Multiple validation layers (format, business rules, compatibility)
- Separate errors from warnings
- Include confidence scores (0-1) for suggestions
- Document validation logic with SCAME rule references

**Coding Rule Implementation:**
- Follow SCAME official coding rules exactly
- Implement "golden replacement rules" for product substitutions
- Handle special cases (899 high-current products)
- Support variant identifiers in part numbers

**Example from `src/lib/scame/coding.ts`:**
```typescript
// 黄金替换法则
const REPLACEMENT_RULES: Record<string, string[]> = {
  // 插头(2xx) → 连接器/暗装/明装
  '2': ['3', '4', '5'],
  // 连接器(3xx) → 插头/暗装/明装
  '3': ['2', '4', '5'],
  // 暗装(4xx) → 插头/连接器/明装
  '4': ['2', '3', '5'],
  // 明装(5xx) → 插头/连接器/暗装
  '5': ['2', '3', '4']
};
```

## File Structure Conventions

**Large Files:** Use section headers to organize code
- Type definitions section
- Constants section  
- Core class/function section
- Utility functions section

**Code Organization:**
- Group related functions together
- Place private helper methods after public methods
- Order methods logically (parse → validate → generate)
- Include test section comments (moved to separate test files)

---

*Convention analysis: 2026-04-16*