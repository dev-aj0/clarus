import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, ExternalLink, BookmarkPlus, Trash2, FileText, Search, History, Bookmark } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CenterBottomToast from '@/components/CenterBottomToast';
import AnalysisDetailModal from '@/components/AnalysisDetailModal';
import { useCenterBottomToast } from '@/hooks/useCenterBottomToast';
import { analysisService } from '@/services/analysisService';
import { Analysis } from '@/types/analysis';
import { useAuth } from '@/contexts/AuthContext';

const Library = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [savedAnalyses, setSavedAnalyses] = useState<Analysis[]>([]);
  const [historyAnalyses, setHistoryAnalyses] = useState<Analysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<{ id: string; isFromSaved: boolean } | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useCenterBottomToast();

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = () => {
    try {
      // Load saved analyses (user explicitly saved these)
      const saved = analysisService.getAllAnalyses(userId);
      setSavedAnalyses(saved);
      
      // Load history analyses (automatically saved after each analysis)
      const history = analysisService.getAllHistoryAnalyses(userId);
      setHistoryAnalyses(history);
    } catch (error) {
      console.error('Error loading library data:', error);
    }
  };

  const handleDeleteClick = (analysisId: string, isFromSaved: boolean = true) => {
    setAnalysisToDelete({ id: analysisId, isFromSaved });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (analysisToDelete) {
      handleRemoveAnalysis(analysisToDelete.id, analysisToDelete.isFromSaved);
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };

  const handleRemoveAnalysis = (analysisId: string, isFromSaved: boolean = true) => {
    try {
      if (isFromSaved) {
        analysisService.deleteAnalysis(userId, analysisId);
        loadLibraryData();
        showSuccess("Analysis Removed", "The analysis has been removed from your saved collection.");
      } else {
        analysisService.deleteHistoryAnalysis(userId, analysisId);
        loadLibraryData();
        showSuccess("Analysis Removed", "The analysis has been removed from your history.");
      }
    } catch (error) {
      console.error('Error removing analysis:', error);
      showError("Remove Failed", "Failed to remove the analysis. Please try again.");
    }
  };

  const handleSaveFromHistory = (analysis: Analysis) => {
    try {
      // Check if already saved
      const isAlreadySaved = savedAnalyses.some(saved => saved.id === analysis.id);
      if (isAlreadySaved) {
        showError("Already Saved", "This analysis is already in your saved collection.");
        return;
      }
      
      analysisService.saveAnalysis(userId, analysis);
      loadLibraryData();
      showSuccess("Analysis Saved", "The analysis has been added to your saved collection.");
    } catch (error) {
      console.error('Error saving analysis:', error);
      showError("Save Failed", "Failed to save the analysis. Please try again.");
    }
  };

  const handleViewDetails = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setDetailModalOpen(true);
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy.toLowerCase()) {
      case 'accurate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'partially-accurate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'inaccurate':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filterAnalyses = (analyses: Analysis[]) => {
    return analyses.filter(analysis => 
      analysis.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderAnalysisCard = (analysis: Analysis, isFromSaved: boolean = true) => (
    <Card key={analysis.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
          <FileText size={20} />
          Analysis #{analysis.id.slice(-6)}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-1 font-normal">
          {analysis.originalText}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge className={getAccuracyColor(analysis.accuracy)} variant="outline">
          {analysis.overallAccuracy}
        </Badge>
        
        <p className="text-sm text-muted-foreground line-clamp-3 font-normal">
          {analysis.summary}
        </p>

        <div className="text-xs text-muted-foreground font-normal">
          {new Date(analysis.timestamp).toLocaleDateString()} • {analysis.sources?.length || 0} sources
        </div>

        <div className="flex gap-2 pt-2">
          {!isFromSaved && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSaveFromHistory(analysis)}
              className="flex items-center gap-1 hover:scale-105 transition-all duration-200"
            >
              <BookmarkPlus size={14} />
              Save
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:scale-105 transition-all duration-200"
            onClick={() => handleViewDetails(analysis)}
          >
            <ExternalLink size={14} className="mr-2" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteClick(analysis.id, isFromSaved)} 
            className="text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="container-consistent h-full flex flex-col">
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-3xl mb-2 font-bold">Analysis Library</h1>
            <p className="text-muted-foreground font-medium">
              Your saved analyses and recent analysis history
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 flex-shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 placeholder:font-normal hover:border-primary/50 focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>

          {/* Tabs for Saved vs History */}
          <div className="flex-1 min-h-0">
            <Tabs defaultValue="saved" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                <TabsTrigger value="saved" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  <Bookmark size={16} />
                  Saved Analyses ({savedAnalyses.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                  <History size={16} />
                  Recent History ({historyAnalyses.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-6">
                <TabsContent value="saved" className="mt-0">
                  {filterAnalyses(savedAnalyses).length === 0 ? (
                    <div className="text-center py-12">
                      <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved analyses yet</h3>
                      <p className="text-muted-foreground font-normal">
                        {searchTerm 
                          ? "No saved analyses match your search criteria." 
                          : "Save analyses from your history or after completing new analysis to see them here."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterAnalyses(savedAnalyses).map((analysis) => renderAnalysisCard(analysis, true))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                  {filterAnalyses(historyAnalyses).length === 0 ? (
                    <div className="text-center py-12">
                      <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No analysis history yet</h3>
                      <p className="text-muted-foreground font-normal">
                        {searchTerm 
                          ? "No analyses in your history match your search criteria." 
                          : "Your analysis history will appear here automatically after you analyze content."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterAnalyses(historyAnalyses).map((analysis) => renderAnalysisCard(analysis, false))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <CenterBottomToast toasts={toasts} removeToast={removeToast} />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to delete this analysis? This action cannot be undone and the analysis will be permanently removed from your {analysisToDelete?.isFromSaved ? 'saved collection' : 'history'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} className="hover:scale-105 transition-transform duration-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 transition-all duration-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnalysisDetailModal
        analysis={selectedAnalysis}
        isOpen={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </>
  );
};

export default Library;