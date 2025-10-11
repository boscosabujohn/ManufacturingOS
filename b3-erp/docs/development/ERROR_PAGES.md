# Error Pages Documentation

## Overview
Custom error pages have been implemented for the B3 MACBIS ERP system to provide a better user experience when errors occur. The error messages are hidden by default, with an option for users (or developers) to view technical details.

## Error Pages Created

### 1. **404 Not Found Page** (`/app/not-found.tsx`)
**Triggered when**: A page doesn't exist or URL is incorrect

**Features**:
- 🎨 Beautiful gradient background (blue to purple)
- 🔢 Large animated "404" text with pulsing circles
- 📝 User-friendly message: "Oops! Page Not Found"
- 🔘 Two action buttons:
  - "Back to Dashboard" (primary)
  - "Go Back" (secondary)
- 🔗 6 quick links to popular pages (Dashboard, CRM, Sales, etc.)
- 🔍 Collapsible "Show Error Details" section with:
  - Status Code
  - Error Message
  - Requested Path
  - Timestamp
  - User Agent
  - Copy to clipboard button

### 2. **General Error Page** (`/app/error.tsx`)
**Triggered when**: Application errors occur during runtime

**Features**:
- 🎨 Red/orange gradient background
- ⚠️ Animated warning triangle icon
- 📝 User-friendly message: "Oops! Something Went Wrong"
- 🔘 Two action buttons:
  - "Try Again" (retry - primary)
  - "Back to Dashboard" (secondary)
- 💡 "What you can try" section with 3 helpful tips
- 🔍 Collapsible technical details with:
  - Error Name
  - Error Message
  - Error Digest (if available)
  - Timestamp
  - Full Stack Trace
  - Copy to clipboard button

### 3. **Global Error Page** (`/app/global-error.tsx`)
**Triggered when**: Critical system-wide errors occur

**Features**:
- 🎨 Purple/red gradient background
- ⚡ Animated lightning bolt icon
- 📝 Critical error message
- 🔘 Two action buttons:
  - "Reload Application" (primary)
  - "Back to Dashboard" (secondary)
- 🔍 Collapsible technical details
- 🆘 Urgent contact information

## Key Features

### ✅ User-Friendly Design
- **No technical jargon** in main message
- **Friendly, reassuring tone**
- **Clear call-to-action buttons**
- **Helpful suggestions** instead of blame

### ✅ Progressive Disclosure
- **Error details hidden by default**
- **Toggle button** to show/hide technical information
- **Smooth animations** when expanding/collapsing
- **Only relevant information** shown to users

### ✅ Technical Details (Optional)
When users click "Show Error Details":
- Error name and type
- Full error message
- Error digest/ID (for support reference)
- Timestamp
- Stack trace (for developers)
- Request path (404 only)
- User agent information
- **Copy to clipboard** functionality

### ✅ Accessibility
- **Keyboard navigation** support
- **Clear visual hierarchy**
- **High contrast** text and backgrounds
- **Responsive design** for all screen sizes

### ✅ Professional Design Elements
- **Gradient backgrounds** for visual appeal
- **Animated icons** with pulsing effects
- **Smooth transitions** on interactions
- **Consistent color coding**:
  - Blue/Purple: 404 errors
  - Red/Orange: Runtime errors
  - Purple/Red: Critical errors

## Usage Examples

### 404 Error - Page Not Found
```
User navigates to: /dashboard/non-existent-page
→ Shows: Beautiful 404 page with helpful links
→ User can: Go back, visit dashboard, or view technical details
```

### Runtime Error - General Error
```
API call fails or component crashes
→ Shows: Error page with "Try Again" button
→ User can: Retry action, go to dashboard, or view stack trace
```

### Critical Error - Global Error
```
Application-wide crash (rare)
→ Shows: Critical error page
→ User can: Reload app or contact support urgently
```

## Error Details Structure

### For 404 Errors:
```json
{
  "statusCode": 404,
  "message": "Page Not Found",
  "timestamp": "2025-10-09T...",
  "path": "/requested/path",
  "userAgent": "Mozilla/5.0..."
}
```

### For Runtime Errors:
```json
{
  "name": "TypeError",
  "message": "Cannot read property...",
  "digest": "abc123...",
  "timestamp": "2025-10-09T...",
  "stack": "Error: ...\n  at Component..."
}
```

## Copy to Clipboard
All error pages include a "Copy Error Details" button that:
- Copies formatted JSON to clipboard
- Shows confirmation alert
- Makes it easy to share errors with support

