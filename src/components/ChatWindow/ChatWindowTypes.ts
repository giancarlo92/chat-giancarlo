import type { FormEvent, RefObject, ChangeEvent } from 'react';
import type { ChatQA } from '../../data/chatData';

export interface ChatWindowProps {
  // Si se necesitan props para el componente principal
}

export interface ChatMessage extends ChatQA {
  id: string;
  isExpanded: boolean;
}

export interface ChatWindowLogicReturn {
  // Estado
  messages: ChatMessage[];
  userInput: string;
  isTypingQuestion: boolean;
  isTypingAnswer: boolean;
  chatData: ChatQA[];
  activeQuestionId: string | null;
  allQuestionsCompleted: boolean;
  visibleIcons: number[];
  allExpanded: boolean;
  
  // Referencias
  messagesEndRef: RefObject<HTMLDivElement>;
  chatMessagesRef: RefObject<HTMLDivElement>;
  messageRefs: RefObject<{[key: string]: HTMLDivElement | null}>;
  
  // Handlers
  handleScroll: () => void;
  handleSubmit: (e: FormEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleMessageExpansion: (id: string) => void;
  toggleAllMessages: () => void;
  navigateToQuestion: (question: string) => void;
}
