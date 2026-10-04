import { ToastVariant } from '../components/ui/Toast';

export const AUTH_TOAST_KEY = 'auth_toast';
export const AUTH_TOAST_VARIANT_KEY = 'auth_toast_variant';

/**
 * Stores a toast message and variant in sessionStorage to be displayed
 * on the destination page (e.g. after sign out or session expiration).
 */
export function setAuthToast(message: string, variant: ToastVariant = 'success'): void {
  try {
    sessionStorage.setItem(AUTH_TOAST_KEY, message);
    sessionStorage.setItem(AUTH_TOAST_VARIANT_KEY, variant);
  } catch {
    // Gracefully handle private browsing or restricted environments
  }
}

/**
 * Reads and immediately removes the pending auth toast from sessionStorage.
 */
export function popAuthToast(): { message: string; variant: ToastVariant } | null {
  try {
    const message = sessionStorage.getItem(AUTH_TOAST_KEY);
    if (!message) return null;

    const variant = (sessionStorage.getItem(AUTH_TOAST_VARIANT_KEY) as ToastVariant) || 'success';
    sessionStorage.removeItem(AUTH_TOAST_KEY);
    sessionStorage.removeItem(AUTH_TOAST_VARIANT_KEY);

    return { message, variant };
  } catch {
    return null;
  }
}
