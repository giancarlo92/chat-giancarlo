import type { FormEvent, RefObject, ChangeEvent } from 'react';
import type { ChatQA } from '../../data/chatData';

export interface ChatWindowProps {
  // Si se necesitan props para el componente principal
}

export interface ChatWindowLogicReturn {
  // Estado
  messages: ChatQA[];
  currentStep: number;
  userInput: string;
  isTypingQuestion: boolean;
  isTypingAnswer: boolean;
  userScrolled: boolean;
  
  // Referencias
  messagesEndRef: RefObject<HTMLDivElement>;
  chatMessagesRef: RefObject<HTMLDivElement>;
  
  // Handlers
  handleScroll: () => void;
  handleSubmit: (e: FormEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
