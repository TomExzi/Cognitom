import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import { useChat } from '@/chat/useChat';
import type { ChatMessage } from '@/types';

export function Chat() {
  const { state } = useStore();
  const { handleAction, handleText } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.messages, state.isTyping]);

  const lastMessage = state.messages[state.messages.length - 1];
  const pendingActions =
    !state.isTyping && lastMessage?.from === 'bot' ? lastMessage.actions : undefined;

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    handleText(text);
  }

  return (
    <div className="h-full flex flex-col bg-[var(--color-base)]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
          {state.messages.map(m => (
            <MessageRow key={m.id} message={m} />
          ))}
          {state.isTyping && <TypingRow />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-[var(--color-border-soft)] bg-[var(--color-surface)]">
        <div className="max-w-2xl mx-auto px-6 py-4 space-y-3">
          {pendingActions && pendingActions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pendingActions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(a.label, a.payload)}
                  className="px-4 py-2 text-sm rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)] font-medium hover:bg-[var(--color-accent)] hover:text-white transition active:scale-95"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Écris ou clique sur une réponse…"
              className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-surface-muted)] border border-transparent focus:outline-none focus:border-[var(--color-accent)] transition"
            />
            <button
              onClick={send}
              className="w-12 h-12 rounded-2xl bg-[var(--color-ink)] text-white flex items-center justify-center hover:bg-[var(--color-accent)] transition active:scale-95"
              aria-label="Envoyer"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.from === 'user') {
    return (
      <div className="flex justify-end animate-[slideUp_240ms_ease-out]">
        <p className="text-[var(--color-ink-soft)] italic pt-1 max-w-[85%] text-right">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.kind === 'reward') {
    return (
      <div className="flex gap-3 animate-[slideUp_240ms_ease-out]">
        <BotAvatar />
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-reward-soft)] text-[var(--color-reward)] font-semibold animate-[pulse_1400ms_ease-in-out_1]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-[slideUp_240ms_ease-out]">
      <BotAvatar />
      <p className="text-[var(--color-ink)] leading-relaxed pt-0.5 whitespace-pre-wrap">
        {renderInline(message.content)}
      </p>
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-strong)] text-white flex items-center justify-center text-sm font-bold shrink-0">
      C
    </div>
  );
}

function TypingRow() {
  return (
    <div className="flex gap-3 animate-[slideUp_200ms_ease-out]">
      <BotAvatar />
      <div className="flex items-center gap-1 py-3">
        <Dot delay={0} />
        <Dot delay={160} />
        <Dot delay={320} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-2 h-2 rounded-full bg-[var(--color-ink-muted)] animate-[typingDot_1000ms_ease-in-out_infinite]"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
