
import React from 'react';
import AnalysisResult from './AnalysisResult';
import AnalysisProgress from './AnalysisProgress';
import { Card, CardContent } from './ui/card';
import { FileSearch } from 'lucide-react';
import { Analysis } from '@/types/analysis';

interface AnalysisResultsAreaProps {
  isLoading: boolean;
  currentAnalysis: Analysis | null;
  onSaveAnalysis?: () => void;
  onShowToast?: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
  analysisId?: string;
  onCloseAnalysis?: () => void;
}

const AnalysisResultsArea: React.FC<AnalysisResultsAreaProps> = ({
  isLoading,
  currentAnalysis,
  onSaveAnalysis,
  onShowToast,
  analysisId,
  onCloseAnalysis
}) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1 flex items-center justify-center h-[650px]">
          <CardContent className="text-center py-12">
            <FileSearch size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground font-normal">
              Enter content on the left to begin fact-checking with scientific sources.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1 flex items-center justify-center h-[650px]">
          <CardContent className="text-center py-12">
            <FileSearch size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground font-normal">
              Enter content on the left to begin fact-checking with scientific sources.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <AnalysisResult
          summary={currentAnalysis.summary}
          accuracy={currentAnalysis.accuracy as 'accurate' | 'partially-accurate' | 'inaccurate'}
          sources={currentAnalysis.sources || []}
          confidence={currentAnalysis.confidence}
          onSaveAnalysis={onSaveAnalysis}
          onShowToast={onShowToast}
          analysisId={analysisId}
          onCloseAnalysis={onCloseAnalysis}
        />
      </div>
    </div>
  );
};

export default AnalysisResultsArea;
