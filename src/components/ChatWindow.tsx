import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatData, TYPING_DELAY, type ChatQA } from '../data/chatData';
import TypingIndicator from './TypingIndicator';
import '../styles/chatStyles.css';

export default function ChatWindow() {
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

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="text-xl font-semibold text-white">Conversación con Giancarlo</h2>
      </div>

      <div 
        className="chat-messages" 
        ref={chatMessagesRef}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {/* Pregunta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="user-message"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.question}
                </ReactMarkdown>
              </motion.div>

              {/* Respuesta */}
              {message.answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bot-message ml-auto"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.answer}
                  </ReactMarkdown>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* Indicadores de typing */}
        {/* Typing para preguntas (izquierda) */}
        {isTypingQuestion && <TypingIndicator isBot={false} />}
        
        {/* Typing para respuestas (derecha) */}
        {isTypingAnswer && <TypingIndicator isBot={true} />}
        
        <div ref={messagesEndRef} />
      </div>

      {currentStep >= chatData.length && (
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="p-4 border-t bg-white"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Hazme una pregunta..."
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isTypingQuestion || isTypingAnswer}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90"
              disabled={isTypingQuestion || isTypingAnswer}
            >
              Enviar
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}