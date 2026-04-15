# SCAME Selection Tool - Directory Structure and File Organization

## Overview

This document describes the directory structure, file organization, and key files in the SCAME Selection Tool codebase. The project follows a well-organized structure that separates concerns and promotes maintainability.

## High-Level Directory Layout

```
scame-selection-tool/
├── .git/                    # Git repository metadata
├── .planning/              # Planning and documentation
│   └── codebase/           # Codebase analysis documents
├── docs/                   # Project documentation
├── node_modules/           # NPM dependencies
├── public/                 # Static assets (via index.html)
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── product/       # Product-related components
│   │   ├── rag/           # RAG-related components
│   │   └── selection/     # Selection-related components
│   ├── lib/               # Library and utility code
│   │   ├── rag/          # RAG system implementation
│   │   └── scame/        # SCAME-specific business logic
│   ├── pages/             # Page components
│   ├── routes/            # Routing configuration
│   └── styles/            # Global styles
├── tests/                  # Test files (currently empty)
├── scripts/               # Build and utility scripts (currently empty)
├── data/                  # Data files (currently empty)
├── .eslintrc.cjs          # ESLint configuration
├── .gitignore             # Git ignore rules
├── .prettierrc.json       # Prettier configuration
├── CLAUDE.md              # Project-specific development guidelines
├── README.md              # Project overview and setup instructions
├── index.html             # HTML entry point
├── package.json           # NPM package configuration
├── package-lock.json      # NPM lock file
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript node configuration
└── vite.config.ts         # Vite build configuration
```

## Key Source Files

### Entry Points
- `src/main.tsx` - React application entry point
- `src/App.tsx` - Main application component
- `index.html` - HTML template with root element

### Routing Configuration
- `src/routes/Router.tsx` - React Router configuration with all routes

### Layout Components
- `src/components/layout/Layout.tsx` - Main layout wrapper
- `src/components/layout/Header.tsx` - Top navigation header
- `src/components/layout/Sidebar.tsx` - Left navigation sidebar
- `src/components/layout/Footer.tsx` - Application footer

### Page Components
- `src/pages/HomePage.tsx` - Landing page with features overview
- `src/pages/ForwardSelectionPage.tsx` - Parameter-based product selection
- `src/pages/ReverseSelectionPage.tsx` - Product code lookup
- `src/pages/QuickSelectPage.tsx` - Scenario-based quick selection
- `src/pages/ProductsPage.tsx` - Product catalog browser
- `src/pages/ProductDetailPage.tsx` - Detailed product view
- `src/pages/KnowledgePage.tsx` - RAG-powered knowledge search
- `src/pages/DocumentManagementPage.tsx` - Document upload/management
- `src/pages/SettingsPage.tsx` - User preferences and settings
- `src/pages/HelpPage.tsx` - Help documentation
- `src/pages/NotFoundPage.tsx` - 404 error page

### Feature Components
- `src/components/product/ProductCard.tsx` - Product display card
- `src/components/selection/QuickSelectionCard.tsx` - Quick selection card
- `src/components/rag/DocumentUpload.tsx` - Document upload component
- `src/components/rag/SelectionExplanation.tsx` - RAG-powered explanation

### Core Business Logic

#### SCAME Coding System (`src/lib/scame/`)
- `coding.ts` - SCAME part number parser and validator
  - **Purpose**: Parse SCAME product codes into technical specifications
  - **Key Features**:
    - Part number validation and parsing
    - Technical parameter extraction (current, voltage, poles, protection)
    - Replacement rule application (golden replacement rules)
    - Series and category identification
    - Batch processing and statistics
  - **Exports**: `ScameCodingParser` class, utility functions

- `matching.ts` - Product matching logic
  - **Purpose**: Match products based on technical parameters
  - **Key Features**:
    - Parameter-based filtering
    - Compatibility checking
    - Alternative suggestions
    - Series matching

#### RAG System (`src/lib/rag/`)
- `ScameRAGService.ts` - RAG (Retrieval-Augmented Generation) service
  - **Purpose**: Provide knowledge-enhanced answers with citations
  - **Key Features**:
    - Multi-strategy document retrieval (structured, vector, keyword)
    - Hybrid ranking algorithm
    - Confidence scoring
    - Source citation generation
    - Technical parameter validation
  - **Exports**: `ScameRAGService` class, configuration types

- `VectorStore.ts` - Vector database operations
  - **Purpose**: Interface with vector database (ChromaDB)
  - **Key Features**:
    - Document embedding and storage
    - Similarity search
    - Index management
    - Collection operations

- `DocumentProcessor.ts` - Document processing pipeline
  - **Purpose**: Process documents for RAG indexing
  - **Key Features**:
    - Text extraction from various formats
    - Semantic chunking
    - Metadata extraction
    - Quality validation

- `index.ts` - Barrel exports for RAG module
  - **Purpose**: Simplify imports from RAG module
  - **Exports**: All RAG service functions and types

### Global Styles
- `src/styles/global.css` - Global CSS with Tailwind directives

## Configuration Files

