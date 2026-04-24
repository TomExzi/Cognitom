import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import { useChat } from '@/chat/useChat';
import { getCourseByLesson, getLesson } from '@/data/courses';
import type { ChatMessage } from '@/types';

export function Chat() {
  const { state } = useStore();
  const { handleAction, handleText } = useChat();
  const [input, setInput] = useState('');
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
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
            <MessageRow key={m.id} message={m} onOpenLesson={setOpenLessonId} />
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

      {openLessonId && (
        <LessonOverlay lessonId={openLessonId} onClose={() => setOpenLessonId(null)} />
      )}
    </div>
  );
}

function MessageRow({
  message,
  onOpenLesson,
}: {
  message: ChatMessage;
  onOpenLesson: (id: string) => void;
}) {
  if (message.from === 'user') {
    return (
      <div className="flex justify-end animate-[slideUp_240ms_ease-out]">
        <p className="text-[var(--color-ink-soft)] italic pt-1 max-w-[85%] text-right">
          {message.content}
        </p>
      </div>
    );
  }

  if (message.kind === 'lesson-card' && message.lessonId) {
    return (
      <div className="flex gap-3 animate-[slideUp_240ms_ease-out]">
        <BotAvatar />
        <LessonCard lessonId={message.lessonId} onOpen={() => onOpenLesson(message.lessonId!)} />
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

const HIGHLIGHT_REGEX =
  /(\*\*[^*]+\*\*|«\s?[^»]+\s?»|"[^"]+"|\b\d{3,4}\b|\b\d+(?:[,.]\d+)?\s*%|\bXVIIIe?\b|\bXIXe?\b|\bXXe?\b|\bXXIe?\b)/g;

function renderHighlighted(text: string) {
  const parts = text.split(HIGHLIGHT_REGEX);
  return parts.map((p, i) => {
    if (!p) return null;
    if (i % 2 === 1) {
      const inner = p.startsWith('**') && p.endsWith('**') ? p.slice(2, -2) : p;
      return (
        <mark
          key={i}
          className="bg-[var(--color-reward-soft)] text-[var(--color-reward)] font-semibold px-1 rounded-[4px]"
        >
          {inner}
        </mark>
      );
    }
    return (
      <span key={i}>
        {p.split(/(\*[^*]+\*)/g).map((sub, j) =>
          sub.startsWith('*') && sub.endsWith('*') && !sub.startsWith('**') ? (
            <em key={j} className="text-[var(--color-ink-soft)]">
              {sub.slice(1, -1)}
            </em>
          ) : (
            <span key={j}>{sub}</span>
          )
        )}
      </span>
    );
  });
}

function renderLessonBlock(text: string, blockIndex: number, isFirstBlock: boolean) {
  const lines = text.split('\n');
  const introLines: string[] = [];
  const items: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (line.startsWith('- ')) {
      inList = true;
      items.push(line.slice(2));
    } else if (!inList) {
      introLines.push(line);
    }
  }

  const introParas = introLines
    .join('\n')
    .split(/\n\s*\n/)
    .map(s => s.replace(/\n/g, ' ').trim())
    .filter(Boolean);

  return (
    <div key={blockIndex} className="mb-8">
      {introParas.map((para, i) => (
        <p
          key={i}
          className={
            'mb-3 ' +
            (isFirstBlock && i === 0
              ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-[var(--color-accent)]'
              : '')
          }
        >
          {renderHighlighted(para)}
        </p>
      ))}
      {items.length > 0 && (
        <ul className="mt-3 space-y-2 pl-1">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 leading-relaxed">
              <span className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-[var(--color-reward)] shrink-0" />
              <span className="flex-1">{renderHighlighted(it)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LessonCard({ lessonId, onOpen }: { lessonId: string; onOpen: () => void }) {
  const lesson = getLesson(lessonId);
  const course = getCourseByLesson(lessonId);
  if (!lesson) return null;

  return (
    <button
      onClick={onOpen}
      className="group flex-1 text-left rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-soft)] p-4 hover:border-[var(--color-accent)] hover:shadow-md transition active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center text-2xl">
          {course?.emoji ?? '📖'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--color-ink-soft)] uppercase tracking-wide">
            {course?.domain ?? 'Leçon'}
          </div>
          <div className="font-semibold text-[var(--color-ink)] truncate">{lesson.title}</div>
          <div className="text-xs text-[var(--color-ink-soft)] mt-1">
            {lesson.paragraphs.length} paragraphe{lesson.paragraphs.length > 1 ? 's' : ''}
            {lesson.quiz ? ` · quiz de ${lesson.quiz.questions.length} question${lesson.quiz.questions.length > 1 ? 's' : ''}` : ''}
          </div>
        </div>
        <span className="text-[var(--color-accent-strong)] text-sm font-medium group-hover:translate-x-0.5 transition">
          Ouvrir →
        </span>
      </div>
    </button>
  );
}

function LessonOverlay({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const lesson = getLesson(lessonId);
  const course = getCourseByLesson(lessonId);
  const [progress, setProgress] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const keyTerms = lesson ? extractKeyTerms(lesson.paragraphs) : [];

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 100;
    setProgress(pct);
    if (pct > 92) setReachedEnd(true);
  }

  if (!lesson) return null;

  return (
    <div
      className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-stretch justify-end animate-[fadeIn_180ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--color-base)] h-full flex flex-col shadow-2xl animate-[slideInRight_260ms_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <header className="relative px-6 py-4 flex items-center gap-3 border-b border-[var(--color-border-soft)] bg-[var(--color-surface)]">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center text-xl">
            {course?.emoji ?? '📖'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--color-ink-soft)] uppercase tracking-wide">
              {course?.title ?? 'Leçon'}
            </div>
            <h2 className="font-semibold truncate">{lesson.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full hover:bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-ink-soft)] transition"
          >
            ✕
          </button>
          <div className="absolute left-0 bottom-0 h-1 bg-[var(--color-surface-muted)] w-full">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-reward)] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-8 py-8">
          <article className="max-w-prose mx-auto text-[var(--color-ink)] text-[17px] leading-[1.8]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">
              <span>Leçon · {lesson.paragraphs.length} min de lecture</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-reward-soft)] text-[var(--color-reward)] normal-case tracking-normal">
                ⚡ +10 XP
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-8 tracking-tight">{lesson.title}</h1>
            {lesson.paragraphs.map((p, i) => (
              <div
                key={i}
                className="opacity-0 animate-[slideUp_420ms_ease-out_forwards]"
                style={{ animationDelay: `${120 + i * 120}ms` }}
              >
                {renderLessonBlock(p, i, i === 0)}
              </div>
            ))}

            {keyTerms.length > 0 && (
              <div
                className="mt-10 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-soft)] opacity-0 animate-[slideUp_420ms_ease-out_forwards]"
                style={{ animationDelay: `${120 + lesson.paragraphs.length * 120}ms` }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <span>🗝️</span>
                  <span>À retenir</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keyTerms.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[var(--color-reward-soft)] text-[var(--color-reward)] text-sm font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <footer className="px-6 py-4 border-t border-[var(--color-border-soft)] bg-[var(--color-surface)] flex items-center justify-between gap-4">
          <div className="text-xs text-[var(--color-ink-soft)]">
            {reachedEnd ? '✨ Tu as tout lu — prêt pour le quiz ?' : `${Math.round(progress)}% lu`}
          </div>
          <button
            onClick={onClose}
            className={
              'px-5 py-2.5 rounded-full font-medium transition active:scale-95 flex items-center gap-2 ' +
              (reachedEnd
                ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)] animate-[pulse_1400ms_ease-in-out_1]'
                : 'bg-[var(--color-surface-muted)] text-[var(--color-ink)] hover:bg-[var(--color-border-soft)]')
            }
          >
            <span>J'ai fini</span>
            <span className="text-xs opacity-80">⚡ +10 XP</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

function extractKeyTerms(paragraphs: string[]): string[] {
  const found = new Set<string>();
  for (const p of paragraphs) {
    const matches = p.match(HIGHLIGHT_REGEX);
    if (!matches) continue;
    for (const m of matches) {
      const clean = m.replace(/^\*\*|\*\*$/g, '').replace(/^["«\s]+|["»\s]+$/g, '').trim();
      if (clean) found.add(clean);
    }
  }
  return Array.from(found).slice(0, 8);
}
