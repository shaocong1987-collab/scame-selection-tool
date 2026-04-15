# SCAME Selection Tool - Integrations & External Services

## Overview
SCAME智能选型工具设计为可扩展的多平台系统，集成多种外部服务和API。当前实现为前端应用，但架构设计支持完整的后端集成。

## Current Integrations

### HTTP Client & API Communication
- **Axios 1.6.7**: Primary HTTP client for API requests
- **React Query (@tanstack/react-query) 5.18.0**: Manages server state, caching, and background updates

### Planned/Architected Integrations

## Data Source Integrations

### 1. SCAME Product Knowledge Base
**Status**: Planned (Architecture defined)
**Purpose**: Access structured SCAME product data and technical specifications

**Integration Points**:
- **Product Database**: PostgreSQL with SCAME product catalog
- **Data Formats**: CSV imports from SCAME official sources
- **Sync Mechanism**: Periodic updates from SCAME product releases

**Data Model**:
```typescript
interface ScameProduct {
  partNumber: string;           // e.g., "513.63532T"
  name: string;                // Product name
  series: ProductSeries;       // OPTIMA-TOP, etc.
  technicalSpecs: {
    current: string;           // e.g., "63A"
    voltage: VoltageRange;     // e.g., ">50-250V"
    poles: PolesConfig;        // e.g., "2P+E"
    protection: IPRating;      // e.g., "IP44/IP54"
    frequency?: string;        // e.g., "50/60Hz" or "DC"
  };
  // ... additional fields
}
```

### 2. RAG (Retrieval-Augmented Generation) System
**Status**: Partially implemented (Frontend components ready)
**Purpose**: Enhance selection accuracy with SCAME technical documentation

**Components**:
- **Document Processor**: Processes SCAME PDF manuals and training materials
- **Vector Store**: ChromaDB for semantic search of technical documents
- **Embedding Model**: Text embeddings for similarity search

**Integration Architecture**:
```
Frontend → RAG Service API → Vector Database → Document Store
    ↓           ↓               ↓               ↓
User Query → Semantic Search → Retrieved Docs → Enhanced Response
```

**Document Types**:
- SCAME Official Product Manuals (PDF)
- Technical Training Materials (PPT/PDF)
- Coding Rule Documentation
- Application Case Studies
- Product Specification Sheets

### 3. Enterprise Platform Integrations
**Status**: Architecture defined (Not yet implemented)
**Purpose**: Embed selection tool within enterprise workflows

**Target Platforms**:
1. **WeChat Work (企业微信)**
   - Chatbot integration for conversational selection
   - Single sign-on with enterprise accounts
   - Notification of selection results

2. **Feishu (飞书)**
   - Custom app integration
   - Document sharing and collaboration
   - Approval workflows for large orders

3. **DingTalk (钉钉)**
   - Workflow automation
   - Group selection sessions
   - Integration with procurement systems

**Integration Methods**:
- **OAuth 2.0**: Authentication with enterprise platforms
- **Webhooks**: Real-time notifications and updates
- **Custom Bots**: Conversational interfaces for each platform
- **API Gateways**: Unified API layer for all platforms

## API Services Architecture

### 1. Selection Service API
**Endpoint**: `/api/selection`
**Methods**:
- `POST /by-parameters`: Technical parameters → Product matches
- `GET /by-part-number/{partNumber}`: Decode part number → Full specs
- `POST /validate`: Validate product compatibility
- `POST /recommend`: Get alternative recommendations

**Request/Response Examples**:
```typescript
// Parameter-based selection
POST /api/selection/by-parameters
{
  "current": "63A",
  "voltage": ">50-250V", 
  "poles": "2P+E",
  "protection": "IP44",
  "application": "data-center"
}

// Response
{
  "products": [/* matching products */],
  "recommendations": [/* alternative suggestions */],
  "validation": {
    "valid": true,
    "warnings": ["Consider IP66 for outdoor use"]
  }
}
```

### 2. Product Service API
**Endpoint**: `/api/products`
**Methods**:
- `GET /`: List products with filtering
- `GET /{partNumber}`: Get product details
- `GET /search`: Full-text search across product catalog
- `GET /series/{series}`: Get products by series

### 3. RAG Service API
**Endpoint**: `/api/rag`
**Methods**:
- `POST /query`: Natural language query → Technical documents
- `POST /upload`: Upload new documents to knowledge base
- `GET /sources`: List available knowledge sources
- `POST /enhance`: Enhance selection with technical references

### 4. User & Authentication API
**Endpoint**: `/api/auth`
**Methods**:
- `POST /login`: User authentication
- `POST /register`: New user registration  
- `GET /profile`: Get user profile
- `POST /logout`: End session

## Third-Party Service Dependencies

### 1. Vector Database Services
**Options**:
- **ChromaDB**: Open-source vector database (self-hosted)
- **Pinecone**: Managed vector database service
- **Weaviate**: Open-source vector search engine

**Requirements**:
- Support for text embeddings storage and retrieval
- Semantic search capabilities
- Scalability for large document collections
- Integration with embedding models (OpenAI, local models)

### 2. Embedding Models
**Options**:
- **OpenAI Embeddings**: `text-embedding-ada-002` or newer
- **Local Models**: Sentence transformers (all-MiniLM-L6-v2, etc.)
- **Multilingual Models**: For Chinese/English SCAME documentation

**Considerations**:
- Accuracy for technical terminology
- Support for Chinese language
- Cost and latency requirements
- Data privacy requirements (local vs. cloud)

### 3. Search & Indexing
**Options**:
- **Elasticsearch**: Full-text search across product catalog
- **Algolia**: Managed search service
- **Meilisearch**: Open-source search engine

**Requirements**:
- Fast product search by part number, description, technical specs
- Faceted filtering by current, voltage, protection, etc.
- Typo tolerance for part number searches
- Relevance ranking based on selection context

### 4. Authentication & Authorization
**Services**:
- **JWT (JSON Web Tokens)**: Stateless authentication
- **OAuth 2.0 Providers**: WeChat, Feishu, DingTalk integration
- **Role-Based Access Control (RBAC)**: Different permissions for users, experts, admins

**Security Requirements**:
- Secure storage of API keys and credentials
- Encryption of sensitive product pricing data
- Audit logging of all selection operations
- Rate limiting to prevent abuse

## Data Integration Patterns

### 1. Product Data Synchronization
**Source Systems**:
- SCAME Official Product Database (CSV/API)
- Wiki Knowledge Graph (Markdown files)
- Manual Data Entry Interface

**Sync Strategies**:
- **Batch Import**: Periodic bulk updates from official sources
- **Incremental Updates**: Real-time updates for price/stock changes
- **Validation Pipeline**: Automated validation of technical parameters
- **Version Control**: Track changes to product specifications

### 2. Knowledge Base Management
**Document Processing Pipeline**:
```
Raw Documents → Text Extraction → Chunking → Embedding → Vector Store
    ↓              ↓              ↓          ↓           ↓
PDF/PPT/Word   →  Markdown   →  Sections → Vectors  →  Search Index
```

**Quality Control**:
- Manual review of extracted content
- Validation against official sources
- Regular updates from SCAME documentation
- User feedback on document relevance

### 3. Real-time Updates
**WebSocket Integration**:
- Live stock level updates
- Price change notifications
- New product announcements
- System status updates

**Push Notifications**:
- Selection result ready
- Expert review completed
- Order status changes
- System maintenance alerts

## External API Considerations

### Rate Limiting & Quotas
- **API Rate Limits**: Per-user and system-wide limits
- **Quota Management**: Tiered access based on subscription
- **Caching Strategy**: Reduce external API calls
- **Fallback Mechanisms**: Graceful degradation when services are unavailable

### Error Handling & Resilience
- **Circuit Breakers**: Prevent cascade failures
- **Retry Logic**: With exponential backoff
- **Fallback Data**: Local cache for critical product data
- **Monitoring & Alerts**: Proactive detection of integration issues

### Performance Optimization
- **Request Batching**: Combine multiple API calls
- **Response Caching**: Cache frequent queries
- **Lazy Loading**: Load data only when needed
- **Connection Pooling**: Reuse HTTP connections

## Development & Testing Integrations

### 1. Mock Services
**Purpose**: Development and testing without external dependencies

**Mock Implementations**:
- **Product Service Mock**: In-memory product database
- **RAG Service Mock**: Simulated document retrieval
- **Authentication Mock**: Development user accounts
- **External API Mocks**: Simulated third-party responses

### 2. Testing Environments
**Environment Configuration**:
- **Development**: Local services and mocks
- **Staging**: Integration with test versions of external services
- **Production**: Live integrations with monitoring

**Test Data**:
- Sample product catalog for testing
- Mock documents for RAG testing
- Test user accounts with different roles
- Edge case scenarios for validation testing

## Security & Compliance

### Data Protection
- **Encryption**: HTTPS for all API communications
- **Data Masking**: Sensitive information in logs
- **Access Controls**: Fine-grained permissions for data access
- **Audit Trails**: Complete logging of data access and modifications

### Compliance Requirements
- **SCAME Confidentiality**: Protect proprietary product information
- **User Privacy**: GDPR/CCPA compliance for user data
- **Enterprise Security**: Meet corporate security standards
- **Data Retention**: Policies for data storage and deletion

### API Security
- **Authentication**: JWT tokens with short expiration
- **Authorization**: Role-based access to API endpoints
- **Input Validation**: Strict validation of all API inputs
- **Output Sanitization**: Prevent data leakage in API responses

## Monitoring & Observability

### Integration Health Monitoring
- **Health Checks**: Regular checks of external service availability
- **Performance Metrics**: Response times and error rates
- **Usage Analytics**: API call patterns and volumes
- **Alerting**: Proactive alerts for integration issues

### Logging & Tracing
- **Request Logging**: All external API calls with timing
- **Error Tracking**: Detailed error information for debugging
- **Distributed Tracing**: End-to-end request tracing
- **Audit Logs**: Security-relevant events and access attempts

## Future Integration Roadmap

### Phase 1: Core Product System
- ✅ Frontend application with mock data
- 🔄 RAG system integration
- ⏳ Product database backend
- ⏳ Authentication system

### Phase 2: Enterprise Integration
- ⏳ WeChat Work integration
- ⏳ Feishu integration  
- ⏳ DingTalk integration
- ⏳ Single sign-on (SSO)

### Phase 3: Advanced Features
- ⏳ Real-time stock integration
- ⏳ Pricing engine integration
- ⏳ Order management system
- ⏳ Analytics and reporting

### Phase 4: Ecosystem Expansion
- ⏳ Mobile applications
- ⏳ Desktop application (Electron)
- ⏳ API marketplace for partners
- ⏳ Internationalization (multi-language support)

## Integration Status Legend
- ✅ **Implemented**: Currently working in codebase
- 🔄 **In Progress**: Partially implemented or in development
- ⏳ **Planned**: Architecture defined, not yet implemented
- 📋 **Designed**: Concept documented, needs implementation plan