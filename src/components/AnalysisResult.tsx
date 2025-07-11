import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, XCircle, ExternalLink, BookmarkPlus, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Source {
  title: string;
  url: string;
  authors?: string;
  journal?: string;
  summary?: string;
  evidence?: string;
}

interface AnalysisResultProps {
  summary: string;
  accuracy: 'accurate' | 'partially-accurate' | 'inaccurate';
  sources: Source[];
  confidence: number;
  onSaveAnalysis?: () => void;
  onShowToast?: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
  analysisId?: string;
  onCloseAnalysis?: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  summary, 
  accuracy, 
  sources, 
  confidence,
  onSaveAnalysis,
  onShowToast,
  analysisId,
  onCloseAnalysis
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if this analysis is already saved on component mount
  useEffect(() => {
    if (analysisId) {
      const savedAnalyses = JSON.parse(localStorage.getItem(`savedAnalysisIds_${userId}`) || '[]');
      setIsSaved(savedAnalyses.includes(analysisId));
    }
  }, [analysisId, userId]);

  // Only force 'partially-accurate' if confidence is <= 10 or sources are empty
  const isLowConfidence = confidence <= 10 || !sources || sources.length === 0;
  const forcedAccuracy = isLowConfidence ? 'partially-accurate' : accuracy;
  const config = (() => {
    if (forcedAccuracy === 'accurate') {
      return {
        icon: <CheckCircle2 className="text-green-600" size={20} />,
        badge: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400',
        label: 'Scientifically Verified',
        description: 'We are ' + confidence + '% confident this is supported by credible research.',
        color: 'green'
      };
    } else if (forcedAccuracy === 'partially-accurate') {
      return {
        icon: <AlertTriangle className="text-yellow-600" size={20} />,
        badge: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400',
        label: 'Partially Verified',
        description: 'Some claims lack sufficient evidence. Confidence: ' + confidence + '%.',
        color: 'yellow'
      };
    } else {
      return {
        icon: <XCircle className="text-red-600" size={20} />,
        badge: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400',
        label: 'Not Verified',
        description: 'We are ' + confidence + '% confident this is not supported by science.',
        color: 'red'
      };
    }
  })();

  // Parse summary if it's a JSON string
  let displaySummary = summary;
  if (typeof displaySummary === 'string' && displaySummary.trim().startsWith('{') && displaySummary.includes('"summary"')) {
    try {
      const summaryObj = JSON.parse(displaySummary);
      if (summaryObj.summary) displaySummary = summaryObj.summary;
    } catch {}
  }
  const cleanSummary = (text: string) => {
    return text
      .replace(/\[[\d,\s-]+\]/g, '')
      .replace(/\(.*?\.(?:com|org|edu|net|gov).*?\)/g, '')
      .replace(/https?:\/\/[^\s)]+/g, '')
      .replace(/According to.*?research[,.]?/gi, '')
      .replace(/Studies show.*?that/gi, 'Research indicates that')
      .replace(/Multiple studies.*?indicate/gi, 'Research indicates')
      .replace(/\s+/g, ' ')
      .trim();
  };
  const processedSummary = cleanSummary(displaySummary);

  // Improved summary formatting: preserve line breaks and bullets
  const formatSummary = (text: string) => {
    // Split by newlines for bullets, otherwise by sentences
    if (text.includes('\n')) {
      const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
      return (
        <div className="space-y-2">
          {lines.map((line, idx) =>
            line.startsWith('•') ? (
              <div key={idx} className="ml-4 list-disc list-inside text-foreground leading-relaxed font-normal">{line}</div>
            ) : (
              <p key={idx} className="text-foreground leading-relaxed font-normal">{line}</p>
            )
          )}
        </div>
      );
    }
    // Fallback to sentence split
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) {
      return <p className="text-foreground leading-relaxed font-normal">{text}</p>;
    }
    const introSentences = sentences.slice(0, 2).join('. ') + '.';
    const bulletPoints = sentences.slice(2);
    return (
      <div className="space-y-3">
        <p className="text-foreground leading-relaxed font-normal">{introSentences}</p>
        {bulletPoints.length > 0 && (
          <ul className="list-disc list-inside space-y-1 ml-4">
            {bulletPoints.map((point, index) => (
              <li key={index} className="text-foreground leading-relaxed font-normal">
                {point.trim()}.
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleSaveAnalysis = async () => {
    if (!onSaveAnalysis || isSaved) return;
    
    setIsSaving(true);
    try {
      await onSaveAnalysis();
      setIsSaved(true);
      
      // Update localStorage to track this analysis as saved
      if (analysisId) {
        const key = `savedAnalysisIds_${userId}`;
        const savedAnalyses = JSON.parse(localStorage.getItem(key) || '[]');
        if (!savedAnalyses.includes(analysisId)) {
          savedAnalyses.push(analysisId);
          localStorage.setItem(key, JSON.stringify(savedAnalyses));
        }
      }
      
      onShowToast?.("Analysis Saved", "Verification report saved to your library.");
    } catch (error) {
      onShowToast?.("Save Failed", "Failed to save the analysis. Please try again.", "destructive");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Verification Status Header */}
      <Card className="bg-blue-50/30 dark:bg-blue-950/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-semibold">Information Verification</h2>
                <p className="text-sm text-muted-foreground">Scientific accuracy assessment</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onSaveAnalysis && (
                <Button
                  onClick={handleSaveAnalysis}
                  disabled={isSaving || isSaved}
                  variant={isSaved ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:shadow-md ${isSaved ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <BookmarkPlus size={16} />
                  {isSaved ? 'Saved' : 'Save Report'}
                </Button>
              )}
              {onCloseAnalysis && (
                <Button
                  onClick={onCloseAnalysis}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 hover:scale-110 transition-transform duration-200"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {config.icon}
              <div>
                <Badge className={`${config.badge} font-medium hover:scale-105 transition-transform duration-200`}>
                  {config.label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1 font-normal">
                  {config.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{confidence}%</div>
              <div className="text-sm text-muted-foreground">Confidence</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                config.color === 'green' ? 'bg-green-500' :
                config.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessment Summary */}
      <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Fact-Check Summary
          </h3>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {formatSummary(processedSummary)}
          </div>
        </CardContent>
      </Card>

      {/* Research Evidence */}
      <Card className="shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Scientific Evidence</h3>
            <Badge variant="secondary" className="text-sm hover:scale-105 transition-transform duration-200">
              {sources.length} Sources
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Peer-reviewed research supporting this assessment
          </p>
        </CardHeader>
        <CardContent>
          {sources.length > 0 ? (
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">
                        {source.title}
                      </h4>
                      {source.authors && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {source.authors}
                        </p>
                      )}
                      {source.journal && (
                        <p className="text-sm text-muted-foreground font-medium">
                          {source.journal}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="hover:scale-110 transition-all duration-200 hover:shadow-md"
                      >
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  {(source.summary || source.evidence) && (
                    <>
                      <Separator className="my-3" />
                      {source.summary && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Research Summary:</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {source.summary}
                          </p>
                        </div>
                      )}
                      {source.evidence && (
                        <div>
                          <h5 className="text-sm font-medium mb-1">Relevance:</h5>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {source.evidence}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-normal">No research sources found for this content</p>
              <p className="text-sm font-normal">This may indicate limited scientific coverage of the topic</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResult;