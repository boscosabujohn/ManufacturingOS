# Pages with Automatic Logging

This document tracks all pages in the ManufacturingOS ERP system that have automatic page visit logging enabled.

## What is Automatic Logging?

Automatic page visit logging tracks every time a user visits a page, capturing:
- Page URL
- Timestamp
- Referrer (where user came from)
- User Agent (browser information)
- Screen resolution
- Custom metadata

All logs are sent to the backend API at `/api/v1/crm/interactions/log-visit` and stored for analytics.

## Pages with Logging Enabled

### 1. CRM - Interactions
- **Route**: `/crm/interactions`
- **File**: `frontend/src/app/(modules)/crm/interactions/page.tsx`
- **Status**: ✅ Enabled
- **Added**: Initial implementation

### 2. Sales - RFP/Proposals
- **Route**: `/sales/rfp`
- **File**: `frontend/src/app/(modules)/sales/rfp/page.tsx`
- **Status**: ✅ Enabled
- **Added**: October 13, 2025

## How to Add Logging to a New Page

### Method 1: Manual (Recommended for understanding)

1. Add `'use client';` directive at the top of the file
2. Import the hook:
   ```typescript
   import { usePageVisitLogger } from '@/hooks/usePageVisitLogger';
   ```
3. Add the hook call inside your component:
   ```typescript
   export default function MyPage() {
     // Automatically log page visits
     usePageVisitLogger('/my-page-route', true);

     return <div>...</div>;
   }
   ```

### Method 2: Using the Helper Script

```bash
cd b3-erp
./scripts/add-page-logging.sh src/app/(modules)/sales/rfp/page.tsx /sales/rfp
```

**Note**: The script provides a good starting point but may need manual adjustments for complex components.

## Example Implementation

### Before:
```typescript
import PageLayout from '@/components/PageLayout';

export default function RFPPage() {
  return (
    <PageLayout
      title="RFP/Proposals"
      description="Create and manage proposals"
      icon="FileText"
    />
  );
}
```

### After:
```typescript
'use client';

import PageLayout from '@/components/PageLayout';
import { usePageVisitLogger } from '@/hooks/usePageVisitLogger';

export default function RFPPage() {
  // Automatically log page visits
  usePageVisitLogger('/sales/rfp', true);

  return (
    <PageLayout
      title="RFP/Proposals"
      description="Create and manage proposals"
      icon="FileText"
    />
  );
}
```

## Testing

### 1. Start the Services

**Backend:**
```bash
cd b3-erp/backend
npm run start:dev
```

**Frontend:**
```bash
cd b3-erp/frontend
npm run dev
```

### 2. Visit the Page
Navigate to the page in your browser (e.g., `http://localhost:3001/sales/rfp`)

### 3. Check Console Logs

**Browser Console:**
```
[Page Visit Logger] Logged visit to: /sales/rfp
```

**Backend Console:**
```
[CRM] Interaction logged: page_visit - Page visit: /sales/rfp
```

### 4. Verify in API

```bash
# Get all interactions
curl http://localhost:8000/api/v1/crm/interactions

# Get statistics
curl http://localhost:8000/api/v1/crm/interactions/statistics
```

## API Response Example

When you visit `/sales/rfp`, the system creates an interaction:

```json
{
  "id": "1",
  "type": "page_visit",
  "subject": "Page visit: /sales/rfp",
  "description": "User visited /sales/rfp",
  "dateTime": "2025-10-13T17:45:00.000Z",
  "metadata": {
    "pageUrl": "/sales/rfp",
    "referrer": "http://localhost:3001/dashboard",
    "userAgent": "Mozilla/5.0...",
    "screenResolution": "1920x1080",
    "timestamp": "2025-10-13T17:45:00.000Z"
  },
  "createdAt": "2025-10-13T17:45:00.000Z",
  "updatedAt": "2025-10-13T17:45:00.000Z"
}
```

## Configuration Options

### Enable/Disable Logging

```typescript
// Enable (default)
usePageVisitLogger('/my-page', true);

// Disable
usePageVisitLogger('/my-page', false);
```

### Conditional Logging

```typescript
export default function MyPage() {
  const shouldLog = process.env.NODE_ENV === 'production';
  usePageVisitLogger('/my-page', shouldLog);

  return <div>...</div>;
}
```

## Pages That Should Have Logging

Consider adding automatic logging to these high-traffic pages:

