# SCAME Selection Tool - Technology Stack

## Overview
SCAME智能选型工具是北京韶聪泽明智能科技有限责任公司的核心产品，为企业提供精准、高效的SCAME工业插头插座选型解决方案。基于深度学习的SCAME产品知识图谱和RAG（检索增强生成）技术，实现技术参数驱动的智能选型。

## Core Technologies

### Programming Languages
- **TypeScript 5.3.3**: Primary language for type-safe development
- **JavaScript (ES2022+)**: Runtime language with modern features

### Frontend Framework
- **React 18.2.0**: UI library with concurrent features
- **React DOM 18.2.0**: React renderer for web

### Build System & Tooling
- **Vite 5.0.8**: Next-generation frontend build tool
- **TypeScript Compiler**: For type checking and transpilation
- **ESBuild**: Underlying bundler used by Vite

### Styling & UI
- **Tailwind CSS 3.3.6**: Utility-first CSS framework
- **PostCSS 8.4.32**: CSS transformation tool
- **Autoprefixer 10.4.16**: Vendor prefix automation
- **Tailwind Merge 2.2.0**: Utility for merging Tailwind classes
- **Clsx 2.0.0**: Utility for constructing className strings conditionally

### State Management & Data Flow
- **Zustand 4.4.7**: Lightweight state management
- **React Query (@tanstack/react-query) 5.18.0**: Server state management and data fetching
- **Axios 1.6.7**: HTTP client for API requests

### Form Handling & Validation
- **React Hook Form 7.48.2**: Performant form library
- **Zod 3.22.4**: TypeScript-first schema validation
- **@hookform/resolvers 3.3.2**: Zod integration for React Hook Form

### Routing
- **React Router DOM 6.20.1**: Client-side routing

### UI Components & Icons
- **Lucide React 1.8.0**: Icon library
- **Custom SCAME Design System**: Brand-specific colors and components

## Development Tools

### Package Management
- **pnpm 8.0.0+**: Fast, disk space efficient package manager
- **Node.js 18.0.0+**: JavaScript runtime

### Code Quality & Formatting
- **ESLint 8.56.0**: JavaScript/TypeScript linting
- **@typescript-eslint/eslint-plugin 6.15.0**: TypeScript-specific ESLint rules
- **@typescript-eslint/parser 6.15.0**: ESLint parser for TypeScript
- **eslint-plugin-react-hooks 4.6.0**: ESLint plugin for React Hooks
- **eslint-plugin-react-refresh 0.4.5**: ESLint plugin for React Refresh
- **Prettier 3.1.1**: Code formatter

### Testing
- **Vitest 1.1.0**: Unit testing framework
- **@testing-library/react 14.1.2**: React component testing utilities
- **@testing-library/jest-dom 6.1.5**: Custom Jest matchers for DOM testing
- **@testing-library/user-event 14.5.1**: Simulate user events
- **Playwright 1.40.1**: End-to-end testing framework
- **jsdom 23.0.1**: Simulated browser environment for testing

### Type Definitions
- **@types/react 18.2.43**: TypeScript definitions for React
- **@types/react-dom 18.2.17**: TypeScript definitions for React DOM
- **@types/node 25.6.0**: TypeScript definitions for Node.js

### Development Server & Build Configuration
- **@vitejs/plugin-react 4.2.1**: Vite plugin for React
- **Custom Vite Configuration**: Includes path aliases, server settings, and build optimizations

## Project Structure & Configuration

### Configuration Files
- **package.json**: Dependencies, scripts, and project metadata
- **tsconfig.json**: TypeScript compiler configuration with strict settings
- **tsconfig.node.json**: TypeScript configuration for Node.js/Vite
- **vite.config.ts**: Vite build configuration with React plugin and path aliases
- **tailwind.config.js**: Tailwind CSS configuration with SCAME brand colors
- **postcss.config.js**: PostCSS configuration with autoprefixer
- **.eslintrc.cjs**: ESLint configuration with TypeScript and React rules
- **.prettierrc.json**: Prettier formatting configuration

### Project Architecture
```
scame-selection-tool/
├── src/
│   ├── app/                    # Application entry points
│   ├── components/             # React components
│   │   ├── layout/            # Layout components (Header, Footer, Sidebar)
│   │   ├── product/           # Product display components
│   │   ├── rag/               # RAG system components
│   │   └── selection/         # Selection-specific components
│   ├── lib/                   # Utility libraries
│   │   ├── scame/            # SCAME-specific business logic
│   │   │   ├── coding.ts     # Part number encoding/decoding
│   │   │   └── matching.ts   # Product matching algorithms
│   │   └── rag/              # RAG system implementation
│   │       ├── ScameRAGService.ts
│   │       ├── VectorStore.ts
│   │       ├── DocumentProcessor.ts
│   │       └── index.ts
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   ├── HomePage.tsx
│   │   ├── ForwardSelectionPage.tsx
│   │   ├── ReverseSelectionPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── KnowledgePage.tsx
│   │   ├── DocumentManagementPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── HelpPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── QuickSelectPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── routes/                # Routing configuration
│   │   └── Router.tsx
│   ├── stores/                # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── test/                  # Test setup files
│       └── setup.ts
├── docs/                      # Project documentation
├── tests/                     # Test files
├── scripts/                   # Build and deployment scripts
├── data/                      # Data files (not committed to Git)
└── public/                    # Static assets
```

