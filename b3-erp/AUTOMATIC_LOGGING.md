# Automatic Logging for CRM Interactions

## Overview

The CRM Interactions module now includes automatic page visit logging functionality. Every time a user visits the `/crm/interactions` page, the visit is automatically logged to the backend for analytics and tracking purposes.

## Features

### 1. **Automatic Page Visit Logging**
- Every visit to `/crm/interactions` is automatically tracked
- Captures metadata including:
  - Referrer URL
  - User Agent (browser information)
  - Screen resolution
  - Timestamp
  - Page URL

### 2. **Backend API Endpoints**

#### Base URL: `/api/v1/crm/interactions`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Get all interactions |
| `/` | POST | Create a new interaction |
| `/:id` | GET | Get interaction by ID |
| `/:id` | PATCH | Update interaction |
| `/:id` | DELETE | Delete interaction |
| `/statistics` | GET | Get interaction statistics |
| `/log-visit` | POST | Log a page visit (auto-called) |

### 3. **Frontend Implementation**

#### Using the Page Visit Logger Hook

```typescript
import { usePageVisitLogger } from '@/hooks/usePageVisitLogger';

export default function MyPage() {
  // Automatically logs page visits
  usePageVisitLogger('/my-page-url', true);

  return <div>Page content</div>;
}
```

#### Using the Interactions Service

```typescript
import interactionsService from '@/services/interactions.service';

// Get all interactions
const interactions = await interactionsService.getAllInteractions();

// Get statistics
const stats = await interactionsService.getStatistics();

// Create a manual interaction
const newInteraction = await interactionsService.createInteraction({
  type: 'call',
  customer: 'ABC Company',
  contactPerson: 'John Doe',
  subject: 'Product inquiry',
  description: 'Customer asked about pricing',
  outcome: 'positive',
  duration: '15 mins',
});
```

## Data Structure

### Interaction Types
- `call` - Phone calls
- `email` - Email communications
- `meeting` - In-person or virtual meetings
- `site_visit` - Customer site visits
- `support` - Support requests
- `complaint` - Customer complaints
- `feedback` - Customer feedback
- `page_visit` - Automatic page visit logs

### Interaction Outcome
- `positive` - Positive outcome
- `neutral` - Neutral outcome
- `negative` - Negative outcome
- `follow_up_required` - Requires follow-up action

### Interaction Entity

```typescript
{
  id: string;
  type: InteractionType;
  customer?: string;
  contactPerson?: string;
  subject: string;
  description?: string;
  outcome?: InteractionOutcome;
  duration?: string;
  location?: string;
  performedBy?: string;
  dateTime: Date;
  followUpRequired?: boolean;
  followUpDate?: Date;
  assignedTo?: string;
  tags?: string[];
  relatedOpportunity?: string;
  relatedOrder?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Architecture

### Backend Structure
```
backend/src/modules/crm/
├── dto/
│   ├── create-interaction.dto.ts
│   └── update-interaction.dto.ts
├── entities/
│   └── interaction.entity.ts
├── interactions.controller.ts
├── interactions.service.ts
└── crm.module.ts
```

### Frontend Structure
```
frontend/src/
├── app/(modules)/crm/interactions/
│   ├── page.tsx (main interactions page with auto-logging)
│   ├── add/page.tsx
│   ├── edit/[id]/page.tsx
│   └── view/[id]/page.tsx
├── hooks/
│   └── usePageVisitLogger.ts
├── services/
│   └── interactions.service.ts
└── lib/
    └── api-client.ts
```

## Usage Examples

### 1. Viewing Page Visit Logs

Page visits are automatically logged and can be viewed alongside other interactions in the CRM Interactions dashboard. They are marked with type `page_visit`.

### 2. Analyzing User Behavior

Use the statistics endpoint to get insights:

```typescript
const stats = await interactionsService.getStatistics();
console.log('Total page visits:', stats.pageVisits);
console.log('Interactions by type:', stats.byType);
```

### 3. Custom Logging

You can also manually log custom events:

```typescript
await interactionsService.logPageVisit('/custom-page', {
  customField: 'customValue',
  action: 'button_click',
});
```

## Configuration

### Enable/Disable Automatic Logging

In the page component:

```typescript
// Enable logging (default)
usePageVisitLogger('/crm/interactions', true);

// Disable logging
usePageVisitLogger('/crm/interactions', false);
```

### Environment Variables

```env
# Backend
PORT=8000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Testing

### Start the Backend
```bash
cd b3-erp/backend
npm install
npm run start:dev
```

### Start the Frontend
```bash
cd b3-erp/frontend
npm install
npm run dev
```

### Test Automatic Logging
1. Navigate to `http://localhost:3000/crm/interactions`
2. Check the browser console for: `[Page Visit Logger] Logged visit to: /crm/interactions`
3. Check the backend console for: `[CRM] Interaction logged: page_visit - Page visit: /crm/interactions`

## Benefits

1. **User Behavior Analytics**: Track which pages users visit most frequently
2. **Session Tracking**: Understand user flow through the application
3. **Performance Metrics**: Monitor page load times and user engagement
4. **Audit Trail**: Complete history of page visits for compliance
5. **Integration Ready**: Easy to integrate with external analytics tools

## Future Enhancements

- [ ] User authentication integration for user-specific tracking
- [ ] Session management and user journey tracking
- [ ] Export logs to external analytics platforms (Google Analytics, Mixpanel, etc.)
- [ ] Advanced filtering and search for page visit logs
- [ ] Real-time dashboard with WebSocket updates
- [ ] Heatmap visualization of user interactions
- [ ] A/B testing capabilities

## Security Considerations

- Page visit data is stored securely on the backend
- No sensitive user information is logged by default
- Add authentication middleware to protect the API endpoints
- Consider GDPR compliance for European users
- Implement rate limiting to prevent log flooding

## Support

For questions or issues with the automatic logging feature, please contact the development team or open an issue in the project repository.