### CRM Module
- [x] `/crm/interactions` - Already enabled
- [ ] `/crm/customers`
- [ ] `/crm/leads`
- [ ] `/crm/opportunities`

### Sales Module
- [x] `/sales/rfp` - Already enabled
- [ ] `/sales/quotations`
- [ ] `/sales/orders`
- [ ] `/sales/handover`

### Estimation Module
- [ ] `/estimation/boq`
- [ ] `/estimation/costing`
- [ ] `/estimation/pricing`

### Production Module
- [ ] `/production/ppg`
- [ ] `/production/work-orders`
- [ ] `/production/scheduling`
- [ ] `/production/floor`
- [ ] `/production/quality`

### Inventory Module
- [ ] `/inventory/warehouse`
- [ ] `/inventory/stock`
- [ ] `/inventory/movements`
- [ ] `/inventory/transfers`

### Procurement Module
- [ ] `/procurement/requisitions`
- [ ] `/procurement/rfq`
- [ ] `/procurement/po`
- [ ] `/procurement/vendors`
- [ ] `/procurement/grn`

### Projects Module
- [ ] `/projects/planning`
- [ ] `/projects/commissioning`
- [ ] `/projects/tracking`
- [ ] `/projects/resources`

### Finance Module
- [ ] `/finance/accounting`
- [ ] `/finance/invoices`
- [ ] `/finance/payments`
- [ ] `/finance/receivables`
- [ ] `/finance/payables`

### HR Module
- [ ] `/hr/employees`
- [ ] `/hr/attendance`
- [ ] `/hr/payroll`
- [ ] `/hr/leave`
- [ ] `/hr/performance`

### Other Modules
- [ ] `/workflow/automation`
- [ ] `/reports/analytics`
- [ ] `/logistics/shipping`
- [ ] `/support/tickets`
- [ ] `/it-admin/users`

## Analytics & Reporting

### View Page Visit Statistics

```typescript
import interactionsService from '@/services/interactions.service';

const stats = await interactionsService.getStatistics();
console.log('Page visits by type:', stats.byType.page_visit);
```

### Filter Page Visits

```typescript
const allInteractions = await interactionsService.getAllInteractions();
const pageVisits = allInteractions.filter(i => i.type === 'page_visit');

// Group by page
const visitsByPage = pageVisits.reduce((acc, visit) => {
  const page = visit.metadata?.pageUrl || 'unknown';
  acc[page] = (acc[page] || 0) + 1;
  return acc;
}, {});

console.log('Visits by page:', visitsByPage);
```

## Best Practices

1. **Add to All Important Pages**: Track user navigation patterns
2. **Don't Over-Log**: Avoid logging on pages that refresh frequently
3. **Test Locally First**: Verify logging works before deploying
4. **Monitor Performance**: Ensure logging doesn't slow down page loads
5. **Privacy Compliance**: Follow GDPR and privacy regulations

## Troubleshooting

### Logging Not Working?

1. Check browser console for errors
2. Verify backend is running (`http://localhost:8000`)
3. Check API endpoint is accessible: `curl http://localhost:8000/api/v1/crm/interactions/log-visit -X POST -H "Content-Type: application/json" -d '{"pageUrl":"/test"}'`
4. Verify `usePageVisitLogger` hook is imported correctly
5. Ensure component has `'use client';` directive

### TypeScript Errors?

Make sure the hook file exists:
```bash
ls -la frontend/src/hooks/usePageVisitLogger.ts
```

### Backend Not Receiving Logs?

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify CORS settings in backend
3. Check network tab in browser DevTools

## Future Enhancements

- [ ] Add user authentication tracking
- [ ] Implement session management
- [ ] Create analytics dashboard
- [ ] Export reports to CSV/Excel
- [ ] Add real-time monitoring with WebSocket
- [ ] Integrate with Google Analytics
- [ ] Add heatmap visualization
- [ ] Implement A/B testing support

## Related Documentation

- [AUTOMATIC_LOGGING.md](AUTOMATIC_LOGGING.md) - Complete feature documentation
- [CRM_INTERACTIONS_LOGGING_SUMMARY.md](CRM_INTERACTIONS_LOGGING_SUMMARY.md) - Implementation summary
- [scripts/add-page-logging.sh](scripts/add-page-logging.sh) - Helper script

## Support

For questions or issues with automatic logging:
- Review the documentation above
- Check the code examples
- Contact the development team
