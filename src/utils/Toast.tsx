import { toast } from 'sonner'

// Preserve the existing useToast() call-site API.
// Components that call sendToast(msg, type) keep working unchanged.
export function useToast() {
  return (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else toast(message)
  }
}

// No-op provider — Toaster is mounted in App.tsx via sonner's <Toaster />
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
