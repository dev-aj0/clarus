
import React from 'react';
import { Bot, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';

interface Source {
  title: string;
  url: string;
  summary?: string;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    sources?: Source[];
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  return (
    <div
      className={`flex items-start space-x-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-primary-foreground" />
        </div>
      )}
      <div className="max-w-[80%] space-y-2">
        <div
          className={`rounded-lg ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground inline-block px-4 py-2 ml-auto'
              : 'bg-muted text-foreground w-full p-3'
          }`}
        >
          <p className={`whitespace-pre-wrap break-words ${
            message.role === 'assistant' ? 'font-normal' : ''
          }`}>
            {message.content}
          </p>
          <p className={`text-xs mt-2 ${
            message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
        
        {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-3">
            <h4 className="text-sm text-foreground mb-2">Sources:</h4>
            <TooltipProvider>
              <div className="space-y-2">
                {message.sources.map((source, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline text-sm block truncate"
                      >
                        {source.title}
                      </a>
                    </TooltipTrigger>
                    {source.summary && (
                      <TooltipContent>
                        <p className="max-w-xs">{source.summary}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}
      </div>
      {message.role === 'user' && (
        avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-muted"
          />
        ) : (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-muted-foreground" />
          </div>
        )
      )}
    </div>
  );
};

export default ChatMessage;
