# ManufacturingOS ERP - Hybrid Architecture Guide
## Django Backend + Next.js Frontend

### Technology Decision & Rationale
**Architecture:** Django + Next.js  
**Decision Date:** 2024  
**Version:** 1.0

---

## 1. Technology Stack (Final)

```yaml
Backend:
  Core:
    Language: Python 3.11+
    Framework: Django 4.2 LTS
    API: Django REST Framework 3.14+
    Database: PostgreSQL 15+
    
  Processing:
    Task Queue: Celery 5.3+
    Message Broker: RabbitMQ 3.12+
    Cache: Redis 7.2+
    Search: Elasticsearch 8.11+
    
  Libraries:
    Financial: pandas, numpy
    PDF: ReportLab, WeasyPrint
    Excel: openpyxl, xlsxwriter
    Email: django-ses, sendgrid
    Workflow: django-viewflow or custom
    
Frontend:
  Core:
    Framework: Next.js 14+ (App Router)
    Language: TypeScript 5.3+
    UI Library: shadcn/ui (Tailwind + Radix)
    State: Zustand (simpler than Redux)
    
  Libraries:
    Forms: React Hook Form + Zod
    Tables: TanStack Table
    Charts: Recharts/Tremor
    API Client: Axios + React Query
    Auth: NextAuth.js
    
Mobile:
  Approach: PWA (Progressive Web App)
  Framework: Next.js PWA
  Alternative: React Native (Phase 2)
  
DevOps:
  Containers: Docker + Docker Compose
  Orchestration: Kubernetes
  CI/CD: GitHub Actions
  Monitoring: Prometheus + Grafana
  Logging: ELK Stack
```

---

## 2. Optimized Project Structure

