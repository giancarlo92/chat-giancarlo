import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
}

export default function AnimatedTitle({ text }: AnimatedTitleProps) {
  return (
    <motion.h1 
      className="text-4xl font-bold text-gray-800 mt-6 mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.h1>
  );
}