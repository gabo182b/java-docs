export interface CodeBlockProps {
  code: string;
  language?: string
}

interface ChatMessage {
  id: string,
  role: 'user' | 'assistant' | 'system';
  content: string
}

 export interface MessageBubbleProps {
  message: ChatMessage;
}