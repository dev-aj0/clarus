
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('perplexity_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-white shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="text-primary-500" size={20} />
        <h2 className="text-xl text-gray-900">API Configuration</h2>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">
        Enter your Perplexity API key to enable content analysis. Your key is stored locally and never shared.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="api-key">Perplexity API Key</Label>
          <div className="relative mt-1">
            <Input
              id="api-key"
              type={showApiKey ? 'text' : 'password'}
              placeholder="pplx-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={!apiKey.trim()}
          className="w-full bg-primary-500 hover:bg-primary-600"
        >
          Save API Key
        </Button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          Don't have an API key? Get one from{' '}
          <a 
            href="https://www.perplexity.ai/settings/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Perplexity AI
          </a>
        </p>
      </div>
    </Card>
  );
};

export default ApiKeyInput;
