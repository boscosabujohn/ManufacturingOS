# ManufacturingOS ERP System

# ManufacturingOS ERP System

A comprehensive Manufacturing ERP system built with modern technologies to manage all aspects of manufacturing operations.

## 🚀 Quick Start

### 🎨 **For UI/UX Development (Recommended to start)**
```bash
cd /Users/sabujohnbosco/KreupAI/ManufacturingOS/b3-erp

# Start frontend only - perfect for UI/UX work
./ui.sh
```
Then open http://localhost:3000 - **No backend needed!**

**See [UI_DEVELOPMENT.md](./UI_DEVELOPMENT.md) for UI/UX development guide**

---

### 🔧 **For Full Stack Development**
```bash
# Start everything (backend + frontend + database)
./start.sh

# Or use interactive setup
./dev-start.sh

# Or use Make
make docker-up && make dev
```

**For detailed setup instructions, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)**

## 🏗️ Tech Stack

## 🏗️ Architecture

- **Backend**: Node.js with NestJS framework
- **Frontend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL 15+
- **Cache**: Redis
- **Queue**: Bull (Redis-based)
- **UI**: Tailwind CSS + shadcn/ui

## 📁 Project Structure

```
b3-erp/
├── backend/              # NestJS Backend API
│   ├── src/
│   │   ├── modules/     # Business modules
│   │   ├── config/      # Configuration
│   │   ├── common/      # Shared utilities
│   │   └── services/    # External services
│   └── test/            # Tests
│
├── frontend/            # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Next.js App Router
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilities
│   │   └── types/      # TypeScript types
│   └── public/         # Static assets
│
├── docker/             # Docker configurations
├── docs/               # Documentation
└── scripts/            # Utility scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd b3-erp
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Modules

- **Core**: Shared functionality and utilities
- **Accounts**: User management and authentication
- **CRM**: Customer relationship management
- **Sales**: Sales order management
- **Estimation**: Cost estimation and quotations
- **Inventory**: Warehouse and stock management
- **Production**: Production planning and control
- **Procurement**: Purchase order management
- **Finance**: Financial accounting
- **HR**: Human resource management
- **Workflow**: Workflow automation
- **Reports**: Report generation
- **Logistics**: Logistics and transportation
- **Support**: Customer support and incidents
- **IT Admin**: System administration

## 🔗 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test           # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🛠️ Development

### Backend Development
- Hot reload enabled with `npm run start:dev`
- TypeORM migrations: `npm run migration:generate`
- Database seed: `npm run seed`

### Frontend Development
- Hot reload enabled with `npm run dev`
- Type checking: `npm run type-check`
- Linting: `npm run lint`

## 📝 License

Proprietary - B3 Technologies

## 👥 Team

- Development Team: KreupAI Technologies