```
b3-erp/
│
├── backend/                          # Django Backend
│   ├── config/                       # Project configuration
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── base.py             # Base settings
│   │   │   ├── local.py            # Local development
│   │   │   ├── production.py       # Production settings
│   │   │   └── test.py             # Test settings
│   │   ├── urls.py                 # Main URL configuration
│   │   ├── wsgi.py
│   │   ├── asgi.py                 # For WebSockets
│   │   └── celery.py               # Celery configuration
│   │
│   ├── apps/                        # Django Applications
│   │   ├── __init__.py
│   │   ├── core/                   # Shared/Common functionality
│   │   │   ├── models.py           # BaseModel, mixins
│   │   │   ├── permissions.py      # Custom permissions
│   │   │   ├── pagination.py       # Custom pagination
│   │   │   ├── exceptions.py       # Custom exceptions
│   │   │   ├── validators.py       # Custom validators
│   │   │   ├── middleware.py       # Custom middleware
│   │   │   └── utils.py            # Utility functions
│   │   │
│   │   ├── accounts/               # User & Authentication
│   │   │   ├── models.py           # User, Role, Permission
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── managers.py         # Custom managers
│   │   │   ├── authentication.py   # JWT/Session auth
│   │   │   └── tests/
│   │   │
│   │   ├── crm/                    # CRM Module
│   │   │   ├── models.py           # Lead, Customer, Opportunity
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── services.py         # Business logic
│   │   │   ├── tasks.py            # Celery tasks
│   │   │   ├── signals.py          # Django signals
│   │   │   ├── filters.py          # DRF filters
│   │   │   ├── urls.py             # Module URLs
│   │   │   └── tests/
│   │   │
│   │   ├── sales/                  # Sales Module
│   │   │   └── [similar structure]
│   │   │
│   │   ├── estimation/             # Estimation & Costing
│   │   │   ├── models.py           # BOQ, CostSheet, Quote
│   │   │   ├── calculators.py      # Pricing logic
│   │   │   └── [similar structure]
│   │   │
│   │   ├── inventory/              # Warehouse Management
│   │   │   ├── models.py           # Stock, Location, Movement
│   │   │   └── [similar structure]
│   │   │
│   │   ├── production/             # Production Planning
│   │   │   ├── models.py           # WorkOrder, BOM, Schedule
│   │   │   └── [similar structure]
│   │   │
│   │   ├── procurement/            # Purchasing
│   │   │   └── [similar structure]
│   │   │
│   │   ├── finance/                # Financial Accounting
│   │   │   ├── models.py           # Journal, Ledger, Invoice
│   │   │   ├── accounting.py       # Double-entry logic
│   │   │   └── [similar structure]
│   │   │
│   │   ├── hr/                     # Human Resources
│   │   │   └── [similar structure]
│   │   │
│   │   ├── workflow/               # Workflow Engine
│   │   │   ├── models.py           # Workflow, Task, State
│   │   │   ├── engine.py           # Workflow engine
│   │   │   ├── triggers.py         # Email/Event triggers
│   │   │   └── [similar structure]
│   │   │
│   │   └── reports/                # Reporting Engine
│   │       ├── generators.py       # Report generators
│   │       ├── exporters.py        # PDF/Excel exporters
│   │       └── templates/          # Report templates
│   │
│   ├── api/                        # API Configuration
│   │   ├── v1/
│   │   │   ├── urls.py            # API v1 URLs
│   │   │   └── docs.py            # API documentation
│   │   └── middleware.py          # API middleware
│   │
│   ├── services/                   # External Services
│   │   ├── email.py               # Email service
│   │   ├── sms.py                 # SMS service
│   │   ├── storage.py             # File storage (S3)
│   │   ├── payment.py             # Payment gateway
│   │   └── notifications.py       # Push notifications
│   │
│   ├── static/                     # Static files
│   ├── media/                      # Uploaded files
│   ├── templates/                  # Django templates (emails)
│   ├── fixtures/                   # Data fixtures
│   ├── logs/                       # Application logs
│   ├── tests/                      # Integration tests
│   ├── requirements.txt            # Python dependencies
│   ├── manage.py
│   └── .env.example
│
├── frontend/                        # Next.js Frontend
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 14)
│   │   │   ├── (auth)/           # Auth group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   │
│   │   │   ├── (dashboard)/       # Dashboard group
│   │   │   │   ├── layout.tsx    # Dashboard layout
│   │   │   │   ├── page.tsx      # Dashboard home
│   │   │   │   │
│   │   │   │   ├── crm/          # CRM pages
│   │   │   │   │   ├── leads/
│   │   │   │   │   ├── customers/
│   │   │   │   │   └── opportunities/
│   │   │   │   │
│   │   │   │   ├── sales/        # Sales pages
│   │   │   │   ├── inventory/    # Inventory pages
│   │   │   │   ├── production/   # Production pages
│   │   │   │   ├── finance/      # Finance pages
│   │   │   │   └── [other modules]/
│   │   │   │
│   │   │   ├── api/              # API routes (BFF pattern)
│   │   │   │   ├── auth/
│   │   │   │   └── proxy/        # Proxy to Django
│   │   │   │
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home page
│   │   │   └── globals.css       # Global styles
│   │   │
│   │   ├── components/            # React Components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── forms/            # Form components
│   │   │   ├── tables/           # Table components
│   │   │   ├── charts/           # Chart components
│   │   │   └── layouts/          # Layout components
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useWebSocket.ts
│   │   │
│   │   ├── lib/                   # Library code
│   │   │   ├── api-client.ts     # Axios configuration
│   │   │   ├── utils.ts          # Utility functions
│   │   │   └── constants.ts      # Constants
│   │   │
│   │   ├── stores/                # Zustand stores
│   │   │   ├── auth.store.ts
│   │   │   └── app.store.ts
│   │   │
│   │   └── types/                 # TypeScript types
│   │       ├── api.types.ts
│   │       └── models.types.ts
│   │
│   ├── public/                     # Static assets
│   ├── .env.local                  # Environment variables
│   ├── next.config.js              # Next.js configuration
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker/                          # Docker configuration
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── nginx/
│       └── nginx.conf
│
├── docs/                            # Documentation
│   ├── requirements/               # Business requirements
│   ├── api/                       # API documentation
│   ├── deployment/                # Deployment guides
│   └── development/               # Development guides
│
├── scripts/                         # Utility scripts
│   ├── setup.sh                   # Initial setup
│   ├── deploy.sh                  # Deployment script
│   └── backup.sh                  # Backup script
│
├── .github/                         # GitHub configuration
│   └── workflows/                  # CI/CD pipelines
│
├── docker-compose.yml              # Development environment
├── docker-compose.prod.yml         # Production setup
├── Makefile                        # Common commands
└── README.md
```

---

## 3. Development Workflow

### 3.1 Backend Development (Django)

```python
# apps/crm/models.py
from django.db import models
from apps.core.models import BaseModel

class Customer(BaseModel):
    """Customer model for CRM module."""
    
    # Fields
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    gst_number = models.CharField(max_length=15, blank=True)
    
    # Relationships
    account_manager = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True
    )
    
    # Metadata
    credit_limit = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        default=0
    )
    payment_terms = models.IntegerField(default=30)  # days
    
    class Meta:
        db_table = 'crm_customers'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
```

```python
# apps/crm/serializers.py
from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    outstanding_amount = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        read_only=True
    )
    
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('code', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        # Auto-generate customer code
        validated_data['code'] = self.generate_customer_code()
        return super().create(validated_data)
```

```python
# apps/crm/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Customer
from .serializers import CustomerSerializer
from apps.core.permissions import ModulePermission

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Customer management.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [ModulePermission]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['is_active', 'payment_terms']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['created_at', 'name']
```

### 3.2 Frontend Development (Next.js)

```typescript
// types/models.types.ts
export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  gstNumber?: string;
  creditLimit: number;
  paymentTerms: number;
  outstandingAmount?: number;
  createdAt: string;
  updatedAt: string;
}
```

