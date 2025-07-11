
import { useState, useEffect, useCallback } from 'react';
import { analysisService } from '@/services/analysisService';
import { Analysis, AnalysisData } from '@/types/analysis';
import { analyzeContent } from '@/utils/perplexityApi';
import { useAuth } from '@/contexts/AuthContext';

interface UseAnalysisManagerProps {
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
}

export const useAnalysisManager = ({ showSuccess, showError }: UseAnalysisManagerProps) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const currentAnalysisKey = `currentAnalysis_${userId}`;
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAnalysisIds, setSavedAnalysisIds] = useState<Set<string>>(new Set());

  const loadSavedAnalyses = useCallback(() => {
    try {
      const saved = analysisService.getAllAnalyses(userId);
      setAnalyses(saved);
      const savedIds = new Set(saved.map(analysis => analysis.id));
      setSavedAnalysisIds(savedIds);
    } catch (error) {
      console.error('Error loading saved analyses:', error);
    }
  }, [userId]);

  // Load current analysis from sessionStorage on mount (clears on reload)
  useEffect(() => {
    loadSavedAnalyses();
    
    // Load persisted current analysis from sessionStorage
    try {
      const persistedAnalysis = sessionStorage.getItem(currentAnalysisKey);
      if (persistedAnalysis) {
        setCurrentAnalysis(JSON.parse(persistedAnalysis));
      } else {
        setCurrentAnalysis(null);
      }
    } catch (error) {
      console.error('Error loading persisted analysis:', error);
    }
    // Clean up any old currentAnalysis keys for other users
    const allKeys = Object.keys(sessionStorage);
    allKeys.forEach((key) => {
      if (key.startsWith('currentAnalysis_') && key !== currentAnalysisKey) {
        sessionStorage.removeItem(key);
      }
    });
  }, [loadSavedAnalyses, currentAnalysisKey]);

  // Persist current analysis to sessionStorage whenever it changes
  useEffect(() => {
    if (currentAnalysis) {
      sessionStorage.setItem(currentAnalysisKey, JSON.stringify(currentAnalysis));
    } else {
      sessionStorage.removeItem(currentAnalysisKey);
    }
  }, [currentAnalysis, currentAnalysisKey]);

  const handleAnalyze = async (content: string, type: string) => {
    setIsLoading(true);
    setCurrentAnalysis(null);

    try {
      console.log('=== STARTING ANALYSIS ===');
      console.log('Content type:', type);
      console.log('Content preview:', content.substring(0, 200));
      
      // Pass the type to analyzeContent
      const resultJson = await analyzeContent(content, type as any);
      console.log('=== RAW API RESULT ===');
      console.log('Result type:', typeof resultJson);
      console.log('Result content:', resultJson);
      
      let analysisData: AnalysisData;
      
      if (typeof resultJson === 'string') {
        try {
          analysisData = JSON.parse(resultJson);
          console.log('=== PARSED FROM STRING ===');
        } catch (parseError) {
          console.error('Failed to parse JSON string:', parseError);
          throw new Error('Invalid response format from analysis service');
        }
      } else {
        analysisData = resultJson as AnalysisData;
        console.log('=== USED DIRECTLY AS OBJECT ===');
      }
      
      console.log('=== FINAL ANALYSIS DATA ===');
      console.log('Summary:', analysisData.summary);
      console.log('Accuracy:', analysisData.accuracy);
      console.log('Confidence:', analysisData.confidence);
      console.log('Sources count:', analysisData.sources?.length || 0);
      console.log('Sources:', analysisData.sources);

      if (!analysisData.summary || !analysisData.accuracy || typeof analysisData.confidence !== 'number') {
        console.error('Invalid analysis data structure:', analysisData);
        throw new Error('Invalid analysis data received from API');
      }
      
      if (!Array.isArray(analysisData.sources)) {
        console.warn('Sources is not an array, defaulting to empty array');
        analysisData.sources = [];
      }
      
      const newAnalysis: Analysis = {
        id: Date.now().toString(),
        originalText: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        overallAccuracy: analysisData.accuracy === 'accurate' ? 'Accurate' : 
                        analysisData.accuracy === 'partially-accurate' ? 'Partially Accurate' : 'Inaccurate',
        timestamp: new Date().toISOString(),
        summary: analysisData.summary,
        accuracy: analysisData.accuracy,
        confidence: analysisData.confidence,
        sources: analysisData.sources || []
      };
      
      console.log('=== CREATED ANALYSIS OBJECT ===');
      console.log('Analysis ID:', newAnalysis.id);
      console.log('Summary length:', newAnalysis.summary.length);
      console.log('Sources count:', newAnalysis.sources.length);
      console.log('Full analysis object:', newAnalysis);
      
      setCurrentAnalysis(newAnalysis);
      
      // Automatically save to history
      analysisService.saveToHistory(userId, newAnalysis);
      console.log('=== SAVED TO HISTORY ===');
      
      // Update the current analyses list if not already saved
      if (!savedAnalysisIds.has(newAnalysis.id)) {
        setAnalyses(prev => [newAnalysis, ...prev]);
      }
      
      const sourcesFound = newAnalysis.sources?.length || 0;
      showSuccess("Analysis Complete", `Analysis completed with ${sourcesFound} research sources found.`);
      
    } catch (error) {
      console.error("=== ERROR DURING ANALYSIS ===");
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      showError("Analysis Failed", error instanceof Error ? error.message : "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAnalysis = (analysis: Analysis) => {
    try {
      if (savedAnalysisIds.has(analysis.id)) {
        return;
      }

      analysisService.saveAnalysis(userId, analysis);
      
      setSavedAnalysisIds(prev => new Set([...prev, analysis.id]));
      setAnalyses(prev => prev.filter(a => a.id !== analysis.id));
      
      loadSavedAnalyses();
      showSuccess("Analysis Saved", "The analysis has been saved to your library.");
    } catch (error) {
      console.error("Error saving analysis:", error);
      showError("Save Failed", "Failed to save the analysis. Please try again.");
    }
  };

  const handleRemoveAnalysis = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      analysisService.deleteAnalysis(userId, analysisId);
      loadSavedAnalyses();
      if (currentAnalysis?.id === analysisId) {
        setCurrentAnalysis(null);
        sessionStorage.removeItem(currentAnalysisKey);
      }
      showSuccess("Analysis Removed", "The analysis has been removed from your history.");
    } catch (error) {
      console.error("Error removing analysis:", error);
      showError("Remove Failed", "Failed to remove the analysis. Please try again.");
    }
  };

  const handleAnalysisSelect = (analysis: Analysis) => {
    setCurrentAnalysis(analysis);
  };

  const handleCloseAnalysis = () => {
    setCurrentAnalysis(null);
    sessionStorage.removeItem(currentAnalysisKey);
  };

  return {
    analyses,
    currentAnalysis,
    isLoading,
    savedAnalysisIds,
    handleAnalyze,
    handleSaveAnalysis,
    handleRemoveAnalysis,
    handleAnalysisSelect,
    handleCloseAnalysis
  };
};
