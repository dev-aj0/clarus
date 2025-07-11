import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Upload, Link, Video } from 'lucide-react';

interface SourceInputProps {
  onAnalyze: (content: string, type: string) => void;
  isLoading: boolean;
  onShowToast?: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SourceInput: React.FC<SourceInputProps> = ({ 
  onAnalyze, 
  isLoading, 
  onShowToast,
  activeTab = 'url',
  onTabChange
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
    return youtubeRegex.test(url);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (content: string, type: string) => {
    if (!content.trim()) {
      onShowToast?.("Input Required", "Please enter content to analyze.", "destructive");
      return;
    }

    // Validate YouTube URLs
    if (type === 'youtube' && !validateYouTubeUrl(content)) {
      onShowToast?.("Invalid YouTube URL", "Please enter a valid YouTube video URL.", "destructive");
      return;
    }

    // Validate general URLs
    if (type === 'url' && !validateUrl(content)) {
      onShowToast?.("Invalid URL", "Please enter a valid URL.", "destructive");
      return;
    }

    try {
      console.log('=== SOURCEINDEX SUBMIT ===');
      console.log('Content:', content);
      console.log('Type:', type);
      
      // Pass the raw content to the parent component
      // The parent will handle calling the API and processing results
      onAnalyze(content, type);
      
      // Clear the input after successful submission
      if (type === 'url') setUrlInput('');
      if (type === 'text') setTextInput('');
      if (type === 'youtube') setYoutubeInput('');
      
    } catch (error) {
      console.error('SourceInput.tsx: Error in handleSubmit:', error);
      onShowToast?.("Submission Failed", error instanceof Error ? error.message : "Failed to submit content. Please try again.", "destructive");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.type === 'application/pdf') {
      console.log(`PDF file selected: ${file.name}. Asking AI to analyze based on name.`);
      // We cannot read PDF content on the client-side easily without a library.
      // This asks the AI to find and analyze the document by its name.
      handleSubmit(`Please find and analyze the scientific claims in the PDF document titled "${file.name}"`, 'pdf');
    } else {
      onShowToast?.("Invalid File Type", "Please upload a PDF file.", "destructive");
    }
  };

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="!font-bold">Analyze Content</CardTitle>
        <CardDescription className="font-light">
          Submit content from various sources for scientific accuracy analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="url" className="flex items-center gap-2 font-light">
              <Link size={16} />
              URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2 font-light">
              Text
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2 font-light">
              <Upload size={16} />
              PDF
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2 font-light">
              <Video size={16} />
              YouTube
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="url-input" className="font-light">Social Media or Web URL</Label>
              <Input
                id="url-input"
                placeholder="https://twitter.com/... or https://linkedin.com/..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={() => handleSubmit(urlInput, 'url')}
              disabled={!urlInput.trim() || isLoading}
              className="w-full font-light"
            >
              {isLoading ? 'Analyzing...' : 'Analyze URL'}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text-input" className="font-light">Paste Text Content</Label>
              <Textarea
                id="text-input"
                placeholder="Paste the content you want to analyze..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <Button 
              onClick={() => handleSubmit(textInput, 'text')}
              disabled={!textInput.trim() || isLoading}
              className="w-full font-light"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Text'}
            </Button>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-4">
            <div>
              <Label htmlFor="pdf-input" className="font-light">Upload PDF Document</Label>
              <Input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="mt-1 bg-gray-100 dark:bg-gray-700 file:bg-gray-200 dark:file:bg-gray-600 file:text-gray-700 dark:file:text-gray-200 file:border-0 file:rounded"
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-muted-foreground font-light">
              Upload a PDF document to extract and analyze its content
            </p>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            <div>
              <Label htmlFor="youtube-input" className="font-light">YouTube Video URL</Label>
              <Input
                id="youtube-input"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={() => handleSubmit(youtubeInput, 'youtube')}
              disabled={!youtubeInput.trim() || isLoading}
              className="w-full font-light"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Video'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SourceInput;