## Contact Information
Each error page includes support contact:
- Email: support@b3erp.com
- Error ID reference (when available)
- Encouragement to reach out if needed

## Best Practices

### ✅ DO:
- Keep main message friendly and non-technical
- Provide clear next steps
- Hide technical details by default
- Make it easy to recover or navigate away
- Include support contact information

### ❌ DON'T:
- Show stack traces immediately
- Use technical jargon in main message
- Blame the user
- Make it hard to leave the error page
- Forget to log errors server-side

## Testing Error Pages

### Test 404 Error:
Navigate to any non-existent URL:
```
http://localhost:3000/this-page-does-not-exist
```

### Test Runtime Error:
Trigger an error in a component (for development):
```typescript
// Add to any page temporarily
throw new Error('Test error');
```

### Test Global Error:
Throw an error in root layout (for development)

## Customization

### Change Colors:
Update gradient classes in each error page:
```typescript
// 404: Blue/Purple
className="bg-gradient-to-br from-blue-50 via-white to-purple-50"

// Error: Red/Orange  
className="bg-gradient-to-br from-red-50 via-white to-orange-50"

// Global: Purple/Red
className="bg-gradient-to-br from-purple-50 via-white to-red-50"
```

### Change Suggested Links (404):
Edit the `suggestedLinks` array in `not-found.tsx`

### Change Help Tips (Error):
Edit the tips grid in `error.tsx`

## Integration with Error Tracking

Future enhancement: Send error details to monitoring service:
```typescript
useEffect(() => {
  // Send to Sentry, LogRocket, etc.
  sendToErrorTracking({
    error: errorDetails,
    userId: user?.id,
    context: additionalContext,
  });
}, [error]);
```

## Exception Handling Components

### ErrorBoundary Component (`/components/ErrorBoundary.tsx`)
**Purpose**: Catch React component exceptions/errors

**Features**:
- 🎨 Yellow/orange gradient design
- 🔄 Reset functionality to retry rendering
- 📊 Component stack trace display
- 🔍 Hidden exception details by default
- 💾 Optional custom fallback UI
- 📋 Copy exception details to clipboard

**Usage**:
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

function MyApp() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => logError(error)}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### AsyncErrorBoundary Component (`/components/AsyncErrorBoundary.tsx`)
**Purpose**: Handle async operations and data fetching errors

**Features**:
- 🎨 Blue/indigo gradient design
- ⏳ Loading state management
- 🔄 Retry functionality for failed operations
- 🔍 Hidden async exception details
- 🌐 Network error handling
- 📋 Copy async exception details

**Usage**:
```tsx
import { AsyncErrorBoundary } from '@/components/AsyncErrorBoundary';

function DataComponent() {
  return (
    <AsyncErrorBoundary
      loadingFallback={<CustomLoader />}
      onError={(error) => logAsyncError(error)}
    >
      <DataFetchingComponent />
    </AsyncErrorBoundary>
  );
}
```

### Dashboard Module Error (`/app/(dashboard)/error.tsx`)
**Purpose**: Handle errors within dashboard modules

**Features**:
- 🎨 Orange/red gradient design
- 🔙 Back to dashboard navigation
- 📝 Module-specific error handling
- 🔍 Hidden exception details
- 💡 Quick recovery steps

## Exception Types Handled

### 1. **Component Exceptions** (ErrorBoundary)
- React rendering errors
- Component lifecycle errors
- Event handler exceptions
- Child component errors

### 2. **Async Exceptions** (AsyncErrorBoundary)
- API fetch failures
- Network timeouts
- Data loading errors
- Promise rejections

### 3. **Module Exceptions** (Dashboard Error)
- Module-specific errors
- Route-level errors
- Feature errors within modules

## Files Created

```
✅ /app/not-found.tsx                    - 404 error page
✅ /app/error.tsx                        - Runtime error page  
✅ /app/global-error.tsx                 - Critical error page
✅ /app/(dashboard)/error.tsx            - Dashboard module error page
✅ /components/ErrorBoundary.tsx         - React error boundary component
✅ /components/AsyncErrorBoundary.tsx    - Async error boundary component
✅ /docs/development/ERROR_PAGES.md      - This documentation
```

## Screenshots Features

### Default View (All Error Pages):
- Large, friendly error message
- Clear action buttons
- Helpful suggestions or links
- No technical information visible

### Expanded View (With Details):
- Smooth expansion animation
- Well-formatted technical details
- Monospaced font for code
- Scrollable stack trace
- Copy button at bottom

The error pages provide a perfect balance between user-friendliness and technical detail availability! 🎉
