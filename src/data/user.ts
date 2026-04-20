import type { Badge, UserProfile } from '@/types';

export const allBadges: Badge[] = [
  { id: 'first-step', label: 'Premier pas', emoji: '👣', description: 'Première leçon terminée' },
  { id: 'perfect-quiz', label: 'Sans faute', emoji: '🎯', description: 'Un quiz réussi à 100%' },
  { id: 'streak-7', label: 'Semaine de feu', emoji: '🔥', description: '7 jours de pratique consécutifs' },
  { id: 'polymath', label: 'Touche-à-tout', emoji: '🧠', description: 'Une leçon dans chaque domaine' },
];

export const initialUser: UserProfile = {
  name: 'Apprenant',
  xp: 0,
  level: 1,
  streakDays: 1,
  badges: [],
  completedLessonIds: [],
};

export const xpForLevel = (level: number) => level * 100;
export const levelFromXp = (xp: number) => Math.floor(xp / 100) + 1;
