# SCAME Selection Tool - System Architecture

## Overview

The SCAME Selection Tool is a React-based web application for intelligent selection of SCAME industrial electrical products. The system follows a **component-based architecture** with clear separation of concerns, leveraging modern React patterns and TypeScript for type safety.

## Architecture Layers

### 1. Presentation Layer (UI Components)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Headless UI components
- **State Management**: React hooks + Zustand (lightweight state management)
- **Routing**: React Router v6 for client-side navigation
- **Data Fetching**: React Query (TanStack Query) for server state management

### 2. Business Logic Layer
- **Core Services**: SCAME coding rules, product matching, RAG services
- **Validation**: Zod schema validation for forms and data
- **Business Rules**: Encapsulated in TypeScript classes and functions
- **State Management**: Zustand stores for global application state

### 3. Data Access Layer
- **Local Storage**: Browser storage for user preferences and cache
- **API Integration**: Axios for HTTP requests (backend integration ready)
- **Vector Storage**: ChromaDB integration for RAG (Retrieval-Augmented Generation)
- **Document Processing**: PDF/text extraction and vector embedding

### 4. Infrastructure Layer
- **Build Tool**: Vite for fast development and optimized production builds
- **Testing**: Vitest + React Testing Library + Playwright (E2E)
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **Deployment**: Static site deployment (Vercel/Netlify compatible)

## Design Patterns

### 1. Component Architecture Pattern
- **Atomic Design Principles**: Layout → Pages → Components hierarchy
- **Container/Presenter Pattern**: Separation of logic and presentation
- **Compound Components**: Reusable component compositions
- **Custom Hooks**: Encapsulated business logic reuse

### 2. State Management Pattern
- **Local State**: React `useState` for component-specific state
- **Context State**: React Context for theme/global preferences
- **Global State**: Zustand stores for application-wide state
- **Server State**: React Query for API data with caching

### 3. Data Flow Pattern
- **Unidirectional Data Flow**: Parent → child prop passing
- **Event-Driven Communication**: Callback functions for child → parent
- **Centralized State Updates**: Zustand actions for complex state changes
- **Optimistic Updates**: React Query for smooth UI updates

### 4. Service Layer Pattern
- **Singleton Services**: Coding parser, RAG service instances
- **Dependency Injection**: Service instances passed via context or props
- **Service Interfaces**: TypeScript interfaces for service contracts
- **Mock Implementations**: For testing and development

## Component Architecture

### Layout Components
- `Layout.tsx` - Main application layout with header, sidebar, footer
- `Header.tsx` - Top navigation bar with logo and user controls
- `Sidebar.tsx` - Left navigation sidebar with menu items
- `Footer.tsx` - Application footer with links and information

### Page Components
- `HomePage.tsx` - Landing page with features and quick access
- `ForwardSelectionPage.tsx` - Parameter-based product selection
- `ReverseSelectionPage.tsx` - Product code-based lookup
- `QuickSelectPage.tsx` - Scenario-based quick selection
- `ProductsPage.tsx` - Product catalog browsing
- `ProductDetailPage.tsx` - Detailed product information
- `KnowledgePage.tsx` - RAG-powered knowledge base
- `DocumentManagementPage.tsx` - Document upload and management
- `SettingsPage.tsx` - User preferences and settings
- `HelpPage.tsx` - Help documentation and support
- `NotFoundPage.tsx` - 404 error page

### Feature Components
- `ProductCard.tsx` - Product display card with basic info
- `QuickSelectionCard.tsx` - Quick selection scenario card
- `DocumentUpload.tsx` - Document upload interface for RAG
- `SelectionExplanation.tsx` - RAG-powered selection rationale

### Service Components
- **Coding Service**: `src/lib/scame/coding.ts` - SCAME part number parsing
- **Matching Service**: `src/lib/scame/matching.ts` - Product matching logic
- **RAG Service**: `src/lib/rag/ScameRAGService.ts` - Knowledge retrieval
- **Vector Store**: `src/lib/rag/VectorStore.ts` - Vector database operations
- **Document Processor**: `src/lib/rag/DocumentProcessor.ts` - Document processing

## State Management Architecture

### Application State Structure
```typescript
// Example Zustand store structure
interface AppState {
  // User preferences
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  
  // Selection state
  currentSelection: SelectionParams | null;
  selectionResults: Product[];
  selectionHistory: SelectionHistory[];
  
  // Product state
  products: Product[];
  filteredProducts: Product[];
  currentProduct: Product | null;
  
  // RAG state
  ragQuery: string;
  ragResults: RAGResult[];
  ragConfidence: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
}
```

