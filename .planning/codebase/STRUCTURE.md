# Codebase Structure

**Analysis Date:** 2026-04-16

## Directory Layout

```
scame-selection-tool/
├── .git/                    # Git repository metadata
├── .planning/              # Project planning and analysis
│   ├── codebase/           # Codebase analysis documents
│   └── phases/             # Development phases
├── docs/                   # Project documentation
│   ├── scame-knowledge/   # SCAME technical knowledge
│   └── *.md               # Architecture and development guides
├── node_modules/           # NPM dependencies
├── public/                 # Static assets (via index.html)
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── layout/        # Layout components (Header, Footer, Sidebar)
│   │   ├── product/       # Product display components
│   │   ├── rag/           # RAG system components
│   │   └── selection/     # Selection interface components
│   ├── lib/               # Business logic and utilities
│   │   ├── rag/          # RAG system implementation
│   │   └── scame/        # SCAME-specific business logic
│   ├── pages/             # Page components (routes)
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
├── UI_REDESIGN_PLAN.md    # UI redesign planning document
├── index.html             # HTML entry point
├── package.json           # NPM package configuration
├── package-lock.json      # NPM lock file
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript node configuration
└── vite.config.ts         # Vite build configuration
```

## Directory Purposes

**src/components/:**
- Purpose: Reusable React UI components
- Contains: Layout components, product cards, selection interfaces, RAG components
- Key files: `src/components/layout/Layout.tsx`, `src/components/product/ProductCard.tsx`, `src/components/selection/QuickSelectionCard.tsx`

**src/lib/:**
- Purpose: Business logic, utilities, and services
- Contains: SCAME coding rules, product matching, RAG services, vector storage
- Key files: `src/lib/scame/coding.ts`, `src/lib/scame/matching.ts`, `src/lib/rag/ScameRAGService.ts`

**src/pages/:**
- Purpose: Page-level React components corresponding to routes
- Contains: All application pages (Home, Selection, Products, Knowledge, etc.)
- Key files: `src/pages/HomePage.tsx`, `src/pages/ForwardSelectionPage.tsx`, `src/pages/ReverseSelectionPage.tsx`

**src/routes/:**
- Purpose: Application routing configuration
- Contains: Route definitions and navigation logic
- Key files: `src/routes/Router.tsx`

**src/styles/:**
- Purpose: Global CSS styles and theme configuration
- Contains: Global CSS file, Tailwind configuration
- Key files: `src/styles/global.css`, `tailwind.config.js`

**docs/:**
- Purpose: Project documentation and technical specifications
- Contains: Architecture documents, development guides, SCAME knowledge
- Key files: `docs/architecture.md`, `docs/PROJECT_DEVELOPMENT_GUIDE.md`, `docs/scame-knowledge/`

**.planning/:**
- Purpose: Project planning, analysis, and phase management
- Contains: Codebase analysis, requirements, roadmap, development phases
- Key files: `.planning/codebase/*.md`, `.planning/PROJECT.md`, `.planning/ROADMAP.md`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React application entry point, renders App component
- `src/App.tsx`: Main application component with providers (QueryClient, Router)
- `index.html`: HTML entry point with root div

**Configuration:**
- `package.json`: Dependencies, scripts, project metadata
- `tsconfig.json`: TypeScript compiler configuration
- `vite.config.ts`: Vite build tool configuration
- `tailwind.config.js`: Tailwind CSS theme and configuration

**Core Logic:**
- `src/lib/scame/coding.ts`: SCAME part number parsing and validation
- `src/lib/scame/matching.ts`: Product compatibility and matching logic
- `src/lib/rag/ScameRAGService.ts`: RAG system implementation
- `src/lib/rag/VectorStore.ts`: Vector storage abstraction

**Routing:**
- `src/routes/Router.tsx`: Route definitions and navigation
- `src/pages/*.tsx`: Individual page components

**Testing:**
- Currently no test files in `tests/` directory
- Test configuration in `package.json` scripts (vitest, playwright)

## Naming Conventions

**Files:**
- React components: PascalCase with `.tsx` extension (`ComponentName.tsx`)
- TypeScript modules: camelCase with `.ts` extension (`moduleName.ts`)
- Pages: `PageNamePage.tsx` (`HomePage.tsx`, `ForwardSelectionPage.tsx`)
- Components: Descriptive names (`ProductCard.tsx`, `QuickSelectionCard.tsx`)

**Directories:**
- Singular nouns for component categories (`components/`, `pages/`, `lib/`)
- Subdirectories by feature/domain (`components/layout/`, `lib/scame/`)

## Where to Add New Code

**New Page/Feature:**
- Primary code: `src/pages/NewFeaturePage.tsx`
- Components: `src/components/new-feature/` (if multiple related components)
- Business logic: `src/lib/new-feature/` (if complex logic)
- Tests: `tests/new-feature/` (when test infrastructure is added)

**New Component:**
- Implementation: `src/components/category/NewComponent.tsx`
- If component doesn't fit existing categories, create new subdirectory
- Export from `src/components/category/index.ts` if using barrel exports

**New Business Logic:**
- Utilities: `src/lib/utils/newUtility.ts`
- SCAME-specific logic: `src/lib/scame/newLogic.ts`
- RAG-related logic: `src/lib/rag/newRagService.ts`

**New Styles:**
- Component-specific: Use Tailwind classes in component files
- Global styles: `src/styles/global.css`
- Theme extensions: `tailwind.config.js`

## Special Directories

**docs/scame-knowledge/:**
- Purpose: SCAME technical documentation and knowledge base
- Contains: Official manuals, training materials, coding rules
- Generated: No, manually curated
- Committed: Yes, essential for RAG system

**data/:**
- Purpose: Data files and resources
- Contains: Product data, knowledge base files, cache
- Generated: Partially (RAG embeddings), partially manual
- Committed: No, added to `.gitignore`

**.planning/:**
- Purpose: Project planning and analysis artifacts
- Contains: Requirements, roadmap, codebase analysis, phase plans
- Generated: By AI agents during development
- Committed: Yes, for project tracking and collaboration

---

*Structure analysis: 2026-04-16*