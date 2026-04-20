import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Badge, ChatMessage, Stage, UserProfile } from '@/types';
import { allBadges, initialUser, levelFromXp } from '@/data/user';

interface State {
  user: UserProfile;
  messages: ChatMessage[];
  stage: Stage;
  isTyping: boolean;
}

type Action =
  | { type: 'addMessage'; message: ChatMessage }
  | { type: 'setTyping'; value: boolean }
  | { type: 'setStage'; stage: Stage }
  | { type: 'addXp'; amount: number }
  | { type: 'completeLesson'; lessonId: string }
  | { type: 'unlockBadge'; badgeId: string };

const initialState: State = {
  user: initialUser,
  messages: [],
  stage: { kind: 'greeting' },
  isTyping: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addMessage':
      return { ...state, messages: [...state.messages, action.message] };
    case 'setTyping':
      return { ...state, isTyping: action.value };
    case 'setStage':
      return { ...state, stage: action.stage };
    case 'addXp': {
      const xp = state.user.xp + action.amount;
      return { ...state, user: { ...state.user, xp, level: levelFromXp(xp) } };
    }
    case 'completeLesson': {
      if (state.user.completedLessonIds.includes(action.lessonId)) return state;
      return {
        ...state,
        user: {
          ...state.user,
          completedLessonIds: [...state.user.completedLessonIds, action.lessonId],
        },
      };
    }
    case 'unlockBadge': {
      if (state.user.badges.some(b => b.id === action.badgeId)) return state;
      const badge = allBadges.find(b => b.id === action.badgeId);
      if (!badge) return state;
      const unlocked: Badge = { ...badge, unlockedAt: new Date().toISOString() };
      return { ...state, user: { ...state.user, badges: [...state.user.badges, unlocked] } };
    }
  }
}

interface StoreValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