### State Management Strategy
1. **Component State**: `useState` for UI-specific state (form inputs, toggles)
2. **Context State**: React Context for theme, language, user preferences
3. **Global State**: Zustand for cross-component application state
4. **Server State**: React Query for API data with caching and synchronization
5. **URL State**: React Router for filter states and navigation

## Routing Architecture

### Route Structure
```
/                     - Home page
/quick-select         - Quick selection by scenario
/forward-selection    - Parameter-based forward selection
/reverse-selection    - Product code-based reverse selection
/products             - Product catalog
/products/:partNumber - Product details
/knowledge            - Knowledge base search
/knowledge/management - Document management
/help                 - Help and documentation
/settings             - User settings
/*                    - 404 page
```

### Routing Features
- **Nested Routes**: Support for complex navigation hierarchies
- **Route Guards**: Authentication and authorization (future)
- **Lazy Loading**: Code splitting for performance optimization
- **Route Transitions**: Smooth page transitions (future)
- **Query Parameters**: For filtering and search states

## Data Flow Architecture

### Forward Selection Flow
```
User Input → Form Validation → Parameter Processing → 
Product Matching → Results Display → RAG Enhancement → 
Selection Confirmation → History Logging
```

### Reverse Selection Flow
```
Part Number Input → Coding Parser → Product Lookup → 
Technical Details → Compatibility Check → 
Alternative Suggestions → RAG Context
```

### RAG Knowledge Flow
```
User Query → Query Processing → Vector Search → 
Document Retrieval → Relevance Ranking → 
Answer Generation → Source Citation → Confidence Scoring
```

## Service Architecture

### SCAME Coding Service (`coding.ts`)
- **Responsibility**: Parse and validate SCAME part numbers
- **Features**: 
  - Part number validation and parsing
  - Technical parameter extraction
  - Replacement rule application
  - Series and category identification
- **Pattern**: Singleton service with comprehensive TypeScript types

### SCAME Matching Service (`matching.ts`)
- **Responsibility**: Product matching based on technical parameters
- **Features**:
  - Parameter-based product filtering
  - Compatibility checking
  - Alternative product suggestions
  - Series matching logic
- **Pattern**: Pure functions with clear input/output contracts

### RAG Service (`ScameRAGService.ts`)
- **Responsibility**: Knowledge retrieval and enhancement
- **Features**:
  - Multi-strategy document retrieval
  - Vector similarity search
  - Hybrid ranking algorithm
  - Confidence scoring
  - Source citation generation
- **Pattern**: Configurable service with layered architecture

### Document Processing Pipeline
```
Raw Documents → Text Extraction → Chunking → 
Vector Embedding → Storage → Indexing → 
Retrieval → Ranking → Presentation
```

## Performance Architecture

### Bundle Optimization
- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image compression, font subsetting
- **Caching Strategy**: Service workers and CDN caching

### Runtime Performance
- **Virtualization**: For large product lists (future)
- **Memoization**: React.memo and useMemo for expensive computations
- **Debouncing**: Search and filter operations
- **Optimistic Updates**: Smooth UI interactions

### Data Performance
- **Pagination**: Large dataset handling
- **Caching**: React Query cache for API responses
- **Prefetching**: Anticipatory data loading
- **Compression**: Data transfer optimization

## Security Architecture

### Client-Side Security
- **Input Validation**: All user inputs validated with Zod
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based API protection (future)
- **Content Security Policy**: Strict CSP headers (future)

### Data Security
- **Sensitive Data**: Never stored in client-side state
- **API Security**: HTTPS only, authentication tokens
- **Local Storage**: Limited to non-sensitive preferences
- **Error Handling**: No sensitive data in error messages

## Testing Architecture

### Unit Testing
- **Framework**: Vitest
- **Scope**: Individual functions and components
- **Coverage**: Business logic, utilities, services
- **Pattern**: Arrange-Act-Assert with clear test cases

### Integration Testing
- **Framework**: React Testing Library
- **Scope**: Component interactions
- **Coverage**: User flows, state management
- **Pattern**: User-centric testing approach

### E2E Testing
- **Framework**: Playwright
- **Scope**: Complete user journeys
- **Coverage**: Critical business workflows
- **Pattern**: Real browser testing with scenarios

