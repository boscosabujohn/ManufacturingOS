# ManufacturingOS - Claude Code Configuration

This project has Claude Code capabilities configured for optimal AI-assisted development.

## Project Overview

**ManufacturingOS** is a full-stack ERP system for manufacturing operations.

### Tech Stack
- **Frontend**: Next.js 14 + React 18 + TypeScript + TailwindCSS + Radix UI
- **Backend**: NestJS 10 + TypeORM + PostgreSQL
- **Architecture**: Monorepo (`b3-erp/frontend`, `b3-erp/backend`)

## Enabled Capabilities

The following Claude capabilities are enabled for this project:

| Capability | Description |
|------------|-------------|
| `workflow-manager` | Workflow engine design, state machines, approval processes |
| `ai-automation` | AI features, ML models, predictive analytics |
| `platform-capabilities` | Platform features, modules, user journeys |
| `developer-guidelines` | Coding standards, API conventions, security |
| `business-ops-marketing-manager` | Demos, sales materials, marketing content |
| `linkedin-expert` | Social media content, blog articles |
| `facility-management-expert` | FM modules, maintenance, asset tracking |
| `kreupai-solution-architect` | RFP analysis, solution architecture, proposals |
| `landing-page-developer` | High-converting landing pages |
| `backend-engineer` | Database schemas, APIs, frontend-backend wiring |
| `quality-assurance-engineer` | Testing, QA processes, automation |

## Capability Documentation

Detailed documentation for each capability is in `.claude/capabilities/`:

```
.claude/
├── settings.json
└── capabilities/
    ├── workflow-manager.md
    ├── ai-automation.md
    ├── platform-capabilities.md
    ├── developer-guidelines.md
    ├── business-ops-marketing-manager.md
    ├── linkedin-expert.md
    ├── facility-management-expert.md
    ├── kreupai-solution-architect.md
    ├── landing-page-developer.md
    ├── backend-engineer.md
    └── quality-assurance-engineer.md
```

## Development Commands

```bash
# Start backend
cd b3-erp/backend && npm run start:dev

# Start frontend
cd b3-erp/frontend && npm run dev

# Run with Docker
docker-compose up -d
```

## Key Directories

- `/b3-erp/backend/src/modules/` - Backend modules (HR, Sales, Production, etc.)
- `/b3-erp/frontend/src/app/` - Next.js pages
- `/b3-erp/frontend/src/components/` - React components
