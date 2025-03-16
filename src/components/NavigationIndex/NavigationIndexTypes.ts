export interface NavigationIndexProps {
  chatQuestions: string[];
  onQuestionClick: (question: string) => void;
  activeQuestionId?: string;
}

export interface NavigationItem {
  id: string;
  question: string;
}
