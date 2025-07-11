
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from '@/components/ChatMessage';
import { Bot } from 'lucide-react';
import { Message } from '@/types/chat';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll to bottom when new messages are added, not on initial load
  useEffect(() => {
    const currentMessageCount = messages.length;
    const prevMessageCount = prevMessageCountRef.current;
    
    // Only scroll if messages were actually added (not on initial load or session switch)
    if (currentMessageCount > prevMessageCount && prevMessageCount > 0) {
      scrollToBottom();
    }
    
    prevMessageCountRef.current = currentMessageCount;
  }, [messages]);

  return (
    <ScrollArea className="flex-1 flex flex-col h-full min-h-0 p-6" ref={scrollAreaRef}>
      <div className="flex-1 flex flex-col w-full h-full min-h-0 mb-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start justify-start h-full py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Bot size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Start a conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Ask me anything about scientific research, analysis, or get help understanding complex topics.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary flex-shrink-0">
                  <Bot size={18} className="text-primary-foreground" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
