# ManufacturingOS ERP - Architecture Documentation

## Technology Stack

### Backend: Node.js + NestJS
- **Framework**: NestJS 10+ (TypeScript-based, enterprise-grade)
- **Language**: TypeScript 5.3+
- **Database**: PostgreSQL 15+ with TypeORM
- **Cache**: Redis 7.2+
- **Queue**: Bull (Redis-based task queue)
- **WebSocket**: Socket.io for real-time features
- **Documentation**: Swagger/OpenAPI

### Frontend: Next.js 14
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5.3+
- **UI Library**: shadcn/ui (Tailwind + Radix UI)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack React Query
- **Tables**: TanStack Table
- **Charts**: Recharts

### DevOps
- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston (backend), Console (frontend)

## Architecture Patterns

### Backend Architecture
- **Modular Monolith**: Each business domain is a separate NestJS module
- **Layered Architecture**:
  - Controllers (API endpoints)
  - Services (Business logic)
  - Repositories (Data access)
  - Entities (Database models)

### Frontend Architecture
- **Server Components**: For static content and SEO
- **Client Components**: For interactive features
- **App Router**: File-based routing with layouts
- **API Routes**: Backend-for-Frontend (BFF) pattern

## Module Structure

Each business module follows this pattern:

### Backend Module Structure
```
modules/
└── crm/
    ├── crm.module.ts          # Module definition
    ├── entities/              # TypeORM entities
    │   └── customer.entity.ts
    ├── dto/                   # Data Transfer Objects
    │   ├── create-customer.dto.ts
    │   └── update-customer.dto.ts
    ├── controllers/           # API controllers
    │   └── customer.controller.ts
    ├── services/              # Business logic
    │   └── customer.service.ts
    ├── repositories/          # Data access (if needed)
    └── tests/                 # Unit tests
```

### Frontend Module Structure
```
app/(dashboard)/
└── crm/
    ├── customers/
    │   ├── page.tsx          # List page
    │   ├── [id]/
    │   │   └── page.tsx      # Detail page
    │   └── new/
    │       └── page.tsx      # Create page
    └── layout.tsx            # CRM layout
```

## API Communication

### RESTful API
- Base URL: `/api/v1`
- Authentication: JWT Bearer tokens
- Format: JSON
- Versioning: URL-based

### WebSocket
- Real-time notifications
- Live updates
- Collaborative features

## Data Flow

1. **User Interaction** → Frontend Component
2. **API Call** → React Query (caching, state)
3. **HTTP Request** → Backend API
4. **Business Logic** → Service Layer
5. **Data Access** → TypeORM Repository
6. **Database** → PostgreSQL
7. **Response** → Back through the stack

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation (class-validator)
- SQL injection prevention (TypeORM)
- XSS protection (React escaping)
- CORS configuration
- Rate limiting
- Helmet.js security headers

## Performance

### Backend Optimizations
- Database query optimization
- Redis caching
- Bull queue for async tasks
- Connection pooling
- Lazy loading

### Frontend Optimizations
- React Query caching
- Next.js Image optimization
- Code splitting
- Lazy loading
- Server-side rendering (SSR)
- Static generation (SSG)

## Scalability

- Horizontal scaling (multiple instances)
- Database replication
- Redis clustering
- Load balancing (Nginx)
- Microservices migration path (future)

## Deployment

### Development
- Docker Compose for local development
- Hot reload for both backend and frontend

### Production
- Kubernetes deployment
- CI/CD with GitHub Actions
- Environment-based configuration
- Health checks and monitoring
- Automated backups

## Why This Stack?

### NestJS (vs Django)
- ✅ TypeScript end-to-end
- ✅ Better for real-time features (WebSocket)
- ✅ Microservices-ready architecture
- ✅ Modern ecosystem
- ✅ Strong typing and IDE support
- ✅ Better performance for I/O operations
- ✅ Same language as frontend (JavaScript/TypeScript)

### Next.js
- ✅ Best-in-class React framework
- ✅ Excellent performance
- ✅ SEO-friendly
- ✅ Great developer experience
- ✅ Built-in optimizations

### PostgreSQL
- ✅ ACID compliance
- ✅ Complex queries support
- ✅ JSON support
- ✅ Excellent for ERP systems
- ✅ Mature and reliable

## Migration from Python

Since we're avoiding Python, the equivalent technologies are:

| Python/Django | Node.js/NestJS |
|---------------|----------------|
| Django | NestJS |
| Django REST Framework | NestJS Controllers |
| Celery | Bull Queue |
| pandas | JS libraries (mathjs, etc.) |
| ReportLab | PDFKit |
| openpyxl | ExcelJS |
| django-ses | Nodemailer |

All the business logic can be effectively implemented in TypeScript/JavaScript with similar or better performance.
