
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Search, BookOpen, BarChart3 } from 'lucide-react';

interface AnalysisProgressProps {
  isVisible: boolean;
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ isVisible, progress }) => {
  if (!isVisible) return null;

  const steps = [
    { icon: Search, label: "Extracting content", threshold: 20 },
    { icon: BookOpen, label: "Searching sources", threshold: 40 },
    { icon: BarChart3, label: "Analyzing claims", threshold: 70 },
    { icon: CheckCircle, label: "Compiling results", threshold: 100 }
  ];

  const currentStep = steps.findIndex(step => progress < step.threshold);
  const activeStepIndex = currentStep === -1 ? steps.length - 1 : currentStep;

  return (
    <Card className="mt-4 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Analysis in Progress</h3>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="space-y-3">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isComplete = progress >= step.threshold;
              const isActive = index === activeStepIndex;
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-full transition-colors ${
                    isComplete 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : isActive 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}>
                    {isComplete ? (
                      <CheckCircle size={16} />
                    ) : isActive ? (
                      <Clock size={16} className="animate-pulse" />
                    ) : (
                      <IconComponent size={16} />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isComplete 
                      ? 'text-green-600 dark:text-green-400'
                      : isActive 
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisProgress;
