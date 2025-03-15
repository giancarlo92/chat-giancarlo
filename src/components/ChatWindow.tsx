import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatData, TYPING_DELAY, type ChatQA } from '../data/chatData';

// Extraer preguntas del chatData
const questions = chatData.map(item => item.question);

type Message = ChatQA & {
  isProcessingQuestion?: boolean;
  isProcessingAnswer?: boolean;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQA, setCurrentQA] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processQA = async (index: number) => {
    if (index >= chatData.length) return;
    
    const qa = chatData[index];
    
    // Paso 1: Mostrar indicador de escritura para pregunta
    setMessages(prev => [...prev, {
      question: qa.question,
      isProcessingQuestion: true
    }]);
    setIsProcessing(true);

    // Paso 2: Mostrar pregunta después del delay
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    setMessages(prev => prev.map((msg, i) => 
      i === prev.length - 1 ? { ...msg, isProcessingQuestion: false } : msg
    ));

    // Paso 3: Mostrar indicador de escritura para respuesta
    setMessages(prev => [...prev, {
      question: qa.question,
      answer: qa.answer,
      isProcessingAnswer: true
    }]);
    
    // Paso 4: Mostrar respuesta después del delay
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    setMessages(prev => prev.map((msg, i) => 
      i === prev.length - 1 ? { ...msg, isProcessingAnswer: false } : msg
    ));

    setIsProcessing(false);
    
    // Avanzar al siguiente QA si corresponde
    if (index < chatData.length - 1) {
      setCurrentQA(prev => prev + 1);
    } else {
      setAllQuestionsAnswered(true);
    }
  };

  // Inicializar chat al montar el componente
  useEffect(() => {
    const initializeChat = async () => {
      await processQA(0);
    };
    
    setTimeout(initializeChat, 1000);
  }, []);

  // Procesar siguiente QA cuando cambia currentQA
  useEffect(() => {
    if (currentQA > 0 && currentQA < chatData.length && !isProcessing) {
      processQA(currentQA);
    }
  }, [currentQA]);

  // Scroll al fondo cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    const userQuestion = userInput.toLowerCase();
    setUserInput('');
    
    const matchingQA = chatData.find(qa =>
      userQuestion.includes(qa.question.toLowerCase())
    );

    // Paso 1: Agregar pregunta del usuario
    setMessages(prev => [...prev, { question: userInput }]);

    // Paso 2: Mostrar indicador de respuesta
    setMessages(prev => [...prev, {
      question: userInput,
      answer: matchingQA?.answer,
      isProcessingAnswer: true
    }]);
    setIsProcessing(true);

    // Paso 3: Mostrar respuesta después del delay
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    setMessages(prev => prev.map((msg, i) => 
      i === prev.length - 1 ? { ...msg, isProcessingAnswer: false } : msg
    ));

    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-auto h-[600px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4 border-b bg-gradient-to-r from-primary to-secondary">
        <h2 className="text-xl font-semibold text-white">Conversación con Giancarlo</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {/* Mensaje de pregunta */}
              {!message.answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="max-w-[80%] p-4 rounded-2xl shadow-sm bg-white text-black rounded-bl-none"
                  >
                    {message.isProcessingQuestion ? (
                      <TypingIndicator />
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.question}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Mensaje de respuesta */}
              {message.answer && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-end"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="max-w-[80%] p-4 rounded-2xl shadow-sm bg-gradient-to-r from-primary to-secondary text-white rounded-br-none"
                  >
                    {message.isProcessingAnswer ? (
                      <TypingIndicator isBot />
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.answer}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {allQuestionsAnswered && (
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
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              disabled={isProcessing}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isProcessing}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              Enviar
            </motion.button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

const TypingIndicator = ({ isBot = true }: { isBot?: boolean }) => (
  <motion.div 
    className="inline-flex items-end h-5 space-x-1"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
  >
    <span className="text-sm mr-2">{isBot ? 'escribiendo...' : 'typing...'}</span>
    <motion.span 
      className="w-2 h-2 bg-white rounded-full"
      animate={{ y: ["-25%", "25%", "-25%"] }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
    />
    <motion.span 
      className="w-2 h-2 bg-white rounded-full"
      animate={{ y: ["-25%", "25%", "-25%"] }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.span 
      className="w-2 h-2 bg-white rounded-full"
      animate={{ y: ["-25%", "25%", "-25%"] }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }}
    />
  </motion.div>
);