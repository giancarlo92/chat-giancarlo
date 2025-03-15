import React from 'react';
import { motion } from 'framer-motion';
import type { TypingIndicatorProps } from './TypingIndicatorTypes';
import { useTypingIndicator } from './TypingIndicatorLogic';
import '../../styles/darkMode.css';
import '../../styles/chatDarkMode.css';

export default function TypingIndicatorView(props: TypingIndicatorProps) {
  const { isBot } = useTypingIndicator(props);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isBot ? "bot-message" : "user-message"}
    >
      <div className="typing-indicator">
        <span>{isBot ? 'escribiendo respuesta...' : 'escribiendo pregunta...'}</span>
        <span className="typing-dot" />
        <span className="typing-dot" style={{ animationDelay: '0.1s' }} />
        <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
      </div>
    </motion.div>
  );
}