### Build Configuration
- `vite.config.ts` - Vite build configuration
  - **Purpose**: Configure Vite development server and build process
  - **Key Settings**:
    - React plugin
    - Path aliases (`@/` → `src/`)
    - Development server settings (port 3000)
    - Build output directory (`dist/`)
    - Test configuration (Vitest + jsdom)

- `tsconfig.json` - TypeScript configuration
  - **Purpose**: TypeScript compiler settings
  - **Key Settings**:
    - Target: ES2022
    - Strict mode enabled
    - Path aliases for imports
    - React JSX support
    - Test type definitions

- `tsconfig.node.json` - Node-specific TypeScript config
  - **Purpose**: Configuration for Node.js/backend code

### Styling Configuration
- `tailwind.config.js` - Tailwind CSS configuration
  - **Purpose**: Customize Tailwind design system
  - **Key Settings**:
    - Custom colors (SCAME brand colors)
    - Font families
    - Extended theme configurations

- `postcss.config.js` - PostCSS configuration
  - **Purpose**: Process CSS with PostCSS plugins
  - **Plugins**: Tailwind CSS, Autoprefixer

### Code Quality Configuration
- `.eslintrc.cjs` - ESLint configuration
  - **Purpose**: Code linting rules
  - **Plugins**: TypeScript, React, React Hooks
  - **Rules**: Strict TypeScript, React best practices

- `.prettierrc.json` - Prettier configuration
  - **Purpose**: Code formatting rules
  - **Settings**: Consistent code style across the project

### Package Management
- `package.json` - NPM package configuration
  - **Purpose**: Define dependencies, scripts, and project metadata
  - **Key Sections**:
    - **Dependencies**: React, React Router, Zustand, React Query, Axios, Zod, etc.
    - **Dev Dependencies**: TypeScript, Vite, ESLint, Prettier, Testing libraries
    - **Scripts**: Development, build, test, lint, format commands
    - **Engines**: Node.js >= 18.0.0, pnpm >= 8.0.0

- `package-lock.json` - NPM lock file
  - **Purpose**: Ensure consistent dependency versions

## Documentation Structure

### Project Documentation (`docs/`)
- `architecture.md` - System architecture design
- `development-experience.md` - Development workflow and tools
- `rag-system-architecture.md` - RAG system detailed design
- `scame-selection-tool-1.0.md` - Version 1.0 specification
- `user-test-feedback-template.md` - User testing template
- `scame-knowledge/` - SCAME-specific knowledge base

### Development Guidelines
- `CLAUDE.md` - Project-specific development guidelines
  - **Purpose**: Define coding standards, architecture patterns, and workflows
  - **Sections**: Technical stack, project structure, SCAME rules, development process

- `README.md` - Project overview and setup instructions
  - **Purpose**: Quick start guide for developers
  - **Sections**: Project description, setup instructions, usage guide

## Data Directory Structure

### `data/` - Data Files
- **Purpose**: Store product data, knowledge documents, and cache
- **Current Status**: Empty directory, ready for data files
- **Planned Structure**:
  - `products/` - Product data in CSV/JSON format
  - `knowledge/` - Source documents for RAG system
  - `cache/` - Cached data and indexes

### `public/` - Static Assets
- **Purpose**: Serve static files directly
- **Current Status**: Only `index.html` present
- **Planned Assets**:
  - Images, fonts, icons
  - Favicon and manifest files
  - Static documentation

## Build and Deployment Artifacts

### Build Output (`dist/`)
- **Generated by**: `npm run build`
- **Contents**:
  - `index.html` - Optimized HTML entry point
  - `assets/` - Compiled JavaScript and CSS bundles
  - Static assets from `public/` directory

### Development Artifacts
- `.vite/` - Vite development cache
- `coverage/` - Test coverage reports (when tests are run)
- `playwright-report/` - E2E test reports (when tests are run)

## Test Structure

### Planned Test Organization (`tests/`)
- **Current Status**: Empty directory
- **Planned Structure**:
  - `unit/` - Unit tests for functions and components
  - `integration/` - Integration tests for component interactions
  - `e2e/` - End-to-end tests with Playwright
  - `fixtures/` - Test data and fixtures
  - `mocks/` - Mock implementations for testing

### Test Configuration
- **Framework**: Vitest for unit/integration, Playwright for E2E
- **Setup**: `src/test/setup.ts` (referenced in vite.config.ts)
- **Coverage**: Configured in vite.config.ts with V8 provider

## Scripts Directory

### Planned Scripts (`scripts/`)
- **Current Status**: Empty directory
- **Planned Scripts**:
  - `build.js` - Custom build scripts
  - `deploy.js` - Deployment automation
  - `data-import.js` - Product data import utilities
  - `rag-index.js` - RAG indexing utilities
  - `test-setup.js` - Test environment setup

## Import Aliases and Path Configuration

### Path Aliases
- `@/` → `src/` - Configured in both vite.config.ts and tsconfig.json
- **Usage**: `import Component from '@/components/Component'`

### Module Resolution
- **Strategy**: Bundler (Vite) for ES modules
- **Extensions**: `.ts`, `.tsx`, `.js`, `.jsx`, `.json`
- **Base URL**: Project root directory

