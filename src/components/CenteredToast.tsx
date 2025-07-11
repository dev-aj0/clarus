
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CenteredToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onClose: () => void;
}

const CenteredToast: React.FC<CenteredToastProps> = ({
  title,
  description,
  variant = 'default',
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`max-w-md mx-4 p-6 rounded-lg shadow-lg ${
        variant === 'destructive' 
          ? 'bg-destructive text-destructive-foreground' 
          : 'bg-card text-card-foreground border'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{title}</h4>
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 shrink-0"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CenteredToast;
