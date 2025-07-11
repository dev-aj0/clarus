
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, FileText } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface Analysis {
  id: string;
  title: string;
  summary: string;
  accuracy: string;
  confidence: number;
  created_at: string;
  updated_at: string;
  content_type: string;
  sources: any[];
}

interface AnalysisHistoryProps {
  analyses: Analysis[];
  loading: boolean;
  onBack: () => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses, loading, onBack }) => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Back to Library</span>
          </Button>
          <h1 className="text-3xl font-bold">Analysis History</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
          <p className="text-muted-foreground">
            Your analysis history will appear here as you use the tool.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{analysis.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getAccuracyColor(analysis.accuracy)}>
                        {analysis.accuracy}
                      </Badge>
                      <Badge variant="outline">
                        {analysis.confidence}% confidence
                      </Badge>
                      <Badge variant="secondary">
                        {analysis.content_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground ml-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{formatTimeAgo(analysis.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar size={12} />
                      <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {analysis.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {analysis.sources?.length || 0} sources analyzed
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