## Environment Configuration

### Environment Variables
- **Current Status**: No environment-specific configuration
- **Planned Structure**:
  - `.env` - Local development environment (gitignored)
  - `.env.example` - Example environment variables
  - `.env.production` - Production environment
  - `.env.staging` - Staging environment

### Configuration Management
- **Approach**: Environment variables for sensitive data
- **Security**: No secrets in source code
- **Validation**: Zod schemas for environment validation

## Dependency Management

### Production Dependencies
- **React Ecosystem**: React, React DOM, React Router
- **State Management**: Zustand, React Query
- **UI/UX**: Tailwind CSS, Lucide React icons
- **Forms/Validation**: React Hook Form, Zod
- **HTTP Client**: Axios
- **Utilities**: clsx, tailwind-merge

### Development Dependencies
- **Build Tooling**: Vite, TypeScript, PostCSS
- **Code Quality**: ESLint, Prettier, TypeScript ESLint
- **Testing**: Vitest, React Testing Library, Playwright
- **Type Definitions**: @types packages for dependencies

### Package Manager
- **Primary**: pnpm (recommended in package.json engines)
- **Alternative**: npm (compatible)
- **Lock File**: package-lock.json for npm compatibility

## Development Workflow

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run type-check   # TypeScript type checking

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint code checking
npm run format       # Prettier code formatting

# Testing
npm run test         # Run unit/integration tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
```

### Development Server
- **Port**: 3000
- **Host**: Localhost with network access enabled
- **Hot Reload**: Enabled for fast development
- **Source Maps**: Enabled for debugging

## Deployment Artifacts

### Static Site Deployment
- **Output**: `dist/` directory with static files
- **Compatibility**: Any static hosting service
- **Recommended**: Vercel, Netlify, GitHub Pages

### Docker Deployment
- **Dockerfile**: Not yet created
- **Base Image**: Node.js alpine for small image size
- **Multi-stage**: Build and runtime stages

### CI/CD Pipeline
- **GitHub Actions**: Not yet configured
- **Stages**: Test → Build → Deploy
- **Environments**: Development, Staging, Production

## File Naming Conventions

### TypeScript/JavaScript Files
- **Components**: PascalCase with `.tsx` extension (`ComponentName.tsx`)
- **Utilities/Functions**: camelCase with `.ts` extension (`utilityName.ts`)
- **Types/Interfaces**: PascalCase with `.ts` extension (`TypeName.ts`)
- **Constants**: UPPER_SNAKE_CASE with `.ts` extension (`CONSTANTS.ts`)

### CSS/Styling Files
- **Global Styles**: `global.css`
- **Component Styles**: Co-located with components or using Tailwind
- **CSS Modules**: Not used (Tailwind CSS preferred)

### Test Files
- **Unit Tests**: Same name as source with `.test.ts` suffix
- **Integration Tests**: `.integration.test.ts` suffix
- **E2E Tests**: `.spec.ts` suffix in e2e directory

## Code Organization Principles

### 1. Feature-Based Organization
- Components grouped by feature/domain
- Shared components in common directories
- Business logic separated from presentation

### 2. Co-location
- Related files kept together
- Tests near the code they test
- Styles with components when needed

### 3. Barrel Exports
- Index files for clean imports
- Logical grouping of related exports
- Reduced import path complexity

### 4. Type Safety
- TypeScript strict mode enabled
- Comprehensive type definitions
- Interface-driven development

## Future Structure Evolution

### Phase 1: Current Structure
- Basic React application structure
- Core business logic implemented
- Documentation in place
- Build system configured

### Phase 2: Enhanced Structure
- Backend API integration
- Database models and migrations
- Authentication system
- Advanced testing structure

### Phase 3: Enterprise Structure
- Microservices architecture
- Monorepo structure
- Advanced deployment configurations
- Monitoring and observability

### Phase 4: AI/ML Structure
- Machine learning models
- Training pipelines
- Vector database integration
- Advanced RAG optimizations

## Key Structural Decisions

### 1. Monolithic vs Microservices
- **Decision**: Monolithic frontend application
- **Rationale**: Simplicity for MVP, easier deployment
- **Future**: Can evolve to microservices as needed

### 2. Client-Side vs Server-Side
- **Decision**: Client-side rendering with React
- **Rationale**: Fast interactivity, simpler deployment
- **Future**: Can add server-side rendering for SEO

### 3. CSS Methodology
- **Decision**: Tailwind CSS utility-first
- **Rationale**: Rapid development, consistency, performance
- **Alternative**: Could add CSS modules for complex components

### 4. State Management
- **Decision**: Zustand + React Query
- **Rationale**: Simple API, good TypeScript support, built-in caching
- **Alternative**: Could use Redux Toolkit for more complex needs

## Conclusion

The SCAME Selection Tool codebase follows modern React application structure with clear separation of concerns. The directory organization supports scalability and maintainability, with logical grouping of related functionality.

The structure is designed to evolve from a simple MVP to a complex enterprise application while maintaining code organization and developer productivity.
