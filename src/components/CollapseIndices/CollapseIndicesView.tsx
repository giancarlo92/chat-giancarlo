import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/darkMode.css';

export interface CollapseIndicesProps {
  className?: string;
  onToggle?: (isVisible: boolean) => void;
}

export default function CollapseIndicesView({ 
  className = '',
  onToggle = () => {}
}: CollapseIndicesProps) {
  // Iniciar con los índices visibles por defecto
  const [isVisible, setIsVisible] = useState(true);
  
  const toggleVisibility = (e: React.MouseEvent) => {
    // Detener la propagación del evento para evitar conflictos
    e.stopPropagation();
    
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle(newState);
    
    // Guardar el estado en localStorage para persistencia
    localStorage.setItem('indicesVisible', newState.toString());
    
    // Disparar un evento personalizado para notificar a otros componentes
    const event = new CustomEvent('indicesVisibilityChanged', { detail: { isVisible: newState } });
    document.dispatchEvent(event);
  };
  
  // Cargar el estado inicial desde localStorage, pero asegurar que esté visible por defecto
  useEffect(() => {
    const savedState = localStorage.getItem('indicesVisible');
    // Si no hay estado guardado o es null, mantener visible por defecto
    if (savedState === null) {
      setIsVisible(true);
      onToggle(true);
      localStorage.setItem('indicesVisible', 'true');
    } else {
      const parsedState = savedState === 'true';
      setIsVisible(parsedState);
      onToggle(parsedState);
    }
  }, [onToggle]);
  
  return (
    <>
      <button
        onClick={(e) => toggleVisibility(e)}
        className={`social-toggle-button indices-toggle-button ${className}`}
        aria-label={isVisible ? "Ocultar índices" : "Mostrar índices"}
      >
        {isVisible ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        )}
      </button>
    </>
  );
}