## Development Workflow

### Scripts (from package.json)
- `pnpm dev`: Start development server on port 3000
- `pnpm build`: Build production bundle with TypeScript compilation
- `pnpm preview`: Preview production build locally
- `pnpm lint`: Run ESLint with TypeScript support
- `pnpm format`: Format code with Prettier
- `pnpm type-check`: TypeScript type checking without emitting
- `pnpm test`: Run Vitest unit tests
- `pnpm test:ui`: Run Vitest with UI interface
- `pnpm test:coverage`: Run tests with coverage reporting
- `pnpm test:e2e`: Run Playwright end-to-end tests

### Development Environment
- **Port**: 3000 (configurable in vite.config.ts)
- **Host**: true (accessible on network)
- **Source Maps**: Enabled in production builds
- **Path Aliases**: `@/` maps to `src/` directory
- **Module Resolution**: Bundler mode with ESM

## Build & Deployment

### Build Output
- **Output Directory**: `dist/`
- **Module Format**: ES modules (ESM)
- **Target Environment**: Modern browsers with ES2022 support

### Performance Optimizations
- **Code Splitting**: Automatic by Vite
- **Tree Shaking**: Enabled through ES modules
- **Minification**: Production builds are minified
- **Source Maps**: Generated for debugging

## Testing Strategy

### Unit Testing
- **Framework**: Vitest with jsdom environment
- **Setup**: Global test configuration in `src/test/setup.ts`
- **Coverage**: V8 coverage provider with multiple reporters
- **Matchers**: Jest-compatible assertions with React Testing Library

### Integration Testing
- **Component Testing**: React Testing Library for component integration
- **User Interaction**: @testing-library/user-event for realistic interactions

### End-to-End Testing
- **Framework**: Playwright for cross-browser testing
- **Browser Support**: Chromium, Firefox, WebKit
- **Test Location**: Separate e2e test directory

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled with all strict checks
- **Unused Variables**: Error on unused locals and parameters
- **Fallthrough Cases**: Error on switch statement fallthrough
- **Module Resolution**: Bundler mode for modern tooling

### Linting Rules
- **React Hooks**: Enforce rules of hooks
- **React Refresh**: Only export components from files using refresh
- **Unused Variables**: Error with ignore patterns for `_` prefix
- **TypeScript**: Recommended rules with strict type checking

### Formatting Standards
- **Prettier**: Consistent code formatting across team
- **Integration**: Works with ESLint without conflicts

## Browser Support

### Target Environments
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES2022 Features**: Native support expected
- **Polyfills**: Minimal, focused on modern browser support

### Responsive Design
- **Mobile-First**: Tailwind CSS mobile-first approach
- **Responsive Utilities**: Tailwind responsive breakpoints
- **Touch Support**: Optimized for touch interactions

## Performance Characteristics

### Bundle Size Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for route-based splitting
- **Asset Optimization**: Image and font optimization through Vite

### Runtime Performance
- **Virtual DOM**: React's efficient update mechanism
- **State Management**: Zustand's minimal re-renders
- **Data Fetching**: React Query's caching and background updates

## Development Dependencies Summary

### Core Development Tools
- Vite, TypeScript, ESLint, Prettier, Vitest

### Testing Ecosystem
- Vitest, React Testing Library, Playwright, jsdom

### Build & Transformation
- PostCSS, Autoprefixer, @vitejs/plugin-react

### Type Safety
- TypeScript compiler and type definitions for all major dependencies

## Notes & Considerations

### Technology Choices Rationale
1. **Vite over Webpack**: Faster builds and better developer experience
2. **Zustand over Redux**: Simpler API with comparable capabilities
3. **React Query**: Built-in caching, background updates, and error handling
4. **Tailwind CSS**: Rapid UI development with design system consistency
5. **TypeScript**: Type safety for complex business logic and SCAME encoding rules

### Future Considerations
- **Server-Side Rendering**: Potential migration to Next.js for SEO and performance
- **Backend Integration**: API services for product data and RAG system
- **Mobile Applications**: React Native for native mobile experience
- **Desktop Applications**: Electron for offline desktop tool