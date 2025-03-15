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
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } 
    // Si no hay tema guardado, detectar preferencia del sistema
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', newTheme);
    
    // Aplicar clase al elemento html para que los estilos dark: funcionen
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Forzar la actualización de los estilos
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    theme,
    toggleTheme
  };
}
