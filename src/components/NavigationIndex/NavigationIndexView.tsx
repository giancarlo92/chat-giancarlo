import React from 'react';
import type { NavigationIndexProps } from './NavigationIndexTypes';
import '../../styles/darkMode.css';

export default function NavigationIndexView({
  chatQuestions,
  onQuestionClick,
  activeQuestionId
}: NavigationIndexProps) {
  return (
    <div className="navigation-index">
      <h3 className="text-lg font-medium mb-2">Índice</h3>
      <ul className="space-y-1">
        {chatQuestions.map((question, index) => (
          <li 
            key={`nav-${index}`} 
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <button
              onClick={() => onQuestionClick(question)}
              className={`text-left w-full px-3 py-2 text-sm rounded-md transition-colors ${
                activeQuestionId === question ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              <span className="block truncate">{question}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
