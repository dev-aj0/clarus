import React from 'react';
import { useCenterBottomToast } from '@/hooks/useCenterBottomToast';
import CenterBottomToast from '@/components/CenterBottomToast';
import ChatSidebar from '@/components/ChatSidebar';
import ChatMessageList from '@/components/ChatMessageList';
import ChatInput from '@/components/ChatInput';
import { useChat } from '@/hooks/useChat';

const Chat = () => {
  const { toasts, removeToast, showError } = useCenterBottomToast();
  const {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    handleNewChat,
    handleSendMessage,
    handleDeleteSession,
    setActiveSessionId
  } = useChat({ showError });

  return (
    <>
      <main className="flex-1 overflow-hidden min-h-screen h-full">
        <div className="container-consistent h-full min-h-screen flex flex-col">
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Chat Assistant Analysis
            </h1>
            <p className="text-muted-foreground font-medium">
              Have conversations with AI to get insights and answers about scientific content
            </p>
          </div>

          <div className="flex-1 flex gap-6 overflow-hidden min-h-0 h-full">
            <div className="max-h-[650px] h-[650px]">
              <ChatSidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSessionSelect={setActiveSessionId}
                onNewChat={handleNewChat}
                onDeleteSession={handleDeleteSession}
              />
            </div>

            <main className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden min-h-0 h-full max-h-[650px]" style={{ maxHeight: '650px' }}>
              <div className="flex-1 overflow-y-auto">
                <ChatMessageList
                  messages={activeSession?.messages || []}
                  isLoading={isLoading}
                />
              </div>
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!activeSessionId}
              />
            </main>
          </div>
        </div>
      </main>
      <CenterBottomToast toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default Chat;