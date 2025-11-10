# ERP Project Structure & Development Instructions
## Complete Guide for AI-Assisted Code Generation

### Project: ManufacturingOS ERP System
**Version:** 1.0  
**Last Updated:** 2024  
**Purpose:** Instruction set for Claude CLI and AI-assisted development

---

## 1. Technology Stack Declaration

### Core Technologies
```yaml
Backend:
  Language: Python 3.11+
  Framework: Django 4.2+ with Django REST Framework
  Database: PostgreSQL 15+
  Cache: Redis 7+
  Queue: Celery with RabbitMQ
  Search: Elasticsearch 8+

Frontend:
  Framework: React 18+ with TypeScript
  UI Library: Material-UI (MUI) v5
  State Management: Redux Toolkit
  Build Tool: Vite
  CSS: Tailwind CSS + MUI Theme

Infrastructure:
  Container: Docker & Docker Compose
  Orchestration: Kubernetes (Production)
  CI/CD: GitHub Actions
  Cloud: AWS/Azure ready
  Monitoring: Prometheus + Grafana

Development:
  Version Control: Git
  Package Manager: Poetry (Python), pnpm (Node.js)
  Code Quality: Black, Flake8, ESLint, Prettier
  Testing: Pytest, Jest, React Testing Library
  API Docs: OpenAPI/Swagger
```

---

## 2. Project Directory Structure

