import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const STYLE_MAP = {
  success: {
    container: 'border-emerald-200 bg-white text-slate-900',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  },
  error: {
    container: 'border-rose-200 bg-white text-slate-900',
    icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
  },
  warning: {
    container: 'border-amber-200 bg-white text-slate-900',
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  },
  info: {
    container: 'border-indigo-200 bg-white text-slate-900',
    icon: <Info className="h-5 w-5 text-indigo-600" />,
  },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0">
      {toasts.map((toast) => {
        const style = STYLE_MAP[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg shadow-slate-900/5 transition-all ${style.container}`}
          >
            <div className="mt-0.5 shrink-0">{style.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
