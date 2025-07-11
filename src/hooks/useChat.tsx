import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatSession, Message } from '@/types/chat';
import { chatWithAI } from '@/utils/perplexityApi';

export const useChat = ({ showError }: { showError: (title: string, description?: string) => void }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNewChat = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: '1',
          content: "Hello! I'm your AI assistant for scientific content analysis. I can help you understand research findings, explain complex concepts, and answer questions. Ask me anything!",
          role: 'assistant',
          timestamp: new Date()
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);
  
  useEffect(() => {
    const newChatParam = searchParams.get('new');

    if (newChatParam === 'true') {
      handleNewChat();
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('new');
      setSearchParams(newSearchParams, { replace: true });
    } else {
      try {
        const storedSessions = localStorage.getItem('clarusChatSessions');
        if (storedSessions) {
          const parsedSessions: ChatSession[] = JSON.parse(storedSessions).map((s: any) => ({
            ...s,
            messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
          }));
          if (parsedSessions.length > 0) {
            setSessions(parsedSessions);
            const activeId = localStorage.getItem('clarusActiveChatId');
            if (activeId && parsedSessions.some(s => s.id === activeId)) {
              setActiveSessionId(activeId);
            } else {
              setActiveSessionId(parsedSessions[0].id);
            }
          } else {
            handleNewChat();
          }
        } else {
          handleNewChat();
        }
      } catch (error) {
        console.error("Failed to parse chat sessions from localStorage", error);
        handleNewChat();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('clarusChatSessions', JSON.stringify(sessions));
    }
    if (activeSessionId) {
      localStorage.setItem('clarusActiveChatId', activeSessionId);
    }
  }, [sessions, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || !activeSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          const newTitle = session.title === 'New Chat' 
            ? messageContent.substring(0, 35) + (messageContent.length > 35 ? '...' : '') 
            : session.title;
          return { ...session, title: newTitle, messages: [...session.messages, userMessage] };
        }
        return session;
      })
    );
    setIsLoading(true);

    try {
      const aiResponseString = await chatWithAI(messageContent);
      const aiResponseData = JSON.parse(aiResponseString);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseData.message,
        role: 'assistant',
        timestamp: new Date(),
        sources: aiResponseData.sources
      };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: [...s.messages, aiMessage]} : s));
    } catch (error) {
      showError("Error", error instanceof Error ? error.message : "Failed to get response from AI. Please try again.");
      const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I encountered an error while trying to respond. Please try again.",
          role: 'assistant',
          timestamp: new Date()
      };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: [...s.messages, errorMessage]} : s));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(newSessions);

    if (activeSessionId === sessionId) {
      if (newSessions.length > 0) {
        setActiveSessionId(newSessions[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    handleNewChat,
    handleSendMessage,
    handleDeleteSession,
    setActiveSessionId
  };
};