### Complete Directory Layout
```
b3-macbis-erp/
│
├── docs/                           # All Documentation
│   ├── requirements/               # Business Requirements
│   │   ├── modules/               # Module-specific BRS
│   │   │   ├── 01-crm.md
│   │   │   ├── 02-sales.md
│   │   │   ├── 03-estimation-costing.md
│   │   │   ├── 04-ppg-production.md
│   │   │   ├── 05-procurement.md
│   │   │   ├── 06-warehouse.md
│   │   │   ├── 07-projects.md
│   │   │   ├── 08-logistics.md
│   │   │   ├── 09-commissioning.md
│   │   │   ├── 10-hrm.md
│   │   │   ├── 11-support.md
│   │   │   ├── 12-it-admin.md
│   │   │   ├── 13-finance.md
│   │   │   └── 14-workflow.md
│   │   │
│   │   ├── integration/           # Integration specifications
│   │   │   ├── api-specifications.md
│   │   │   ├── data-flow.md
│   │   │   └── external-systems.md
│   │   │
│   │   └── index.md               # Requirements overview
│   │
│   ├── technical/                 # Technical Documentation
│   │   ├── architecture.md
│   │   ├── database-design.md
│   │   ├── api-design.md
│   │   ├── security.md
│   │   └── deployment.md
│   │
│   ├── user/                      # User Documentation
│   │   ├── user-manual.md
│   │   ├── admin-guide.md
│   │   └── training/
│   │
│   └── development/               # Development Guidelines
│       ├── coding-standards.md
│       ├── git-workflow.md
│       ├── testing-guide.md
│       └── claude-instructions.md # THIS DOCUMENT
│
├── backend/                        # Django Backend
│   ├── config/                    # Project configuration
│   │   ├── __init__.py
│   │   ├── settings/              # Environment-specific settings
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   ├── staging.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── apps/                      # Django Applications
│   │   ├── core/                 # Core/Common functionality
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py      # Abstract base models
│   │   │   │   └── mixins.py    # Model mixins
│   │   │   ├── serializers/
│   │   │   ├── views/
│   │   │   ├── utils/
│   │   │   ├── permissions/
│   │   │   └── middleware/
│   │   │
│   │   ├── authentication/       # User & Auth
│   │   │   ├── models/
│   │   │   ├── serializers/
│   │   │   ├── views/
│   │   │   └── tests/
│   │   │
│   │   ├── crm/                  # CRM Module
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── customer.py
│   │   │   │   ├── lead.py
│   │   │   │   ├── opportunity.py
│   │   │   │   └── interaction.py
│   │   │   ├── serializers/
│   │   │   ├── views/
│   │   │   ├── services/         # Business logic
│   │   │   ├── tasks/            # Celery tasks
│   │   │   ├── signals/          # Django signals
│   │   │   ├── admin/            # Django admin
│   │   │   ├── tests/
│   │   │   └── migrations/
│   │   │
│   │   ├── sales/                # Sales Module
│   │   │   ├── models/
│   │   │   │   ├── order.py
│   │   │   │   ├── quotation.py
│   │   │   │   └── contract.py
│   │   │   └── [similar structure]
│   │   │
│   │   ├── estimation/           # Estimation & Costing
│   │   │   ├── models/
│   │   │   │   ├── boq.py
│   │   │   │   ├── cost_sheet.py
│   │   │   │   ├── pricing.py
│   │   │   │   └── margin.py
│   │   │   └── [similar structure]
│   │   │
│   │   ├── production/           # PPG Module
│   │   │   ├── models/
│   │   │   │   ├── work_order.py
│   │   │   │   ├── bom.py
│   │   │   │   ├── planning.py
│   │   │   │   └── scheduling.py
│   │   │   └── [similar structure]
│   │   │
│   │   ├── procurement/          # Procurement Module
│   │   │   └── [similar structure]
│   │   │
│   │   ├── warehouse/            # Warehouse Module
│   │   │   └── [similar structure]
│   │   │
│   │   ├── projects/             # Project Management
│   │   │   └── [similar structure]
│   │   │
│   │   ├── logistics/            # Logistics Module
│   │   │   └── [similar structure]
│   │   │
│   │   ├── hr/                   # Human Resources
│   │   │   └── [similar structure]
│   │   │
│   │   ├── support/              # Support & Service
│   │   │   └── [similar structure]
│   │   │
│   │   ├── finance/              # Financial Accounting
│   │   │   ├── models/
│   │   │   │   ├── account.py
│   │   │   │   ├── journal.py
│   │   │   │   ├── invoice.py
│   │   │   │   ├── payment.py
│   │   │   │   └── tax.py
│   │   │   └── [similar structure]
│   │   │
│   │   ├── workflow/             # Workflow Engine
│   │   │   ├── models/
│   │   │   │   ├── workflow.py
│   │   │   │   ├── task.py
│   │   │   │   ├── transition.py
│   │   │   │   └── notification.py
│   │   │   ├── engine/          # Workflow engine logic
│   │   │   └── [similar structure]
│   │   │
│   │   └── reports/              # Reporting Module
│   │       └── [similar structure]
│   │
│   ├── migrations/               # Database migrations (auto-generated)
│   │   └── [managed by Django]
│   │
│   ├── api/                      # API Configuration
│   │   ├── v1/                   # API Version 1
│   │   │   ├── urls.py
│   │   │   ├── serializers.py
│   │   │   └── views.py
│   │   └── schema/               # OpenAPI Schema
│   │
│   ├── services/                 # Shared Services
│   │   ├── email_service.py
│   │   ├── sms_service.py
│   │   ├── pdf_generator.py
│   │   ├── excel_handler.py
│   │   └── external_api.py
│   │
│   ├── tests/                    # Test Directory
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   │
│   ├── static/                   # Static files
│   ├── media/                    # User uploaded files
│   ├── templates/                # Email/PDF templates
│   ├── requirements/             # Python dependencies
│   │   ├── base.txt
│   │   ├── development.txt
│   │   └── production.txt
│   ├── manage.py
│   └── pyproject.toml           # Poetry configuration
│
├── frontend/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   └── charts/
│   │   │
│   │   ├── modules/             # Module-specific components
│   │   │   ├── crm/
│   │   │   ├── sales/
│   │   │   ├── production/
│   │   │   └── [other modules]/
│   │   │
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store
│   │   ├── utils/
│   │   ├── types/               # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── mobile/                       # Mobile App (React Native)
│   └── [React Native structure]
│
├── scripts/                      # Utility Scripts
│   ├── setup/                   # Setup scripts
│   ├── backup/                  # Backup scripts
│   ├── deployment/              # Deployment scripts
│   └── data-migration/          # Data migration scripts
│
├── docker/                      # Docker Configuration
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf
│
├── k8s/                         # Kubernetes Manifests
│   ├── deployments/
│   ├── services/
│   └── configmaps/
│
├── .github/                     # GitHub Configuration
│   └── workflows/               # GitHub Actions
│       ├── ci.yml
│       ├── cd.yml
│       └── tests.yml
│
├── docker-compose.yml           # Local development
├── docker-compose.prod.yml      # Production setup
├── .env.example                 # Environment variables template
├── .gitignore
├── README.md
└── LICENSE
```

---

## 3. Module-Specific Instructions

### 3.1 Creating a New Module

When Claude CLI needs to create code for a module, follow this pattern:

