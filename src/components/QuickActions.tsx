import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Globe, Type, File } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (type: string) => void;
  onAnalyze: (content: string, type: string) => void;
  isLoading: boolean;
  onShowToast?: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
  onClearInputs?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onActionSelect,
  onAnalyze,
  isLoading,
  onShowToast,
  onClearInputs
}) => {
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (onClearInputs) {
      window.clearQuickActionsInputs = () => {
        setUrlInput('');
        setTextInput('');
        setPdfFile(null);
      };
    }
  }, [onClearInputs]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (content: string, type: string) => {
    if (!content.trim()) {
      onShowToast?.("Input Required", "Please enter content to analyze.", "destructive");
      return;
    }

    if (type === 'url' && !validateUrl(content)) {
      onShowToast?.("Invalid URL", "Please enter a valid URL.", "destructive");
      return;
    }

    onAnalyze(content, type);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      onShowToast?.("Invalid File Type", "Please upload a PDF file.", "destructive");
      event.target.value = '';
    }
  };

  const handlePdfAnalyze = () => {
    if (!pdfFile) {
      onShowToast?.("PDF Required", "Please select a PDF file to analyze.", "destructive");
      return;
    }

    console.log(`PDF file selected: ${pdfFile.name}. Asking AI to analyze based on name.`);
    handleSubmit(`Please find and analyze the scientific claims in the PDF document titled "${pdfFile.name}"`, 'pdf');
  };

  return (
    <div className="h-full">
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6 h-full flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <div className="w-full flex justify-center mb-6">
              <TabsList className="grid grid-cols-3 gap-2 w-fit max-w-[300px] h-14 bg-white/60 dark:bg-gray-800/60 p-1 shadow-inner border border-gray-200/50 dark:border-gray-700/50 rounded-lg">
                <TabsTrigger value="url" className="flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-200/50 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:scale-105">
                  <Globe size={16} className="text-slate-600" />
                  <span className="hidden sm:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-green-200/50 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:scale-105">
                  <Type size={16} className="text-green-600" />
                  <span className="hidden sm:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center gap-2.5 text-sm font-medium px-3 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-orange-200/50 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:scale-105">
                  <File size={16} className="text-orange-600" />
                  <span className="hidden sm:inline">PDF</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <TabsContent value="url" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex-shrink-0">
                    <Label htmlFor="url-input" className="text-base font-light flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                      <Globe size={16} className="text-slate-600" />
                      Website URL
                    </Label>
                    <Input
                      id="url-input"
                      placeholder="https://example.com"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="h-11 text-base border-2 border-gray-200/80 focus:border-slate-400 dark:border-gray-700/80 dark:focus:border-slate-500 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 font-light placeholder:font-light hover:border-slate-300 hover:shadow-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mt-auto pt-4 flex-shrink-0">
                    <Button 
                      onClick={() => handleSubmit(urlInput, 'url')}
                      disabled={!urlInput.trim() || isLoading}
                      className="w-full h-11 text-sm font-light bg-slate-700 hover:bg-slate-800 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Globe size={16} className="mr-2" />
                      {isLoading ? 'Analyzing URL...' : 'Analyze URL'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex-1 flex flex-col min-h-0">
                    <Label htmlFor="text-input" className="text-base font-light flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3 flex-shrink-0">
                      <Type size={16} className="text-green-600" />
                      Paste Text Content
                    </Label>
                    <Textarea
                      id="text-input"
                      placeholder="Paste the content you want to analyze..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="flex-1 min-h-[120px] text-base border-2 border-gray-200/80 focus:border-green-400 dark:border-gray-700/80 dark:focus:border-green-500 transition-all duration-200 resize-none bg-white/80 dark:bg-gray-800/80 font-light placeholder:font-light hover:border-green-300 hover:shadow-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mt-auto pt-4 flex-shrink-0">
                    <Button 
                      onClick={() => handleSubmit(textInput, 'text')}
                      disabled={!textInput.trim() || isLoading}
                      className="w-full h-11 text-sm font-light bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Type size={16} className="mr-2" />
                      {isLoading ? 'Analyzing Text...' : 'Analyze Text'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pdf" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex-shrink-0">
                    <Label htmlFor="pdf-input" className="text-base font-light flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3">
                      <File size={16} className="text-orange-600" />
                      Upload PDF Document
                    </Label>
                    <div className="h-11 border-2 border-gray-200/80 rounded-md bg-white/80 dark:bg-gray-800/80 dark:border-gray-700/80 flex items-center px-3 transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-sm">
                      <label htmlFor="pdf-input" className="flex items-center cursor-pointer w-full">
                        <span className="bg-orange-100/80 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200/80 dark:hover:bg-orange-800/40 px-3 py-1.5 rounded text-sm font-light border-0 flex-shrink-0 mr-3 transition-all duration-200 hover:scale-105">
                          Choose file
                        </span>
                        <span className={`text-base font-light flex-1 truncate ${pdfFile ? 'text-gray-900 dark:text-gray-100' : 'text-muted-foreground'}`}>
                          {pdfFile ? pdfFile.name : 'No file chosen'}
                        </span>
                      </label>
                      <input
                        id="pdf-input"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="sr-only"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex-shrink-0">
                    <Button 
                      onClick={handlePdfAnalyze}
                      disabled={!pdfFile || isLoading}
                      className="w-full h-11 text-sm font-light bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                      <File size={16} className="mr-2" />
                      {isLoading ? 'Analyzing PDF...' : 'Analyze PDF'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;
