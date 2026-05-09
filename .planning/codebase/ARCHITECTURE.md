# Architecture

**Analysis Date:** 2026-04-16

## Pattern Overview

**Overall:** Component-based layered architecture with clear separation of concerns

**Key Characteristics:**
- React-based single-page application with TypeScript
- Industrial design theme with Tailwind CSS styling
- Business logic encapsulated in TypeScript classes and services
- RAG (Retrieval-Augmented Generation) system integration
- Client-side routing with React Router v6

## Layers

**Presentation Layer:**
- Purpose: User interface rendering and interaction
- Location: `src/components/`, `src/pages/`
- Contains: React components, pages, layout components
- Depends on: Business logic layer for data and operations
- Used by: End users via web browser

**Business Logic Layer:**
- Purpose: SCAME-specific business rules and data processing
- Location: `src/lib/scame/`, `src/lib/rag/`
- Contains: Coding rules parser, product matching logic, RAG services
- Depends on: Data models and utility functions
- Used by: Presentation layer components

**Data Access Layer:**
- Purpose: Data persistence and external API integration
- Location: `src/lib/rag/` (for vector storage), planned API clients
- Contains: Vector store interfaces, document processors, API clients
- Depends on: External services (ChromaDB, APIs)
- Used by: Business logic layer

**Infrastructure Layer:**
- Purpose: Build tooling, testing, and development configuration
- Location: Root configuration files
- Contains: Vite config, TypeScript config, Tailwind config, ESLint/Prettier config
- Depends on: Node.js runtime and npm packages
- Used by: Development and build processes

## Data Flow

**Forward Selection Flow:**
1. User inputs technical parameters (current, voltage, poles, protection) on `src/pages/ForwardSelectionPage.tsx`
2. Parameters are validated using Zod schemas
3. `src/lib/scame/coding.ts` generates possible part numbers
4. `src/lib/scame/matching.ts` validates compatibility and matches products
5. Results are displayed in product cards from `src/components/product/ProductCard.tsx`

**Reverse Selection Flow:**
1. User inputs part number on `src/pages/ReverseSelectionPage.tsx`
2. `src/lib/scame/coding.ts` parses and decodes the part number
3. Technical specifications are extracted and displayed
4. `src/lib/scame/matching.ts` generates replacement suggestions
5. RAG system provides technical documentation references

**RAG Knowledge Flow:**
1. User queries technical information on `src/pages/KnowledgePage.tsx`
2. `src/lib/rag/ScameRAGService.ts` processes the query
3. Vector store searches for relevant document chunks
4. Results are displayed with source citations
5. Users can upload documents via `src/components/rag/DocumentUpload.tsx`

**State Management:**
- Local component state using React hooks (`useState`, `useEffect`)
- React Query (`@tanstack/react-query`) for server state and caching
- React Router for navigation state
- No global state management library (Zustand dependency present but not yet implemented)

## Key Abstractions

**ScameCodingParser:**
- Purpose: Parse and validate SCAME part numbers according to official coding rules
- Examples: `src/lib/scame/coding.ts`
- Pattern: Singleton class with comprehensive parsing and validation methods

**Product Matching System:**
- Purpose: Validate product compatibility and generate matching sets
- Examples: `src/lib/scame/matching.ts`
- Pattern: Rule-based validation with configurable compatibility rules

**RAG Service:**
- Purpose: Provide technical documentation references for selections
- Examples: `src/lib/rag/ScameRAGService.ts`, `src/lib/rag/VectorStore.ts`
- Pattern: Abstract interface with multiple backend implementations

**Industrial Design System:**
- Purpose: Consistent industrial-themed UI components
- Examples: `src/components/layout/`, `tailwind.config.js`, `src/styles/global.css`
- Pattern: Tailwind CSS utility classes with custom industrial color palette

## Entry Points

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Browser loads the application
- Responsibilities: Render React app, setup providers (QueryClientProvider, BrowserRouter)

**Routing Entry:**
- Location: `src/routes/Router.tsx`
- Triggers: Navigation events
- Responsibilities: Define route mappings, render appropriate page components

**Page Components:**
- Location: `src/pages/`
- Triggers: Route matching
- Responsibilities: Render complete page views with business logic

## Error Handling

**Strategy:** Graceful degradation with user-friendly error messages

**Patterns:**
- Form validation with Zod schemas and React Hook Form
- Try-catch blocks in business logic with detailed error messages
- React Error Boundaries for component-level errors
- Loading states and skeleton screens for async operations

## Cross-Cutting Concerns

**Logging:** Console logging for development, structured logging planned for production

**Validation:** Zod schema validation for all user inputs and data structures

**Authentication:** Login page implemented (`src/pages/LoginPage.tsx`), full auth flow pending

**Styling:** Tailwind CSS with custom industrial theme, CSS modules for component-specific styles

---

*Architecture analysis: 2026-04-16*