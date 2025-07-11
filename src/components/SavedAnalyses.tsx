import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, FileText, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import TopBar from './TopBar';

interface Analysis {
  id: string;
  title: string;
  summary: string;
  accuracy: string;
  confidence: number;
  created_at: string;
  content_type: string;
  category?: string;
  content?: string;
  analysis_data?: any;
}

interface SavedAnalysesProps {
  analyses: Analysis[];
  loading: boolean;
  onBack: () => void;
}

const SavedAnalyses: React.FC<SavedAnalysesProps> = ({ analyses, loading, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const queryClient = useQueryClient();

  const categories = ['All', 'Health', 'Technology', 'Science', 'News', 'General'];

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           (analysis.category || 'general').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'health':
        return 'bg-red-100 text-red-800';
      case 'technology':
        return 'bg-blue-100 text-blue-800';
      case 'science':
        return 'bg-green-100 text-green-800';
      case 'news':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteAnalysis = (analysisId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    if (confirm('Are you sure you want to delete this analysis?')) {
      // This part would typically involve an API call to delete the analysis
      // For now, we'll just invalidate the query to refetch without the deleted item
      queryClient.invalidateQueries({ queryKey: ['analyses', userId] });
      toast({
        title: "Analysis Deleted",
        description: "The analysis has been removed from your library.",
      });
    }
  };

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedAnalysis(null)} className="flex items-center space-x-2 mb-4">
              <ArrowLeft size={16} />
              <span>Back to Analyses</span>
            </Button>
            
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{selectedAnalysis.title}</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleDeleteAnalysis(selectedAnalysis.id, e)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getCategoryColor(selectedAnalysis.category || 'general')}>
                {(selectedAnalysis.category || 'general').charAt(0).toUpperCase() + (selectedAnalysis.category || 'general').slice(1)}
              </Badge>
              <Badge className={getAccuracyColor(selectedAnalysis.accuracy)}>
                {selectedAnalysis.accuracy}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(selectedAnalysis.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Original Content</h3>
              <p className="text-gray-700 leading-relaxed">{selectedAnalysis.content}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Analysis Summary</h3>
              <p className="text-gray-700 leading-relaxed">{selectedAnalysis.summary}</p>
            </div>

            {selectedAnalysis.analysis_data?.sources && selectedAnalysis.analysis_data.sources.length > 0 && (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Sources</h3>
                <div className="space-y-4">
                  {selectedAnalysis.analysis_data.sources.map((source: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-600">{source.title}</h4>
                      {source.authors && <p className="text-sm text-gray-600">Authors: {source.authors}</p>}
                      {source.journal && <p className="text-sm text-gray-600">Journal: {source.journal}</p>}
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        View Source
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">My Analyses</h1>
          <p className="text-muted-foreground">Review and manage your saved analyses.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Analyses List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory === 'All' ? 'All Analyses' : `${selectedCategory} Analyses`}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredAnalyses.length} results)
            </span>
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading your saved analyses...</p>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analyses Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Your analyzed content will appear here once you start using the analysis tool.'
                }
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => (
                    <TableRow 
                      key={analysis.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <TableCell>
                        <div className="font-medium">{analysis.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {analysis.summary}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(analysis.category || 'general')}>
                          {(analysis.category || 'general').charAt(0).toUpperCase() + (analysis.category || 'general').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getAccuracyColor(analysis.accuracy)}>
                          {analysis.accuracy}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleDeleteAnalysis(analysis.id, e)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAnalyses;
