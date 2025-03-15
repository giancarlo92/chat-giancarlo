import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatData, TYPING_DELAY, type ChatQA } from '../data/chatData';

// Extract questions from chatData
const questions = chatData.map(item => item.question);

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatQA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      const nextQA = chatData[nextQuestionIndex];
      
      setMessages(prev => [...prev, nextQA]);
      setCurrentQuestion(nextQuestionIndex);
      
    } else if (currentQuestion === questions.length - 1 && !allQuestionsAnswered) {
      const currentQA = chatData[currentQuestion];
      
      setMessages(prev => [...prev, currentQA]);
      setAllQuestionsAnswered(true);
    }
  };

  // Initialize chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      const firstQA = chatData[0];
      setMessages([{
        question: "Hola, un gusto conocerte. " + firstQA.question,
        answer: firstQA.answer
      }]);
      
      // Proceed to next question after delay
      setTimeout(() => processNextQuestion(), TYPING_DELAY);
    };
    
    // Start with a small delay
    setTimeout(initializeChat, TYPING_DELAY);
  }, []);
  
  // Auto-advance questions when appropriate
  useEffect(() => {
    if (messages.length > 0 && !isTyping && !allQuestionsAnswered) {
      const lastMessage = messages[messages.length - 1];
      
      // Only proceed if last message has an answer and we're not at the end
      if (lastMessage.answer && currentQuestion < questions.length - 1) {
        const timer = setTimeout(() => processNextQuestion(), TYPING_DELAY);
        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestion, isTyping, messages.length, allQuestionsAnswered]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userQuestion = userInput.toLowerCase();
    setUserInput('');
    
    // Find the most relevant question from chatData based on user input
    const matchingQA = chatData.find(qa =>
      userQuestion.includes(qa.question.toLowerCase())
    );

    // Create new QA pair
    const newQA: ChatQA = {
      question: userInput,
      answer: matchingQA?.answer || 'Lo siento, no tengo información sobre esa pregunta.'
    };

    setMessages(prev => [...prev, newQA]);
    setIsTyping(true);
    
    // Add typing delay
    await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
    setIsTyping(false);
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
              {/* Question message */}
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
                  <div className="markdown-content prose prose-sm max-w-none prose-headings:font-bold prose-headings:mb-2 prose-p:leading-relaxed prose-p:my-2 prose-li:my-1 prose-headings:text-black prose-p:text-black prose-li:text-black">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.question}</ReactMarkdown>
                  </div>
                </motion.div>
              </motion.div>

              {/* Answer message */}
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
                    <div className="markdown-content prose prose-sm max-w-none prose-invert prose-headings:font-bold prose-headings:mb-2 prose-p:leading-relaxed prose-p:my-2 prose-li:my-1 prose-headings:text-white prose-p:text-white prose-li:text-white">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.answer}</ReactMarkdown>
                    </div>
                    {!message.answer && isTyping && index === messages.length - 1 && (
                      <motion.div 
                        className="inline-flex items-end h-5 space-x-1 ml-1 mt-2"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 }}
                      >
                        <span className="text-gray-500 text-sm mr-1">escribiendo...</span>
                        <motion.span 
                          className="w-2 h-2 bg-secondary rounded-full"
                          animate={{ y: ["-25%", "25%", "-25%"] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        />
                        <motion.span 
                          className="w-2 h-2 bg-secondary rounded-full"
                          animate={{ y: ["-25%", "25%", "-25%"] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                        />
                        <motion.span 
                          className="w-2 h-2 bg-secondary rounded-full"
                          animate={{ y: ["-25%", "25%", "-25%"] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                        />
                      </motion.div>
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
              disabled={isTyping}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isTyping}
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