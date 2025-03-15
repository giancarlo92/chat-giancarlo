import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  isBot?: boolean;
}

export default function TypingIndicator({ isBot = false }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isBot ? 'bot-message ml-auto' : 'user-message'}`}
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