```bash
# INSTRUCTION FOR CLAUDE CLI:
# When asked to create [MODULE_NAME] module:

1. Create Django app:
   backend/apps/[module_name]/

2. Create model files in:
   backend/apps/[module_name]/models/

3. Create serializer files in:
   backend/apps/[module_name]/serializers/

4. Create view files in:
   backend/apps/[module_name]/views/

5. Create service files in:
   backend/apps/[module_name]/services/

6. Create frontend module in:
   frontend/src/modules/[module_name]/

7. Update documentation in:
   docs/requirements/modules/[module_number]-[module_name].md
```

### 3.2 Model Creation Pattern

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/[module_name]/models/[entity].py
# Pattern for creating Django models:

from django.db import models
from apps.core.models.base import BaseModel  # Always inherit from BaseModel

class [EntityName](BaseModel):
    """
    Model representing [entity description].
    Related to BRS document: docs/requirements/modules/[module].md
    """
    # Add fields based on requirements document
    
    class Meta:
        db_table = '[module]_[entity]'
        verbose_name = '[Entity Name]'
        verbose_name_plural = '[Entity Names]'
        ordering = ['-created_at']  # Default ordering
        
    def __str__(self):
        return f"{self.name}"  # Meaningful string representation
```

### 3.3 Migration Management

```bash
# INSTRUCTION FOR CLAUDE CLI:
# For database migrations, use these commands:

# Create migration after model changes:
python manage.py makemigrations [app_name]

# Migration files should be in:
backend/apps/[module_name]/migrations/

# Naming convention for custom migrations:
backend/apps/[module_name]/migrations/XXXX_custom_[description].py
```

### 3.4 API Endpoint Pattern

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/[module_name]/views/
# API endpoint pattern:

from rest_framework import viewsets
from apps.core.permissions import ModulePermission

class [EntityName]ViewSet(viewsets.ModelViewSet):
    """
    API endpoint for [Entity].
    
    Endpoints:
    - GET /api/v1/[module]/[entities]/
    - POST /api/v1/[module]/[entities]/
    - GET /api/v1/[module]/[entities]/{id}/
    - PUT /api/v1/[module]/[entities]/{id}/
    - DELETE /api/v1/[module]/[entities]/{id}/
    """
    queryset = [EntityName].objects.all()
    serializer_class = [EntityName]Serializer
    permission_classes = [ModulePermission]
    filterset_fields = ['status', 'created_at']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at']
```

### 3.5 Service Layer Pattern

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/[module_name]/services/[service_name].py
# Business logic should be in service layer:

class [ServiceName]Service:
    """
    Service handling business logic for [feature].
    Implements requirements from: docs/requirements/modules/[module].md#[section]
    """
    
    @staticmethod
    def process_[action](data):
        """
        Process [specific business action].
        
        Args:
            data: Input data dictionary
            
        Returns:
            Processed result
            
        Raises:
            BusinessException: When business rules are violated
        """
        # Implement business logic here
        pass
```

---

## 4. Frontend Development Instructions

### 4.1 Component Structure

```typescript
// INSTRUCTION FOR CLAUDE CLI:
// Location: frontend/src/modules/[module_name]/components/[ComponentName].tsx

import React from 'react';
import { Box, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

interface [ComponentName]Props {
    // Define props based on requirements
}

export const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
    // Component implementation
    return (
        <Paper>
            {/* Component JSX */}
        </Paper>
    );
};
```

### 4.2 API Service Pattern

```typescript
// INSTRUCTION FOR CLAUDE CLI:
// Location: frontend/src/services/[module_name].service.ts

import { apiClient } from '@/utils/api-client';

export class [ModuleName]Service {
    private static readonly BASE_URL = '/api/v1/[module_name]';
    
    static async get[Entities]() {
        return apiClient.get(`${this.BASE_URL}/[entities]/`);
    }
    
    static async create[Entity](data: [Entity]CreateDto) {
        return apiClient.post(`${this.BASE_URL}/[entities]/`, data);
    }
    
    // Add other CRUD operations
}
```

---

## 5. Workflow Implementation Instructions

### 5.1 Workflow Definition

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/workflow/definitions/[workflow_name].py

from apps.workflow.engine import WorkflowDefinition

class [WorkflowName]Workflow(WorkflowDefinition):
    """
    Implements workflow: [workflow description]
    Reference: docs/requirements/modules/14-workflow.md#[section]
    """
    
    name = '[workflow_name]'
    description = '[workflow description]'
    
    def define_steps(self):
        return [
            # Define workflow steps
        ]
    
    def define_transitions(self):
        return [
            # Define transitions between steps
        ]
```

### 5.2 Email Trigger Pattern

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/workflow/triggers/email_triggers.py

