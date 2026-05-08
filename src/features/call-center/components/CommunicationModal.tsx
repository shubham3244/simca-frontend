import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Modal } from '../../../components/ui/Modal';
import { cn } from '../../../utils/cn';
import { formatChatTimestamp } from '../../../utils/format';
import { mockMessagesByControlNo } from '../data/mockMessages';
import type { ChatMessage } from '../types/message.types';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  controlNo: string | null;
  workshopName: string | null;
  currentAgentName?: string;
}

export function CommunicationModal({
  isOpen,
  onClose,
  controlNo,
  workshopName,
  currentAgentName = 'You',
}: CommunicationModalProps) {
  const initialMessages = useMemo(
    () => (controlNo ? mockMessagesByControlNo[controlNo] ?? [] : []),
    [controlNo],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const confirm = useConfirm();

  // Reset thread when claim changes (new claim opened)
  useEffect(() => {
    setMessages(initialMessages);
    setDraft('');
  }, [initialMessages]);

  // Auto-scroll to bottom whenever messages change or modal opens
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, messages.length]);

  const handleClose = async () => {
    if (draft.trim().length > 0) {
      const ok = await confirm({
        title: 'Discard unsent message?',
        message: "You haven't sent your message yet. Closing will discard it.",
        confirmLabel: 'Discard',
        cancelLabel: 'Keep writing',
        variant: 'destructive',
      });
      if (!ok) return;
    }
    setDraft('');
    onClose();
  };

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0;

  const handleSendMessage = () => {
    if (!canSend) return;
    const newMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: 'AGENT',
      senderName: currentAgentName,
      body: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');
    textareaRef.current?.focus();
  };

  const handleSendAlert = async () => {
    if (!controlNo) return;
    const ok = await confirm({
      title: 'Send high-priority alert?',
      message: (
        <>
          This will notify <strong>{workshopName ?? 'the workshop'}</strong> on{' '}
          claim <strong>{controlNo}</strong> via their priority channel. Use only
          when SLA is at risk.
        </>
      ),
      confirmLabel: 'Send Alert',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    // TODO: real backend would POST /alerts. Add a system message for visual feedback.
    const systemMessage: ChatMessage = {
      id: `local-alert-${Date.now()}`,
      sender: 'AGENT',
      senderName: currentAgentName,
      body: '⚠️ Alert sent to workshop — please respond ASAP.',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const title =
    controlNo && workshopName
      ? `Communication — ${controlNo} | ${workshopName}`
      : 'Communication';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="lg"
      closeOnBackdropClick={draft.trim().length === 0}
    >
      {/* Message list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-secondary px-5 py-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-12 text-center text-sm text-muted-foreground">
            Start the conversation. Your message will reach the workshop's portal.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </ul>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border bg-background p-4">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={2}
          className={cn(
            'w-full resize-none rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30',
          )}
          aria-label="Message"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendAlert}
            leftIcon={
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            }
          >
            Send Alert to Workshop
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Enter to send · Shift + Enter for newline
            </span>
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!canSend}
              leftIcon={
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              }
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.sender === 'AGENT';

  return (
    <li
      className={cn(
        'flex flex-col gap-1',
        isAgent ? 'items-end' : 'items-start',
      )}
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-foreground">
          {message.senderName}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
            isAgent
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {isAgent ? 'Agent' : 'Workshop'}
        </span>
      </div>

      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-2.5 text-sm',
          isAgent
            ? 'bg-primary text-primary-foreground'
            : 'bg-background text-foreground border border-border',
        )}
      >
        {message.body}
      </div>

      <time
        dateTime={message.timestamp}
        className="text-xs text-muted-foreground"
      >
        {formatChatTimestamp(message.timestamp)}
      </time>
    </li>
  );
}
