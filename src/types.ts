export type Domain = 'Histoire' | 'Culture G' | 'Économie';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  paragraphs: string[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  domain: Domain;
  description: string;
  emoji: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streakDays: number;
  badges: Badge[];
  completedLessonIds: string[];
}

export interface ChatAction {
  label: string;
  payload: string;
}

export type MessageKind = 'text' | 'reward' | 'lesson-card';

export interface ChatMessage {
  id: string;
  from: 'bot' | 'user';
  content: string;
  actions?: ChatAction[];
  kind?: MessageKind;
  lessonId?: string;
  timestamp: number;
}

export type Stage =
  | { kind: 'greeting' }
  | { kind: 'menu' }
  | { kind: 'pick-domain' }
  | { kind: 'pick-course'; domain: Domain }
  | { kind: 'pick-lesson'; courseId: string }
  | { kind: 'lesson-card'; lessonId: string }
  | { kind: 'lesson-reading'; lessonId: string; paragraphIndex: number }
  | { kind: 'quiz-question'; lessonId: string; questionIndex: number; score: number }
  | { kind: 'quiz-feedback'; lessonId: string; questionIndex: number; score: number; correct: boolean }
  | { kind: 'lesson-done' }
  | { kind: 'profile' }
  | { kind: 'badges' };
