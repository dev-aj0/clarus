import { AnalysisData, Analysis } from '@/types/analysis';

// Local analysis service for managing analyses in localStorage
export const analysisService = {
  getAllAnalyses: (userId: string): Analysis[] => {
    try {
      const saved = localStorage.getItem(`analyses_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading analyses:', error);
      return [];
    }
  },

  saveAnalysis: (userId: string, analysis: Analysis): void => {
    try {
      const analyses = analysisService.getAllAnalyses(userId);
      // Remove if already exists to avoid duplicates
      const filtered = analyses.filter(a => a.id !== analysis.id);
      filtered.unshift(analysis);
      localStorage.setItem(`analyses_${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  },

  deleteAnalysis: (userId: string, id: string): void => {
    try {
      const analyses = analysisService.getAllAnalyses(userId);
      const filtered = analyses.filter(a => a.id !== id);
      localStorage.setItem(`analyses_${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  },

  // History analyses are automatically saved after each analysis
  getAllHistoryAnalyses: (userId: string): Analysis[] => {
    try {
      const history = localStorage.getItem(`analysisHistory_${userId}`);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading analysis history:', error);
      return [];
    }
  },

  saveToHistory: (userId: string, analysis: Analysis): void => {
    try {
      const history = analysisService.getAllHistoryAnalyses(userId);
      // Remove if already exists to avoid duplicates
      const filtered = history.filter(a => a.id !== analysis.id);
      filtered.unshift(analysis);
      // Keep only last 50 analyses in history
      const trimmed = filtered.slice(0, 50);
      localStorage.setItem(`analysisHistory_${userId}`, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  },

  deleteHistoryAnalysis: (userId: string, id: string): void => {
    try {
      const history = analysisService.getAllHistoryAnalyses(userId);
      const filtered = history.filter(a => a.id !== id);
      localStorage.setItem(`analysisHistory_${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  }
};