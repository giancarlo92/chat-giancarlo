import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TypingIndicator from '../TypingIndicator';
import NavigationIcons from '../NavigationIcons';
import SocialIcons from '../SocialIcons';
import type { ChatWindowProps } from './ChatWindowTypes';
import { useChatWindow } from './ChatWindowLogic';
import '../../styles/darkMode.css';
import '../../styles/chatDarkMode.css';
import '../../styles/forceDarkMode.css';
import '../../styles/modernScroll.css';
import '../../styles/chatStyles.css';

export default function ChatWindowView(props: ChatWindowProps) {
  const {
    messages,
    userInput,
    isTypingQuestion,
    isTypingAnswer,
    messagesEndRef,
    messageRefs,
    handleSubmit,
    handleInputChange,
    toggleMessageExpansion,
    toggleAllMessages,
    navigateToQuestion,
    chatData,
    activeQuestionId,
    allQuestionsCompleted,
    visibleIcons,
    allExpanded
  } = useChatWindow(props);

  // Efecto para mantener el scroll en el último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTypingQuestion, isTypingAnswer]);

  return (
    <div className="chat-page">
      {/* Iconos de navegación flotantes */}
      <NavigationIcons 
        chatItems={chatData} 
        onQuestionClick={navigateToQuestion} 
        className="right-navigation"
        activeQuestionId={activeQuestionId}
        visibleIcons={visibleIcons}
      />
      
      {/* Iconos de redes sociales flotantes */}
      <SocialIcons className="bottom-social" />
      
      {/* Contenido principal del chat */}
      <div className="chat-content">
        {/* Botón para colapsar/expandir todas las secciones */}
        <div className="collapse-all-container">
          <button 
            className="collapse-all-button"
            onClick={toggleAllMessages}
            aria-label={allExpanded ? "Colapsar todas las secciones" : "Expandir todas las secciones"}
          >
            {allExpanded ? "Colapsar todo" : "Expandir todo"}
            {allExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              ref={el => {
                if (messageRefs.current) {
                  messageRefs.current[message.id] = el;
                }
              }}
              id={message.id}
              className="chat-message-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pregunta (a la izquierda) */}
              <div className="user-message">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMessageExpansion(message.id);
                    }}
                    className="collapse-button"
                    aria-label={message.isExpanded ? "Colapsar respuesta" : "Expandir respuesta"}
                  >
                    {message.isExpanded ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <h3 className="message-title">{message.question}</h3>
                </div>
              </div>

              {/* Respuesta (a la derecha) */}
              {message.answer && (
                <motion.div
                  className={`bot-message ${message.isExpanded ? 'expanded' : 'collapsed'}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: message.isExpanded ? 1 : 0, 
                    height: message.isExpanded ? "auto" : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.answer}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicadores de escritura */}
        {isTypingQuestion && (
          <div className="typing-container user">
            <TypingIndicator isBot={false} />
          </div>
        )}
        {isTypingAnswer && (
          <div className="typing-container bot">
            <TypingIndicator isBot={true} />
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Formulario de entrada */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Escribe tu pregunta..."
            className="chat-input"
            disabled={isTypingQuestion || isTypingAnswer || allQuestionsCompleted}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!userInput.trim() || isTypingQuestion || isTypingAnswer || allQuestionsCompleted}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
