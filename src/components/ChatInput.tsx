import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Select a chat to start messaging..." : "Type your message here..."}
            disabled={isLoading || disabled}
            className="min-h-[44px] max-h-[200px] text-base font-normal placeholder:font-normal pr-14 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20 resize-none overflow-y-auto hover:border-primary/50 transition-colors duration-200"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || disabled}
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-200"
          >
            <Send size={16} />
          </Button>
        </div>
        {disabled && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Create a new chat or select an existing one to start messaging
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInput;