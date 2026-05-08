import type { ChatMessage } from '../types/message.types';

const SARAH = 'Sarah Johnson';

export const mockMessagesByControlNo: Record<string, ChatMessage[]> = {
  'WC-2024-001': [
    {
      id: 'm1',
      sender: 'WORKSHOP',
      senderName: 'AutoGlass Pro',
      body: 'Parts have been ordered for this claim. Expected delivery by end of day tomorrow.',
      timestamp: '2024-03-24T10:30:00',
    },
    {
      id: 'm2',
      sender: 'AGENT',
      senderName: SARAH,
      body: 'Thank you for the update. Please notify the customer once parts arrive.',
      timestamp: '2024-03-24T10:45:00',
    },
    {
      id: 'm3',
      sender: 'WORKSHOP',
      senderName: 'AutoGlass Pro',
      body: "Will do. We'll schedule the installation immediately after parts arrive.",
      timestamp: '2024-03-24T11:00:00',
    },
  ],
};
