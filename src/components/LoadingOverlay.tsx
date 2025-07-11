
import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = "Analyzing your content...",
  progress = 0
}) => {
  if (!isVisible) return null;

  // Calculate the stroke-dasharray for the progress circle
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg max-w-sm mx-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Progress Circle */}
          <div className="relative w-24 h-24">
            {/* Background circle */}
            <svg
              className="w-24 h-24 transform -rotate-90"
              width="96"
              height="96"
              viewBox="0 0 96 96"
            >
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-green-500 transition-all duration-500 ease-out"
              />
            </svg>
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          {/* Loading message */}
          <div className="text-center">
            <p className="font-medium text-base mb-1">{message}</p>
            <p className="text-sm text-muted-foreground font-normal">
              Please wait while we verify the information...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
