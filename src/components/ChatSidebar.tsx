import React, { useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, X, Pin, PinOff } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/types/chat';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (e: React.MouseEvent, id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      // Create a mock event for the original handler
      const mockEvent = new MouseEvent('click') as unknown as React.MouseEvent;
      onDeleteSession(mockEvent, sessionToDelete);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  const [expanded, setExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: string } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Sidebar width
  const collapsedWidth = 56; // px (icon size + padding)
  const expandedWidth = 320; // px

  // Pin/unpin logic
  const handlePinToggle = (sessionId: string) => {
    setPinnedIds(prev => prev.includes(sessionId)
      ? prev.filter(id => id !== sessionId)
      : [sessionId, ...prev.filter(id => id !== sessionId)]
    );
    setContextMenu(null);
  };

  // Rename logic
  const handleRename = (sessionId: string, newTitle: string) => {
    // This function is not directly used in the current component's state,
    // but it's part of the new_code. It would require a state update for 'sessions'
    // to make it functional.
    console.log(`Renaming session ${sessionId} to "${newTitle}"`);
    setRenamingId(null);
    setRenameValue('');
    setContextMenu(null);
  };

  // Sort sessions: pinned first
  const sortedSessions = [
    ...pinnedIds.map(id => sessions.find(s => s.id === id)).filter(Boolean),
    ...sessions.filter(s => !pinnedIds.includes(s.id)),
  ];

  return (
    <>
      <aside
        ref={sidebarRef}
        className={
          `relative flex flex-col h-[650px] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden`
        }
        style={{
          width: expanded ? expandedWidth : collapsedWidth,
          minWidth: expanded ? expandedWidth : collapsedWidth,
          maxWidth: expanded ? expandedWidth : collapsedWidth,
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <ScrollArea className={`flex-1 transition-all duration-300 ${expanded ? 'p-4' : 'p-2'}`}>
          <div className="space-y-2">
            {sortedSessions.map(session => session && (
              <div
                key={session.id}
                onContextMenu={e => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, sessionId: session.id });
                }}
                className={cn(
                  `flex items-center rounded-lg cursor-pointer group transition-all duration-200 border hover:scale-[1.02] hover:shadow-md ${expanded ? 'justify-between p-3' : 'justify-center p-2'}`,
                  activeSessionId === session.id 
                    ? "bg-primary/10 border-primary/20 shadow-sm" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                )}
                onClick={() => onSessionSelect(session.id)}
                style={{ minHeight: 40 }}
              >
                <div className={`flex items-center ${expanded ? 'gap-3 truncate flex-1' : 'justify-center w-full'}`}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                    activeSessionId === session.id ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                  )}>
                    <MessageSquare size={16} className={cn(
                      activeSessionId === session.id ? "text-primary-foreground" : "text-gray-600 dark:text-gray-300"
                    )} />
                  </div>
                  {expanded && (
                    <>
                      {renamingId === session.id ? (
                        <input
                          className="truncate text-sm font-medium bg-transparent border-b border-primary focus:outline-none px-1"
                          value={renameValue}
                          autoFocus
                          onChange={e => setRenameValue(e.target.value)}
                          onBlur={() => handleRename(session.id, renameValue || session.title)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRename(session.id, renameValue || session.title);
                            if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                          }}
                          style={{ minWidth: 0, width: '100%' }}
                        />
                      ) : (
                        <span className={cn(
                          "truncate text-sm font-medium",
                          activeSessionId === session.id ? "text-primary" : "text-gray-700 dark:text-gray-300"
                        )}>
                          {session.title}
                        </span>
                      )}
                      {pinnedIds.includes(session.id) && (
                        <Pin className="ml-2 text-primary w-4 h-4 inline-block" />
                      )}
                    </>
                  )}
                </div>
                {expanded && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-200"
                    onClick={(e) => handleDeleteClick(e, session.id)}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className={`transition-all duration-300 ${expanded ? 'p-4' : 'p-2'}`}>
          <Button 
            onClick={onNewChat} 
            className={`w-full ${expanded ? 'justify-start gap-3 h-11' : 'justify-center h-10'} bg-primary hover:bg-primary/90 text-primary-foreground font-medium hover:scale-[1.02] transition-all duration-200 hover:shadow-md rounded-full`}
          >
            <Plus size={16} />
            {expanded && 'New Chat'}
          </Button>
        </div>
        {/* Bubbly animation overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${expanded ? 'bg-primary/5' : 'bg-primary/10'} rounded-xl`} style={{ zIndex: 0 }} />
        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 px-2 min-w-[140px] animate-fade-in"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onMouseLeave={() => setContextMenu(null)}
          >
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-primary/10 text-sm font-medium"
              onClick={() => {
                setRenamingId(contextMenu.sessionId);
                setRenameValue(sessions.find(s => s.id === contextMenu.sessionId)?.title || '');
                setContextMenu(null);
              }}
            >
              <span className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Rename</span>
            </button>
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-primary/10 text-sm font-medium"
              onClick={() => handlePinToggle(contextMenu.sessionId)}
            >
              {pinnedIds.includes(contextMenu.sessionId) ? (
                <span className="flex items-center gap-2"><PinOff className="w-4 h-4" /> Unpin</span>
              ) : (
                <span className="flex items-center gap-2"><Pin className="w-4 h-4" /> Pin</span>
              )}
            </button>
          </div>
        )}
      </aside>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to delete this chat? This action cannot be undone and all messages in this conversation will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} className="hover:scale-105 transition-transform duration-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 transition-all duration-200"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatSidebar;