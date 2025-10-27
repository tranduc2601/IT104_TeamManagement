import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

export type Toast = {
  id: string;
  type: "info" | "success" | "error";
  title?: string;
  message: string;
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">, ttl?: number) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">, ttl = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
    const newToast: Toast = { id, ...toast };
    setToasts((t) => [newToast, ...t]);
    if (ttl > 0) setTimeout(() => removeToast(id), ttl);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
