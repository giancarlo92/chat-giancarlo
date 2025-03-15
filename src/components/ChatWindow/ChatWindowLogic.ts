import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { chatData, TYPING_DELAY, type ChatQA } from '../../data/chatData';
import type { ChatWindowProps, ChatWindowLogicReturn } from './ChatWindowTypes';

export function useChatWindow(_props: ChatWindowProps): ChatWindowLogicReturn {
  const [messages, setMessages] = useState<ChatQA[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isTypingQuestion, setIsTypingQuestion] = useState(false);
  const [isTypingAnswer, setIsTypingAnswer] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const processing = useRef(false);

  const scrollToBottom = () => {
    if (!userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Detectar cuando el usuario scrollea manualmente
  const handleScroll = () => {
    if (!chatMessagesRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 10;
    
    // Si está cerca del final, consideramos que no ha scrolleado manualmente
    if (isScrolledToBottom) {
      setUserScrolled(false);
    } else {
      // Si no está en el fondo, el usuario ha scrolleado manualmente
      setUserScrolled(true);
    }
  };

  const processStep = async () => {
    if (processing.current || currentStep >= chatData.length) return;
    
    processing.current = true;
    const currentQA = chatData[currentStep];
    
    // 1. Mostrar indicador de escritura para la pregunta
    setIsTypingQuestion(true);
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    
    // 2. Mostrar la pregunta y ocultar el indicador
    setMessages(prev => [...prev, { question: currentQA.question }]);
    setIsTypingQuestion(false);
    
    // Resetear el flag de scroll del usuario para asegurar que vea la respuesta
    setUserScrolled(false);
    
    // 3. Si hay respuesta, mostrar indicador para la respuesta
    if (currentQA.answer) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Pequeña pausa entre pregunta y respuesta
      
      setIsTypingAnswer(true);
      await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
      
      // 4. Mostrar la respuesta y ocultar el indicador
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { ...newMessages[lastIndex], answer: currentQA.answer };
        return newMessages;
      });
      setIsTypingAnswer(false);
      
      // Resetear el flag de scroll del usuario para asegurar que vea la respuesta
      setUserScrolled(false);
    }
    
    setCurrentStep(prev => prev + 1);
    processing.current = false;
  };

  useEffect(() => {
    if (currentStep < chatData.length) {
      processStep();
    }
  }, [currentStep]);

  useEffect(() => scrollToBottom(), [messages, isTypingQuestion, isTypingAnswer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTypingQuestion || isTypingAnswer) return;

    const matchingQA = chatData.find(qa => 
      userInput.toLowerCase().includes(qa.question.toLowerCase())
    );

    // Agregar pregunta del usuario
    setMessages(prev => [...prev, { question: userInput }]);
    
    // Resetear el flag de scroll del usuario para asegurar que vea la respuesta
    setUserScrolled(false);
    
    // Mostrar respuesta si existe
    if (matchingQA?.answer) {
      setIsTypingAnswer(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { question: userInput, answer: matchingQA.answer }]);
        setIsTypingAnswer(false);
      }, TYPING_DELAY);
    }
    
    setUserInput('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return {
    // Estado
    messages,
    currentStep,
    userInput,
    isTypingQuestion,
    isTypingAnswer,
    userScrolled,
    
    // Referencias
    messagesEndRef,
    chatMessagesRef,
    
    // Handlers
    handleScroll,
    handleSubmit,
    handleInputChange
  };
}
