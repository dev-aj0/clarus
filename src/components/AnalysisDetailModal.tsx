
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { Analysis } from '@/types/analysis';

interface AnalysisDetailModalProps {
  analysis: Analysis | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  analysis,
  isOpen,
  onOpenChange,
}) => {
  if (!analysis) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Analysis Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Analysis Info */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={getAccuracyColor(analysis.accuracy)}>
                {analysis.overallAccuracy}
              </Badge>
              <Badge variant="outline">
                {analysis.confidence}% confidence
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar size={14} />
                {new Date(analysis.timestamp).toLocaleDateString()}
              </div>
            </div>

            {/* Original Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Original Text</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-normal">{analysis.originalText}</p>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Analysis Summary</h3>
              <div className="bg-card border p-4 rounded-lg">
                <p className="text-sm font-normal leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            {/* Sources */}
            {analysis.sources && analysis.sources.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sources ({analysis.sources.length})</h3>
                <div className="space-y-3">
                  {analysis.sources.map((source: any, index: number) => (
                    <div key={index} className="border-l-4 border-primary pl-4 bg-card border rounded-r-lg p-3">
                      <h4 className="font-medium text-primary mb-1">{source.title}</h4>
                      {source.authors && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Authors: {source.authors}
                        </p>
                      )}
                      {source.journal && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Journal: {source.journal}
                        </p>
                      )}
                      {source.url && (
                        <Button variant="link" asChild className="p-0 h-auto text-sm">
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <ExternalLink size={12} />
                            View Source
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;
