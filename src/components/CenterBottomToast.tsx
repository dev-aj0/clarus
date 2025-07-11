
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface CenterBottomToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const CenterBottomToast: React.FC<CenterBottomToastProps> = ({ toasts, removeToast }) => {
  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        removeToast(toast.id);
      }, 4000); // Reduced from 5000 to 4000ms for faster auto-dismiss
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-white/95 border-green-200 shadow-green-100/50 dark:bg-green-900/90 dark:border-green-700';
      case 'error':
        return 'bg-white/95 border-red-200 shadow-red-100/50 dark:bg-red-900/90 dark:border-red-700';
      case 'warning':
        return 'bg-white/95 border-yellow-200 shadow-yellow-100/50 dark:bg-yellow-900/90 dark:border-yellow-700';
      default:
        return 'bg-white/95 border-blue-200 shadow-blue-100/50 dark:bg-blue-900/90 dark:border-blue-700';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md max-w-md pointer-events-auto ${getBackgroundColor(toast.type)} shadow-xl animate-in slide-in-from-bottom-4 fade-in-0 duration-500`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'both'
          }}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{toast.title}</p>
            {toast.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-tight">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CenterBottomToast;
