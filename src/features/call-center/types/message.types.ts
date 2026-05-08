export type MessageSender = 'AGENT' | 'WORKSHOP';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName: string;
  body: string;
  timestamp: string; // ISO string
}
