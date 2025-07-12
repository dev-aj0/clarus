import React from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import QuickActions from '@/components/QuickActions';
import AnalysisResultsArea from '@/components/AnalysisResultsArea';
import CenterBottomToast from '@/components/CenterBottomToast';
import { useCenterBottomToast } from '@/hooks/useCenterBottomToast';
import { useAnalysisManager } from '@/hooks/useAnalysisManager';

const Index = () => {
  const { toasts, removeToast, showSuccess, showError } = useCenterBottomToast();
  
  const {
    analyses,
    currentAnalysis,
    isLoading,
    savedAnalysisIds,
    handleAnalyze,
    handleSaveAnalysis,
    handleRemoveAnalysis,
    handleAnalysisSelect,
    handleCloseAnalysis
  } = useAnalysisManager({ showSuccess, showError });

  const showToast = (title: string, description?: string, variant?: 'default' | 'destructive') => {
    if (variant === 'destructive') {
      showError(title, description);
    } else {
      showSuccess(title, description);
    }
  };

  const handleQuickAction = (type: string) => {
    // This function is now handled within QuickActions component
  };

  // Function to clear inputs after successful analysis
  const clearInputs = () => {
    if (window.clearQuickActionsInputs) {
      window.clearQuickActionsInputs();
    }
  };

  // Fixed progress simulation - only goes forward
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = prev < 20 ? 5 : prev < 50 ? 4 : prev < 75 ? 3 : prev < 90 ? 2 : 1;
          return Math.min(prev + increment, 95);
        });
      }, 800);
    } else {
      // Complete the progress when loading finishes
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Wrap the analyze function to clear inputs after completion
  const handleAnalyzeWithClear = async (content: string, type: string) => {
    try {
      await handleAnalyze(content, type);
      // Clear inputs after successful analysis
      setTimeout(clearInputs, 500); // Small delay to ensure analysis state has updated
    } catch (error) {
      // Don't clear inputs if analysis failed
      console.error('Analysis failed:', error);
    }
  };

  // Wrapper function for saving current analysis
  const handleSaveCurrentAnalysis = () => {
    if (currentAnalysis) {
      handleSaveAnalysis(currentAnalysis);
    }
  };

  return (
    <>
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Analyzing your content..." 
        progress={progress}
      />
      <main className="flex-1 overflow-hidden min-h-screen h-full">
        <div className="container-consistent h-full min-h-screen flex flex-col">
          {/* Header */}
          <div className="mb-6 flex-shrink-0 mobile-header">
            <h1 className="text-3xl font-bold mb-2">Information Credibility Analysis</h1>
            <p className="text-muted-foreground font-medium">
              Fact-check information with reliable scientific research, presented in an accessible format to combat misinformation and bias.
            </p>
          </div>

          <div className="flex-1 grid gap-8 overflow-hidden min-h-0 h-full mobile-responsive-grid" style={{ gridTemplateColumns: 'minmax(0, 550px) 1fr' }}>
            {/* Left Column - Input (Fixed Width) */}
            <div className="flex flex-col min-w-0 max-h-[650px] h-[650px] mobile-card">
              <QuickActions 
                onActionSelect={handleQuickAction} 
                onAnalyze={handleAnalyzeWithClear}
                isLoading={isLoading}
                onShowToast={showToast}
                onClearInputs={clearInputs}
              />
            </div>

            {/* Right Column - Results (Flexible Width) */}
            <div className={`flex flex-col min-w-0 overflow-hidden mobile-card ${!currentAnalysis && !isLoading ? 'h-[650px] max-h-[650px]' : ''}`}>
              <AnalysisResultsArea
                isLoading={isLoading}
                currentAnalysis={currentAnalysis}
                onSaveAnalysis={handleSaveCurrentAnalysis}
                onShowToast={showToast}
                analysisId={currentAnalysis?.id}
                onCloseAnalysis={handleCloseAnalysis}
              />
            </div>
          </div>
        </div>
      </main>
      <CenterBottomToast toasts={toasts} removeToast={removeToast} />
    </>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    clearQuickActionsInputs?: () => void;
  }
}

export default Index;