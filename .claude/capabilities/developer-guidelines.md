# Developer Guidelines

Comprehensive development standards and best practices for the platform. Use when developers need guidance on coding standards, API conventions, database patterns, microservices architecture, event-driven design, security best practices.

## Use When

1. Setting up development environment
2. Writing code that follows platform standards
3. Designing APIs
4. Implementing security measures
5. Code reviews and architecture decisions

## Coding Standards

### Backend (NestJS)
- Use TypeScript strict mode
- Follow module-based architecture
- Implement DTOs for all API inputs/outputs
- Use class-validator for validation
- Follow REST API naming conventions

### Frontend (Next.js/React)
- Use functional components with hooks
- Implement TypeScript interfaces for props
- Follow atomic design principles
- Use TailwindCSS for styling
- Implement proper error boundaries

### Database (TypeORM/PostgreSQL)
- Use UUID for primary keys
- Include audit fields (createdAt, updatedAt, createdBy)
- Normalize data appropriately
- Use migrations for schema changes
- Index frequently queried columns

## Security Guidelines

- Validate all inputs
- Use parameterized queries
- Implement RBAC for authorization
- Sanitize outputs to prevent XSS
- Use HTTPS for all communications
