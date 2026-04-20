import { useCallback, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { type Effect, greeting, interpretText, materialize, step, userMessage } from '@/chat/engine';
import type { ChatMessage, Stage } from '@/types';

const MIN_TYPING = 320;
const PER_CHAR = 14;
const MAX_TYPING = 1400;

function typingDuration(text: string) {
  return Math.min(MAX_TYPING, Math.max(MIN_TYPING, text.length * PER_CHAR));
}

export function useChat() {
  const { state, dispatch } = useStore();
  const initialized = useRef(false);
  const pending = useRef(false);

  const applyEffects = useCallback((effects: Effect[]) => {
    for (const e of effects) {
      if (e.kind === 'xp') dispatch({ type: 'addXp', amount: e.amount });
      else if (e.kind === 'complete-lesson') dispatch({ type: 'completeLesson', lessonId: e.lessonId });
      else if (e.kind === 'unlock-badge') dispatch({ type: 'unlockBadge', badgeId: e.badgeId });
    }
  }, [dispatch]);

  const enqueue = useCallback(
    async (msgs: ChatMessage[], effects: Effect[], newStage: Stage) => {
      pending.current = true;
      for (let i = 0; i < msgs.length; i++) {
        const m = msgs[i];
        dispatch({ type: 'setTyping', value: true });
        await sleep(typingDuration(m.content));
        dispatch({ type: 'setTyping', value: false });
        dispatch({ type: 'addMessage', message: m });
        if (i < msgs.length - 1) await sleep(160);
      }
      dispatch({ type: 'setStage', stage: newStage });
      applyEffects(effects);
      pending.current = false;
    },
    [dispatch, applyEffects]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const s = greeting(state.user);
    enqueue(s.botMessages.map(materialize), s.effects, s.newStage);
  }, [enqueue, state.user]);

  const handleAction = useCallback(
    (label: string, payload: string) => {
      if (pending.current) return;
      dispatch({ type: 'addMessage', message: userMessage(label) });
      const s = step(payload, state.stage, state.user);
      enqueue(s.botMessages.map(materialize), s.effects, s.newStage);
    },
    [dispatch, enqueue, state.stage, state.user]
  );

  const handleText = useCallback(
    (text: string) => {
      if (pending.current) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      dispatch({ type: 'addMessage', message: userMessage(trimmed) });
      const payload = interpretText(trimmed, state.stage);
      if (payload) {
        const s = step(payload, state.stage, state.user);
        enqueue(s.botMessages.map(materialize), s.effects, s.newStage);
      } else {
        const s = step('__unknown__', state.stage, state.user);
        enqueue(s.botMessages.map(materialize), s.effects, s.newStage);
      }
    },
    [dispatch, enqueue, state.stage, state.user]
  );

  return { handleAction, handleText };
}

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
