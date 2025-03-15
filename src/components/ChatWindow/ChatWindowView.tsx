import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatData } from '../../data/chatData';
import TypingIndicator from '../TypingIndicator';
import type { ChatWindowProps } from './ChatWindowTypes';
import { useChatWindow } from './ChatWindowLogic';
import '../../styles/chatStyles.css';

export default function ChatWindowView(props: ChatWindowProps) {
  const {
    messages,
    currentStep,
    userInput,
    isTypingQuestion,
    isTypingAnswer,
    chatMessagesRef,
    messagesEndRef,
    handleScroll,
    handleSubmit,
    handleInputChange
  } = useChatWindow(props);

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
              onChange={handleInputChange}
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