from apps.workflow.engine import EmailTrigger

class [TriggerName]EmailTrigger(EmailTrigger):
    """
    Email trigger for [workflow].
    Pattern: [email pattern description]
    """
    
    email_pattern = r'[regex pattern]'
    workflow = '[workflow_name]'
    
    def parse_email(self, email):
        # Extract data from email
        return extracted_data
```

---

## 6. Testing Instructions

### 6.1 Unit Test Pattern

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/apps/[module_name]/tests/test_[feature].py

import pytest
from django.test import TestCase

class [Feature]TestCase(TestCase):
    """
    Test cases for [feature].
    Tests requirements from: docs/requirements/modules/[module].md#[section]
    """
    
    def setUp(self):
        # Test setup
        pass
    
    def test_[specific_scenario](self):
        # Test implementation
        pass
```

### 6.2 Frontend Test Pattern

```typescript
// INSTRUCTION FOR CLAUDE CLI:
// Location: frontend/src/modules/[module_name]/tests/[Component].test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('[ComponentName]', () => {
    it('should [test scenario]', async () => {
        // Test implementation
    });
});
```

---

## 7. Database Instructions

### 7.1 Database Schema Conventions

```sql
-- INSTRUCTION FOR CLAUDE CLI:
-- Database naming conventions:

-- Tables: [module]_[entity]
-- Example: crm_customer, sales_order

-- Fields: snake_case
-- Example: customer_name, order_date

-- Foreign Keys: [entity]_id
-- Example: customer_id, order_id

-- Indexes: idx_[table]_[field(s)]
-- Example: idx_crm_customer_email
```

### 7.2 Common Fields (BaseModel)

```python
# INSTRUCTION FOR CLAUDE CLI:
# Every model inherits these fields from BaseModel:

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, related_name='+')
    updated_by = models.ForeignKey(User, related_name='+')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        abstract = True
```

---

## 8. Configuration Management

### 8.1 Environment Variables

```bash
# INSTRUCTION FOR CLAUDE CLI:
# Location: .env.example
# Environment variables for each module:

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/b3_macbis_erp

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Module-specific settings
CRM_API_KEY=
FINANCE_TAX_API=
WORKFLOW_ENGINE_URL=

# Add new environment variables as needed
```

### 8.2 Module Settings

```python
# INSTRUCTION FOR CLAUDE CLI:
# Location: backend/config/settings/modules/[module_name].py

# Module-specific settings
[MODULE_NAME]_SETTINGS = {
    'ENABLE_FEATURE_X': True,
    'API_TIMEOUT': 30,
    'BATCH_SIZE': 100,
    # Add module-specific configuration
}
```

---

## 9. Integration Points

### 9.1 Inter-Module Communication

```python
# INSTRUCTION FOR CLAUDE CLI:
# For inter-module communication, use service layer:

# Location: backend/apps/[module_a]/services/integration.py

from apps.[module_b].services import ModuleBService

class ModuleAIntegrationService:
    """Handles integration with other modules."""
    
    @staticmethod
    def trigger_module_b_action(data):
        # Use service layer, not direct model access
        return ModuleBService.process_action(data)
```

### 9.2 Event Publishing

```python
# INSTRUCTION FOR CLAUDE CLI:
# For event-driven communication:

from apps.core.events import EventPublisher

# Publish event
EventPublisher.publish(
    event_type='ORDER_CREATED',
    payload={'order_id': order.id}
)

# Subscribe to event (in target module)
@event_handler('ORDER_CREATED')
def handle_order_created(payload):
    # Process event
    pass
```

---

## 10. Deployment Instructions

### 10.1 Docker Build

```dockerfile
# INSTRUCTION FOR CLAUDE CLI:
# Location: docker/backend/Dockerfile

FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install
COPY . .
CMD ["gunicorn", "config.wsgi:application"]
```

### 10.2 CI/CD Pipeline

```yaml
# INSTRUCTION FOR CLAUDE CLI:
# Location: .github/workflows/ci.yml

name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up
```

---

## 11. Code Generation Rules for Claude CLI

### STRICT RULES FOR CODE GENERATION:

1. **Always check documentation first**
   - Read: `docs/requirements/modules/[module_name].md`
   - Follow the business requirements exactly

2. **File placement rules**
   - Models: `backend/apps/[module]/models/`
   - Views: `backend/apps/[module]/views/`
   - Services: `backend/apps/[module]/services/`
   - Tests: `backend/apps/[module]/tests/`

