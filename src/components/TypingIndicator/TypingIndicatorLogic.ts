import type { TypingIndicatorProps } from './TypingIndicatorTypes';

export function useTypingIndicator(props: TypingIndicatorProps) {
  const { isBot = false } = props;
  
  // Aquí iría cualquier lógica adicional que necesite el componente
  
  return {
    isBot
  };
}