```typescript
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

```typescript
// hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Customer } from '@/types/models.types';

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/crm/customers/');
      return data.results;
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: Partial<Customer>) => {
      const { data } = await apiClient.post('/crm/customers/', customer);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
```

```tsx
// app/(dashboard)/crm/customers/page.tsx
'use client';

import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>
      
      <DataTable
        columns={customerColumns}
        data={customers || []}
      />
      
      {/* Create Customer Dialog */}
    </div>
  );
}
```

---

## 4. API Communication Pattern

### 4.1 RESTful API Structure
```
Backend (Django)          Frontend (Next.js)
     ↓                           ↑
/api/v1/crm/customers/    →    /crm/customers
/api/v1/sales/orders/     →    /sales/orders
/api/v1/finance/invoices/ →    /finance/invoices
```

### 4.2 WebSocket for Real-time Updates
```python
# backend/apps/core/websocket.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            f"user_{self.scope['user'].id}",
            self.channel_name
        )
        await self.accept()
```

```typescript
// frontend/hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);
    
    return () => ws.close();
  }, [url]);
  
  return socket;
};
```

---

## 5. Authentication Flow

### 5.1 JWT-based Authentication
```python
# backend/apps/accounts/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['roles'] = list(user.roles.values_list('name', flat=True))
        return token
```

```typescript
// frontend/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${API_URL}/auth/token/`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        
        const user = await res.json();
        if (res.ok && user) {
          return user;
        }
        return null;
      }
    })
  ],
  // ... other config
};
```

---

## 6. Deployment Strategy

### 6.1 Docker Compose (Development)
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: b3_erp
      POSTGRES_USER: b3_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/code
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      DATABASE_URL: postgresql://b3_user:${DB_PASSWORD}@db:5432/b3_erp
      REDIS_URL: redis://redis:6379/0
  
  celery:
    build: ./backend
    command: celery -A config worker -l info
    volumes:
      - ./backend:/code
    depends_on:
      - db
      - redis
  
  frontend:
    build: ./frontend
    command: npm run dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1

volumes:
  postgres_data:
```

---

## 7. Performance Optimizations

### 7.1 Backend Optimizations
```python
# Use select_related and prefetch_related
customers = Customer.objects.select_related(
    'account_manager'
).prefetch_related(
    'orders', 
    'invoices'
)

# Database indexing
class Meta:
    indexes = [
        models.Index(fields=['email']),
        models.Index(fields=['created_at', '-updated_at']),
    ]

# Caching
from django.core.cache import cache

def get_customer_stats(customer_id):
    cache_key = f'customer_stats_{customer_id}'
    stats = cache.get(cache_key)
    if not stats:
        stats = calculate_stats(customer_id)
        cache.set(cache_key, stats, 3600)  # 1 hour
    return stats
```

### 7.2 Frontend Optimizations
```typescript
// Use React Query for caching
const { data } = useQuery({
  queryKey: ['customers', customerId],
  queryFn: fetchCustomer,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Lazy loading
const FinanceModule = lazy(() => import('./modules/finance'));

// Image optimization with Next.js
import Image from 'next/image';
```

---

## 8. Why This Architecture is Optimal

### For ManufacturingOS ERP Specifically:

1. **Complex Business Logic**: Django excels at handling complex business rules
2. **Financial Calculations**: Python's numerical libraries are superior
3. **Reporting**: Python has excellent PDF/Excel generation capabilities
4. **Modern UI**: Next.js provides exceptional user experience
5. **Scalability**: Both Django and Next.js scale horizontally
6. **Team Skills**: Easier to find Django/React developers
7. **Enterprise Features**: Django admin, permissions, migrations are battle-tested
8. **Integration**: Python has SDKs for most enterprise systems

---

## 9. Migration Path from Existing System

```bash
# Phase 1: Setup infrastructure
make setup-development

# Phase 2: Migrate core modules
python manage.py migrate
python manage.py loaddata initial_data

# Phase 3: Import existing data
python manage.py import_customers
python manage.py import_products

# Phase 4: Parallel run
# Run both old and new systems for 1 month

# Phase 5: Full cutover
make deploy-production
```

---

## 10. Decision Summary

**Use Django + Next.js because:**
- ✅ ERP systems need strong backend processing (Django)
- ✅ Modern UI is crucial for user adoption (Next.js)
- ✅ Financial/reporting features are better in Python
- ✅ Workflow engine is easier to build in Django
- ✅ Two specialized tools > one compromised solution
- ✅ Can hire specialists for each layer
- ✅ Proven architecture for enterprise systems

**Don't use only Next.js because:**
- ❌ Complex business logic becomes messy
- ❌ Background job processing is harder
- ❌ Financial calculations are limited
- ❌ Reporting capabilities are weaker

**Don't use only Django+HTMX because:**
- ❌ Modern UI expectations require React
- ❌ Mobile app would need separate development
- ❌ Real-time features are harder

---

This hybrid approach gives you the best of both worlds: Django's powerful backend capabilities with Next.js's modern frontend experience. Perfect for an ERP system!