// Simple toast implementation
// This is a basic implementation. In production, consider using a library like react-hot-toast or sonner

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Store toast display function globally
let toastDisplayFn: ((options: ToastOptions) => void) | null = null;

export function setToastDisplay(fn: (options: ToastOptions) => void) {
  toastDisplayFn = fn;
}

export function toast(options: ToastOptions) {
  if (toastDisplayFn) {
    toastDisplayFn(options);
  } else {
    // Fallback to console if toast system not initialized
    console.log('Toast:', options.title, options.description);

    // Also show a simple browser alert for critical errors
    if (options.variant === 'destructive') {
      alert(`${options.title}: ${options.description}`);
    }
  }
}

// React hook
export function useToast() {
  return { toast };
}
