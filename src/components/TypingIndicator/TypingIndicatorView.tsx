import React from 'react';
import { motion } from 'framer-motion';
import type { TypingIndicatorProps } from './TypingIndicatorTypes';
import { useTypingIndicator } from './TypingIndicatorLogic';
import '../../styles/darkMode.css';
import '../../styles/chatDarkMode.css';
import '../../styles/forceDarkMode.css';

export default function TypingIndicatorView(props: TypingIndicatorProps) {
  const { isBot } = useTypingIndicator(props);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="typing-indicator"
    >
      <span>{isBot ? 'escribiendo respuesta' : 'escribiendo pregunta'}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="typing-dots"
      >...</motion.span>
    </motion.div>
  );
}
