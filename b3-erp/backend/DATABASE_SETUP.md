# B3 ERP Backend - Database Setup

## Schema Configuration

The backend is configured to use the **`kreupai_factory_os`** PostgreSQL schema.

## Environment Variables

Create a `.env` file in the `backend` directory with:

```bash
DB_HOST=your-database-host
DB_PORT=25060
DB_USERNAME=doadmin
DB_PASSWORD=your-actual-password
DB_DATABASE=defaultdb
DB_SCHEMA=kreupai_factory_os
DB_SSL=true
DB_LOGGING=true
NODE_ENV=development
```

## Database Initialization

### Development Mode

When running in development mode (`NODE_ENV !== 'production'`), TypeORM will automatically:
1. Create the `kreupai_factory_os` schema if it doesn't exist
2. Synchronize all entity definitions to create/update tables

Simply run:

```bash
npm run start:dev
```

The tables will be created automatically on first startup.

### Production Mode

For production, set `NODE_ENV=production` and use migrations:

```bash
npm run typeorm -- migration:run -d src/data-source.ts
```

## Recent Entity Fixes

- ✅ Fixed duplicate index on `status` column in `quality-gate.entity.ts`
- ✅ Fixed duplicate foreign key definition in `boq-item.entity.ts`
- ✅ Added schema support for PostgreSQL
- ✅ Removed hardcoded database credentials

## Tables Created

The workflow engine creates 30+ tables including:
- Projects and BOQ management
- Workflow definitions and instances
- Document management with versioning
- Approval workflows
- Quality gates and defect tracking
- Notifications and preferences
- Analytics and reporting
