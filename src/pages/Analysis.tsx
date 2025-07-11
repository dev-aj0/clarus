import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import SourceInput from '@/components/SourceInput';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import CenterBottomToast from '@/components/CenterBottomToast';
import { useCenterBottomToast } from '@/hooks/useCenterBottomToast';

interface AnalysisResult {
  summary: string;
  accuracy: 'accurate' | 'partially-accurate' | 'inaccurate';
  confidence: number;
  sources: Array<{
    title: string;
    url: string;
    authors: string;
    journal: string;
    summary: string;
    evidence: string;
  }>;
}

const Analysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toasts, removeToast, showSuccess, showError } = useCenterBottomToast();

  const handleAnalyze = async (content: string, type: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    
    try {
      console.log('Analysis.tsx: handleAnalyze received content for type:', type);
      
      // The content from perplexityApi should be a JSON string.
      if (typeof content !== 'string' || !content.trim().startsWith('{')) {
        console.error('Invalid content received by handleAnalyze. Expected a JSON string, but got:', content);
        throw new Error('Received invalid data from the analysis service.');
      }

      const parsedResult = JSON.parse(content);
      console.log('Analysis.tsx: Successfully parsed analysis result:', parsedResult);
      
      setAnalysisResult(parsedResult);
      showSuccess("Analysis Complete", "Content has been successfully analyzed.");
    } catch (error) {
      console.error('Analysis.tsx: Error in handleAnalyze:', error);
      let message = 'An unknown error occurred during analysis.';
      if (error instanceof Error) {
        message = error.message;
      }
      showError("Analysis Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (title: string, description?: string, variant?: 'default' | 'destructive') => {
    if (variant === 'destructive') {
      showError(title, description);
    } else {
      showSuccess(title, description);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-consistent">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scientific Content Analysis</h1>
          <p className="text-muted-foreground font-medium">
            Analyze scientific content for accuracy using Perplexity AI-powered fact-checking
          </p>
        </div>

        <div className="space-y-8">
          <SourceInput 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading}
            onShowToast={showToast}
          />
          
          {isLoading && (
            <Card className="p-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground font-extralight">Analyzing content with Perplexity AI...</span>
              </div>
            </Card>
          )}
          
          {analysisResult && (
            <AnalysisDisplay result={analysisResult} />
          )}
        </div>
      </div>

      <CenterBottomToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Analysis;