import { useState, useEffect } from 'react';
import type { Theme, ThemeToggleProps } from './ThemeToggleTypes';

export function useThemeToggle(_props: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light');

  // Inicializar el tema basado en la preferencia del usuario o localStorage
  useEffect(() => {
    // Verificar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Si hay un tema guardado, usarlo
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } 
    // Si no hay tema guardado, detectar preferencia del sistema
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Función para aplicar el tema inmediatamente
  const applyTheme = (newTheme: Theme) => {
    // Eliminar todas las transiciones temporalmente
    document.body.style.setProperty('transition', 'none');
    document.querySelectorAll('button, input, textarea, .user-message, .bot-message, .message-input')
      .forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.transition = 'none';
        }
      });
    
    // Aplicar clase al elemento html para que los estilos dark: funcionen
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Forzar reflow para aplicar los cambios inmediatamente
    document.body.offsetHeight;
  };

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', newTheme);
    
    // Aplicar el tema inmediatamente
    applyTheme(newTheme);
  };

  return {
    theme,
    toggleTheme
  };
}