3. **Naming conventions**
   - Models: PascalCase (CustomerOrder)
   - Files: snake_case (customer_order.py)
   - URLs: kebab-case (/customer-orders/)
   - React components: PascalCase (CustomerOrder.tsx)

4. **Import order**
   ```python
   # Standard library
   # Third-party
   # Django
   # Local apps
   ```

5. **Documentation**
   - Every class needs a docstring
   - Reference the BRS section
   - Include parameter descriptions

6. **Testing**
   - Create test file for every feature
   - Minimum 80% code coverage
   - Test business logic, not framework

7. **Security**
   - Always use permission classes
   - Validate all inputs
   - Sanitize outputs
   - Use parameterized queries

8. **Performance**
   - Use select_related/prefetch_related
   - Implement pagination
   - Add database indexes
   - Cache where appropriate

---

## 12. Module Priority & Dependencies

### Build Order (IMPORTANT):
```
1. Core & Authentication (Required first)
2. Workflow Engine (Foundation for all)
3. CRM & Sales (Revenue generation)
4. Estimation & Costing (Critical for quotes)
5. Procurement & Warehouse (Supply chain)
6. Production (PPG) (Manufacturing)
7. Finance (Monetary transactions)
8. HR (People management)
9. Projects & Logistics (Execution)
10. Support (After-sales)
11. Reports & Analytics (Insights)
```

### Module Dependencies:
```yaml
CRM:
  depends_on: [core, workflow]
  
Sales:
  depends_on: [core, workflow, crm, estimation]
  
Estimation:
  depends_on: [core, warehouse]
  
Production:
  depends_on: [core, workflow, sales, warehouse]
  
Finance:
  depends_on: [core, all_other_modules]
```

---

## 13. Common Patterns Library

### 13.1 Approval Pattern
```python
# INSTRUCTION: Use this pattern for any approval process
class ApprovalMixin(models.Model):
    APPROVAL_PENDING = 'pending'
    APPROVAL_APPROVED = 'approved'
    APPROVAL_REJECTED = 'rejected'
    
    approval_status = models.CharField(max_length=20)
    approved_by = models.ForeignKey(User, null=True)
    approved_at = models.DateTimeField(null=True)
    approval_notes = models.TextField(blank=True)
```

### 13.2 Status Tracking Pattern
```python
# INSTRUCTION: Use for any entity with status
class StatusMixin(models.Model):
    status = models.CharField(max_length=50)
    status_history = models.JSONField(default=list)
    
    def change_status(self, new_status, user, notes=''):
        # Log status change
        pass
```

### 13.3 Document Attachment Pattern
```python
# INSTRUCTION: Use for document management
class DocumentMixin(models.Model):
    attachments = models.ManyToManyField('core.Document')
    
    def add_document(self, file, doc_type):
        # Handle document upload
        pass
```

---

## 14. Error Handling Instructions

### Standard Error Response Format:
```json
{
    "error": {
        "code": "MODULE_ERROR_CODE",
        "message": "User-friendly message",
        "details": {},
        "timestamp": "2024-01-01T00:00:00Z",
        "trace_id": "uuid"
    }
}
```

### Error Code Convention:
```
[MODULE]_[ERROR_TYPE]_[SPECIFIC_ERROR]
Example: CRM_VALIDATION_EMAIL_INVALID
```

---

## 15. Final Instructions for Claude CLI

### When generating code:

1. **Start with documentation**
   - Read the relevant BRS document
   - Understand the business requirements
   - Check module dependencies

2. **Create in correct location**
   - Follow the directory structure exactly
   - Use correct naming conventions
   - Maintain consistent patterns

3. **Implement completely**
   - Include all CRUD operations
   - Add business logic in services
   - Create comprehensive tests
   - Include error handling

4. **Document everything**
   - Add docstrings
   - Update API documentation
   - Create user guides
   - Add inline comments for complex logic

5. **Integrate properly**
   - Use workflow engine for processes
   - Publish events for other modules
   - Use service layer for integration
   - Maintain loose coupling

### Example Claude CLI Command:
```bash
# Generate CRM module lead management
claude-cli generate module crm feature lead-management \
  --docs docs/requirements/modules/01-crm.md \
  --section "Lead Management" \
  --output backend/apps/crm/
```

---

## Remember:
- This document is the source of truth for code structure
- Every file should be traceable to a requirement
- Maintain consistency across all modules
- When in doubt, check the documentation
- Always test before committing

---

*This instruction document should be consulted before any code generation to ensure consistency and maintainability of the ManufacturingOS ERP system.*