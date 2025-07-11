
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  authors: string;
  journal: string;
  summary: string;
  evidence: string;
}

interface AnalysisResult {
  summary: string;
  accuracy: 'accurate' | 'partially-accurate' | 'inaccurate';
  confidence: number;
  sources: Source[];
}

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  const getAccuracyIcon = (accuracy: string) => {
    switch (accuracy) {
      case 'accurate':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'partially-accurate':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'inaccurate':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'accurate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'partially-accurate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inaccurate':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getAccuracyIcon(result.accuracy)}
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getAccuracyColor(result.accuracy)}>
              {result.accuracy.replace('-', ' ')}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Confidence: {result.confidence}%
            </span>
          </div>
          <p className="text-foreground leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Sources */}
      {result.sources && result.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Research Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.sources.map((source, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-foreground leading-tight">
                      {source.title}
                    </h4>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Authors:</strong> {source.authors}</p>
                    <p><strong>Publication:</strong> {source.journal}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-sm font-medium text-foreground">Study Summary:</h5>
                      <p className="text-sm text-muted-foreground">{source.summary}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-foreground">Relevance to Claims:</h5>
                      <p className="text-sm text-muted-foreground">{source.evidence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisDisplay;
