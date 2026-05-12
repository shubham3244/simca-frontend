import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { useConfirm } from '../../../components/ui/ConfirmDialog';
import { Modal } from '../../../components/ui/Modal';
import { cn } from '../../../utils/cn';
import { formatChatTimestamp } from '../../../utils/format';

type Sender = 'WORKSHOP' | 'CSR';

interface ChatMessage {
  id: string;
  sender: Sender;
  senderName: string;
  body: string;
  timestamp: string;
}

interface WorkshopChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderNo: string | null;
  carrier?: string | null;
  currentUserName?: string;
}

function seedMessages(workOrderNo: string): ChatMessage[] {
  return [
    {
      id: `${workOrderNo}-seed-1`,
      sender: 'CSR',
      senderName: 'Sarah (CSR)',
      body: 'Hi, please confirm if the recommended OEM windshield is in stock before scheduling.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];
}

export function WorkshopChatModal({
  isOpen,
  onClose,
  workOrderNo,
  carrier,
  currentUserName = 'You',
}: WorkshopChatModalProps) {
  const initialMessages = useMemo<ChatMessage[]>(
    () => (workOrderNo ? seedMessages(workOrderNo) : []),
    [workOrderNo],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const confirm = useConfirm();

  useEffect(() => {
    setMessages(initialMessages);
    setDraft('');
  }, [initialMessages]);

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

  const handleSend = () => {
    if (!canSend) return;
    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: 'WORKSHOP',
      senderName: currentUserName,
      body: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    setDraft('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const title =
    workOrderNo && carrier
      ? `Chat — ${workOrderNo} | ${carrier}`
      : workOrderNo
        ? `Chat — ${workOrderNo}`
        : 'Chat';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="lg"
      closeOnBackdropClick={draft.trim().length === 0}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-secondary px-5 py-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-12 text-center text-sm text-muted-foreground">
            No messages yet. Start a thread with the CSR team.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </ul>
        )}
      </div>

      <div className="shrink-0 border-t border-border bg-background p-4">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message the CSR team..."
          rows={2}
          className={cn(
            'w-full resize-none rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30',
          )}
          aria-label="Message"
        />
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <span className="mr-auto text-xs text-muted-foreground">
            Enter to send · Shift + Enter for newline
          </span>
          <Button size="sm" onClick={handleSend} disabled={!canSend}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const isOwn = message.sender === 'WORKSHOP';
  return (
    <li className={cn('flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}>
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-foreground">
          {message.senderName}
        </span>
        <span
          className={cn(
            'rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
            isOwn
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {isOwn ? 'Shop' : 'CSR'}
        </span>
      </div>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-2.5 text-sm shadow-sm',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-background text-foreground',
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
