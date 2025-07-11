
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Trash2 } from 'lucide-react';
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
import { Analysis } from '@/types/analysis';

interface RecentAnalysesProps {
  analyses: Analysis[];
  savedAnalysisIds: Set<string>;
  onAnalysisSelect: (analysis: Analysis) => void;
  onSaveAnalysis: (analysis: Analysis) => void;
  onRemoveAnalysis: (analysisId: string, event: React.MouseEvent) => void;
}

const RecentAnalyses: React.FC<RecentAnalysesProps> = ({
  analyses,
  savedAnalysisIds,
  onAnalysisSelect,
  onSaveAnalysis,
  onRemoveAnalysis
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);

  const getRecentAnalyses = () => {
    return analyses
      .filter(analysis => !savedAnalysisIds.has(analysis.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const handleDeleteClick = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setAnalysisToDelete(analysisId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (analysisToDelete) {
      // Create a mock event for the original handler
      const mockEvent = new MouseEvent('click') as unknown as React.MouseEvent;
      onRemoveAnalysis(analysisToDelete, mockEvent);
      setDeleteDialogOpen(false);
      setAnalysisToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAnalysisToDelete(null);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold">
            Recent Analyses
          </CardTitle>
          <CardDescription className="font-medium">Your most recent content analyses</CardDescription>
        </CardHeader>
        <CardContent>
          {getRecentAnalyses().length > 0 ? (
            <div className="space-y-3">
              {getRecentAnalyses().map(analysis => (
                <div key={analysis.id} className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors group" onClick={() => onAnalysisSelect(analysis)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-light">{analysis.originalText}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-light">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-light ${
                        analysis.overallAccuracy === 'Accurate' ? 'bg-green-100 text-green-800' : 
                        analysis.overallAccuracy === 'Partially Accurate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {analysis.overallAccuracy}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveAnalysis(analysis);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <BookmarkPlus size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDeleteClick(analysis.id, e)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4 font-light">
              No recent analyses. Start by analyzing some content above.
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to delete this analysis? This action cannot be undone and the analysis will be permanently removed from your recent history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecentAnalyses;
