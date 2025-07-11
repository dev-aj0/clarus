
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, ExternalLink, FileText } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface Analysis {
  id: string;
  title: string;
  sources: any[];
  created_at: string;
}

interface ResearchPapersProps {
  analyses: Analysis[];
  loading: boolean;
  onBack: () => void;
}

const ResearchPapers: React.FC<ResearchPapersProps> = ({ analyses, loading, onBack }) => {
  // Extract unique sources from all analyses
  const allSources = analyses.flatMap(analysis => 
    analysis.sources?.filter(source => source.journal || source.authors) || []
  );

  // Remove duplicates based on URL or title
  const uniqueSources = allSources.filter((source, index, self) => 
    index === self.findIndex(s => s.url === source.url || s.title === source.title)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 font-extralight">
            <ArrowLeft size={16} />
            <span>Back to Library</span>
          </Button>
          <h1 className="text-3xl font-light">Research Papers</h1>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground font-extralight">Loading your research papers...</p>
        </div>
      ) : uniqueSources.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-light mb-2">No Research Papers</h3>
          <p className="text-muted-foreground font-extralight">
            Research papers from your analyses will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueSources.map((source, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 font-light">{source.title}</CardTitle>
                {source.authors && (
                  <p className="text-sm text-muted-foreground font-extralight">{source.authors}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {source.journal && (
                  <Badge variant="outline" className="w-fit font-extralight">
                    {source.journal}
                  </Badge>
                )}
                {source.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-3 font-extralight">
                    {source.summary}
                  </p>
                )}
                {source.url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full font-extralight"
                    onClick={() => window.open(source.url, '_blank')}
                  >
                    <ExternalLink size={14} className="mr-2" />
                    View Paper
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchPapers;
