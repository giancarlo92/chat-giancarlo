import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { chatData, TYPING_DELAY, type ChatQA } from '../../data/chatData';
import type { ChatWindowProps, ChatWindowLogicReturn, ChatMessage } from './ChatWindowTypes';

// Función auxiliar para generar IDs únicos
const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

export function useChatWindow(_props: ChatWindowProps): ChatWindowLogicReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isTypingQuestion, setIsTypingQuestion] = useState(false);
  const [isTypingAnswer, setIsTypingAnswer] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
  const [visibleIcons, setVisibleIcons] = useState<number[]>([]);
  const [allExpanded, setAllExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const processing = useRef(false);
  const messageRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Función para desplazarse al final del chat
  const scrollToBottom = () => {
    if (!userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para desplazarse a un mensaje específico
  const scrollToMessage = (id: string) => {
    if (messageRefs.current && messageRefs.current[id]) {
      messageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveQuestionId(id);
    }
  };

  // Función para navegar a una pregunta específica
  const navigateToQuestion = (question: string) => {
    const messageWithQuestion = messages.find(msg => msg.question === question);
    
    if (messageWithQuestion) {
      // Si la pregunta ya está en los mensajes, desplazarse a ella
      scrollToMessage(messageWithQuestion.id);
      
      // Si la sección está colapsada, expandirla, pero no colapsarla si ya está expandida
      if (!messageWithQuestion.isExpanded) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === messageWithQuestion.id 
              ? { ...msg, isExpanded: true } 
              : msg
          )
        );
      }
    } else {
      // Si la pregunta no está en los mensajes, procesar hasta esa pregunta
      const questionIndex = chatData.findIndex(item => item.question === question);
      
      if (questionIndex !== -1 && questionIndex >= currentStep) {
        // Si la pregunta está adelante en la conversación, avanzar hasta ella
        processAllStepsUntil(questionIndex);
      }
    }
  };

  // Función para procesar todos los pasos hasta un índice específico
  const processAllStepsUntil = async (targetIndex: number) => {
    if (processing.current || targetIndex < currentStep) return;
    
    processing.current = true;
    
    for (let i = currentStep; i <= targetIndex; i++) {
      const messageId = await processStepInternal(i);
      
      // Esperar un poco para que se muestre la respuesta
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Añadir el índice actual a los iconos visibles SOLO después de mostrar la respuesta
      if (messageId) {
        setVisibleIcons(prev => {
          if (!prev.includes(i)) {
            return [...prev, i];
          }
          return prev;
        });
      }
    }
    
    setCurrentStep(targetIndex + 1);
    processing.current = false;
  };

  // Función interna para procesar un paso específico
  const processStepInternal = async (stepIndex: number) => {
    const currentQA = chatData[stepIndex];
    const messageId = `message-${stepIndex}`;
    
    // 1. Mostrar la pregunta inmediatamente (sin indicador de escritura para avance rápido)
    setMessages(prev => [...prev, { 
      id: messageId,
      question: currentQA.question,
      isExpanded: true,
      color: currentQA.color
    }]);
    
    // 2. Si hay respuesta, mostrarla inmediatamente
    if (currentQA.answer) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Pequeña pausa entre pregunta y respuesta
      
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { 
          ...newMessages[lastIndex], 
          answer: currentQA.answer 
        };
        return newMessages;
      });
    }
    
    return messageId;
  };

  // Función para alternar la expansión de mensajes
  const toggleMessageExpansion = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
    
    // Pequeña pausa para permitir que la animación termine antes de hacer scroll
    setTimeout(() => {
      if (messageRefs.current && messageRefs.current[id]) {
        messageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Función para colapsar o expandir todas las secciones
  const toggleAllMessages = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    setMessages(prev => 
      prev.map(msg => ({ ...msg, isExpanded: newExpandedState }))
    );
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
    const messageId = `message-${currentStep}`;
    
    // 1. Mostrar indicador de escritura para la pregunta
    setIsTypingQuestion(true);
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    
    // 2. Mostrar la pregunta y ocultar el indicador
    setMessages(prev => [...prev, { 
      id: messageId,
      question: currentQA.question,
      isExpanded: true,
      color: currentQA.color
    }]);
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
        newMessages[lastIndex] = { 
          ...newMessages[lastIndex], 
          answer: currentQA.answer 
        };
        return newMessages;
      });
      setIsTypingAnswer(false);
      
      // Añadir el índice actual a los iconos visibles SOLO después de mostrar la respuesta
      setVisibleIcons(prev => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
      
      // Resetear el flag de scroll del usuario para asegurar que vea la respuesta
      setUserScrolled(false);
    }
    
    setCurrentStep(prev => prev + 1);
    processing.current = false;
    
    // Verificar si hemos completado todas las preguntas
    if (currentStep + 1 >= chatData.length) {
      setAllQuestionsCompleted(true);
    } else {
      // Continuar automáticamente con el siguiente paso después de un breve retraso
      setTimeout(() => {
        if (!processing.current) {
          setCurrentStep(prev => prev + 1);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (currentStep < chatData.length && !processing.current) {
      processStep();
    }
  }, [currentStep]);

  useEffect(() => scrollToBottom(), [messages, isTypingQuestion, isTypingAnswer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTypingQuestion || isTypingAnswer || allQuestionsCompleted) return;

    const messageId = generateId();
    
    // Agregar pregunta del usuario
    setMessages(prev => [...prev, { 
      id: messageId,
      question: userInput,
      isExpanded: true
    }]);
    
    // Resetear el flag de scroll del usuario para asegurar que vea la respuesta
    setUserScrolled(false);
    
    // Simular respuesta después de un breve retraso
    setIsTypingAnswer(true);
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { 
          ...newMessages[lastIndex], 
          answer: "Gracias por tu pregunta. Por favor, consulta las preguntas y respuestas anteriores o reformula tu pregunta para obtener más información."
        };
        return newMessages;
      });
      setIsTypingAnswer(false);
      setUserScrolled(false);
    }, TYPING_DELAY);
    
    // Limpiar el input
    setUserInput('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return {
    messages,
    userInput,
    isTypingQuestion,
    isTypingAnswer,
    messagesEndRef,
    messageRefs,
    chatMessagesRef,
    handleSubmit,
    handleInputChange,
    handleScroll,
    toggleMessageExpansion,
    toggleAllMessages,
    navigateToQuestion,
    chatData,
    activeQuestionId,
    allQuestionsCompleted,
    visibleIcons,
    allExpanded
  };
}