## Deployment Architecture

### Build Process
```
TypeScript Compilation → Bundle Optimization → 
Asset Processing → Static Generation → 
Deployment Preparation
```

### Deployment Targets
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **Docker Container**: For custom deployments
- **CDN Distribution**: Global content delivery
- **CI/CD Pipeline**: Automated testing and deployment

### Environment Configuration
- **Development**: Hot reload, debug tools, mock data
- **Staging**: Production-like with test data
- **Production**: Optimized, minified, monitored
- **Feature Flags**: Gradual feature rollout

## Scalability Considerations

### Horizontal Scaling
- **Stateless Architecture**: No server-side session state
- **CDN Distribution**: Global static asset delivery
- **API Scaling**: Backend service scalability (future)
- **Database Scaling**: Vector database and product database

### Vertical Optimization
- **Bundle Size**: Keep under 500KB initial load
- **Memory Usage**: Efficient state management
- **CPU Usage**: Optimized algorithms and computations
- **Network Usage**: Minimized data transfer

## Monitoring and Observability

### Client-Side Monitoring
- **Error Tracking**: Uncaught exceptions and React errors
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Feature usage and user behavior
- **Custom Events**: Business-specific metrics

### Development Monitoring
- **Build Metrics**: Bundle size, compilation time
- **Test Coverage**: Code coverage reports
- **Type Safety**: TypeScript strictness compliance
- **Code Quality**: ESLint and Prettier compliance

## Future Architecture Evolution

### Phase 1: Current MVP
- Basic selection functionality
- Static product data
- Client-side RAG simulation
- Single-page application

### Phase 2: Enhanced Features
- Backend API integration
- Real product database
- Vector database integration
- Multi-platform bots (WeChat, DingTalk, Lark)

### Phase 3: Enterprise Features
- User authentication and authorization
- Multi-tenant support
- Advanced analytics and reporting
- Integration with ERP systems

### Phase 4: AI Enhancement
- Machine learning recommendations
- Predictive selection
- Natural language processing
- Advanced RAG with fine-tuning

## Key Architectural Decisions

### 1. React over Other Frameworks
- **Decision**: Choose React for its ecosystem and team familiarity
- **Rationale**: Large community, excellent TypeScript support, proven scalability
- **Trade-offs**: Larger bundle size than some alternatives

### 2. TypeScript over JavaScript
- **Decision**: Full TypeScript adoption
- **Rationale**: Type safety, better developer experience, reduced bugs
- **Trade-offs**: Learning curve, compilation step

### 3. Vite over Create React App
- **Decision**: Vite as build tool
- **Rationale**: Faster development, better performance, modern tooling
- **Trade-offs**: Less established than CRA

### 4. Zustand over Redux
- **Decision**: Zustand for state management
- **Rationale**: Simpler API, less boilerplate, better TypeScript support
- **Trade-offs**: Smaller ecosystem than Redux

### 5. Tailwind CSS over CSS-in-JS
- **Decision**: Tailwind CSS for styling
- **Rationale**: Utility-first approach, consistency, performance
- **Trade-offs**: Learning curve, HTML class bloat

### 6. React Query for Server State
- **Decision**: React Query for API data
- **Rationale**: Built-in caching, synchronization, error handling
- **Trade-offs**: Additional dependency, learning curve

## Technical Constraints

### 1. Browser Compatibility
- **Target**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Polyfills**: Limited to essential features
- **Progressive Enhancement**: Core functionality works everywhere

### 2. Performance Budget
- **Initial Load**: < 500KB compressed
- **Time to Interactive**: < 3 seconds on 3G
- **Core Web Vitals**: All metrics in "good" range

### 3. Accessibility Requirements
- **WCAG 2.1 AA**: Minimum compliance level
- **Screen Reader Support**: Full compatibility
- **Keyboard Navigation**: Complete keyboard support

### 4. Security Requirements
- **No Sensitive Data**: In client-side code
- **Input Validation**: All user inputs
- **Content Security**: Strict CSP policies

## Conclusion

The SCAME Selection Tool architecture follows modern web development best practices with a focus on maintainability, performance, and scalability. The component-based React architecture with TypeScript ensures type safety and developer productivity, while the layered service architecture provides clear separation of concerns.

The system is designed to evolve from a static MVP to a fully-featured enterprise application with AI enhancements, maintaining architectural integrity throughout the evolution process.
