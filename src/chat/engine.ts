import type { ChatAction, ChatMessage, Stage, UserProfile } from '@/types';
import {
  courses,
  coursesByDomain,
  domains,
  getCourse,
  getCourseByLesson,
  getLesson,
} from '@/data/courses';
import { allBadges, xpForLevel } from '@/data/user';

export type Effect =
  | { kind: 'xp'; amount: number }
  | { kind: 'complete-lesson'; lessonId: string }
  | { kind: 'unlock-badge'; badgeId: string };

export interface Step {
  botMessages: OutMessage[];
  newStage: Stage;
  effects: Effect[];
}

type OutMessage = Omit<ChatMessage, 'id' | 'timestamp' | 'from'> & { from?: 'bot' };

const uid = () => Math.random().toString(36).slice(2, 10);

export function materialize(m: OutMessage): ChatMessage {
  return {
    id: uid(),
    from: 'bot',
    timestamp: Date.now(),
    kind: m.kind ?? 'text',
    content: m.content,
    actions: m.actions,
  };
}

export function userMessage(content: string): ChatMessage {
  return { id: uid(), from: 'user', timestamp: Date.now(), content };
}

const menuActions: ChatAction[] = [
  { label: 'Apprendre', payload: 'pick-domain' },
  { label: 'Mon profil', payload: 'show-profile' },
  { label: 'Mes badges', payload: 'show-badges' },
];

export function greeting(user: UserProfile): Step {
  return {
    botMessages: [
      { content: `Salut ${user.name} 👋 Je suis ton compagnon d'apprentissage.` },
      {
        content: `On fait quoi ?`,
        actions: menuActions,
      },
    ],
    newStage: { kind: 'menu' },
    effects: [],
  };
}

export function step(payload: string, stage: Stage, user: UserProfile): Step {
  if (payload === 'menu' || payload === 'pick-domain') {
    return {
      botMessages: [
        {
          content: `Tu veux t'entraîner sur quel domaine ?`,
          actions: domains.map(d => ({ label: d, payload: `domain:${d}` })),
        },
      ],
      newStage: { kind: 'pick-domain' },
      effects: [],
    };
  }

  if (payload.startsWith('domain:')) {
    const domain = payload.slice('domain:'.length) as (typeof domains)[number];
    const cs = coursesByDomain(domain);
    if (cs.length === 0) {
      return fallback(`Rien dans ${domain} pour l'instant.`, user);
    }
    return {
      botMessages: [
        {
          content: `OK, ${domain}. J'ai ${cs.length} cours pour toi :`,
          actions: cs.map(c => ({ label: `${c.emoji} ${c.title}`, payload: `course:${c.id}` })),
        },
      ],
      newStage: { kind: 'pick-course', domain },
      effects: [],
    };
  }

  if (payload.startsWith('course:')) {
    const courseId = payload.slice('course:'.length);
    const course = getCourse(courseId);
    if (!course) return fallback(`Cours introuvable.`, user);
    return {
      botMessages: [
        { content: `"${course.title}" — ${course.description}` },
        {
          content: `Tu veux attaquer quelle leçon ?`,
          actions: course.lessons.map((l, i) => {
            const done = user.completedLessonIds.includes(l.id);
            return { label: `${done ? '✓ ' : `${i + 1}. `}${l.title}`, payload: `lesson:${l.id}` };
          }),
        },
      ],
      newStage: { kind: 'pick-lesson', courseId },
      effects: [],
    };
  }

  if (payload.startsWith('lesson:')) {
    const lessonId = payload.slice('lesson:'.length);
    const lesson = getLesson(lessonId);
    if (!lesson) return fallback(`Leçon introuvable.`, user);
    const course = getCourseByLesson(lessonId);
    return {
      botMessages: [
        { content: `${course?.emoji ?? '📖'} "${lesson.title}". C'est parti.` },
        { content: lesson.paragraphs[0] },
        paragraphFollowup(lessonId, 0, lesson.paragraphs.length),
      ],
      newStage: { kind: 'lesson-reading', lessonId, paragraphIndex: 0 },
      effects: [],
    };
  }

  if (payload === 'lesson-continue' && stage.kind === 'lesson-reading') {
    const lesson = getLesson(stage.lessonId);
    if (!lesson) return fallback(`Leçon introuvable.`, user);
    const nextIndex = stage.paragraphIndex + 1;
    if (nextIndex >= lesson.paragraphs.length) {
      return startQuiz(stage.lessonId, user);
    }
    return {
      botMessages: [
        { content: lesson.paragraphs[nextIndex] },
        paragraphFollowup(stage.lessonId, nextIndex, lesson.paragraphs.length),
      ],
      newStage: { kind: 'lesson-reading', lessonId: stage.lessonId, paragraphIndex: nextIndex },
      effects: [],
    };
  }

  if (payload === 'quiz-start' && stage.kind === 'lesson-reading') {
    return startQuiz(stage.lessonId, user);
  }

  if (payload.startsWith('answer:') && stage.kind === 'quiz-question') {
    const selected = parseInt(payload.slice('answer:'.length), 10);
    const lesson = getLesson(stage.lessonId);
    if (!lesson?.quiz) return fallback(`Quiz indisponible.`, user);
    const q = lesson.quiz.questions[stage.questionIndex];
    const correct = selected === q.correctIndex;
    const newScore = stage.score + (correct ? 1 : 0);
    const isLast = stage.questionIndex === lesson.quiz.questions.length - 1;
    const reaction = correct
      ? pickOne(['Exactement 🎯', 'Bien joué !', 'Parfait.', 'Bravo !'])
      : pickOne(['Pas tout à fait.', 'Presque.', 'Raté cette fois.']);

    const feedbackAction: ChatAction = isLast
      ? { label: 'Voir mon score', payload: 'quiz-end' }
      : { label: 'Question suivante', payload: 'quiz-next' };

    return {
      botMessages: [
        { content: `${reaction} ${q.explanation}`, actions: [feedbackAction] },
      ],
      newStage: { kind: 'quiz-feedback', lessonId: stage.lessonId, questionIndex: stage.questionIndex, score: newScore, correct },
      effects: correct ? [{ kind: 'xp', amount: 5 }] : [],
    };
  }

  if (payload === 'quiz-next' && stage.kind === 'quiz-feedback') {
    return askQuestion(stage.lessonId, stage.questionIndex + 1, stage.score, user);
  }

  if (payload === 'quiz-end' && stage.kind === 'quiz-feedback') {
    return finishLesson(stage.lessonId, stage.score, user);
  }

  if (payload === 'show-profile') {
    return profileStep(user);
  }

  if (payload === 'show-badges') {
    return badgesStep(user);
  }

  if (payload === 'back-to-menu') {
    return {
      botMessages: [{ content: 'De retour au menu. On fait quoi ?', actions: menuActions }],
      newStage: { kind: 'menu' },
      effects: [],
    };
  }

  return fallback(`Je n'ai pas compris. Dis-moi ce que tu veux faire :`, user);
}

function paragraphFollowup(_lessonId: string, index: number, total: number): OutMessage {
  const isLast = index === total - 1;
  if (isLast) {
    return {
      content: `Tu as tout lu. Prêt pour le quiz ?`,
      actions: [
        { label: 'Lancer le quiz', payload: 'quiz-start' },
        { label: 'Retour au menu', payload: 'back-to-menu' },
      ],
    };
  }
  return {
    content: `(${index + 1}/${total})`,
    actions: [
      { label: 'Continue', payload: 'lesson-continue' },
      { label: 'Stop', payload: 'back-to-menu' },
    ],
  };
}

function startQuiz(lessonId: string, user: UserProfile): Step {
  const lesson = getLesson(lessonId);
  if (!lesson?.quiz) {
    return {
      botMessages: [{ content: `Pas de quiz sur cette leçon. Je la marque comme faite.` }],
      newStage: { kind: 'lesson-done' },
      effects: [
        { kind: 'xp', amount: 10 },
        { kind: 'complete-lesson', lessonId },
      ],
    };
  }
  const intro: Step = {
    botMessages: [
      { content: `Allez, quiz time 🎯 ${lesson.quiz.questions.length} question${lesson.quiz.questions.length > 1 ? 's' : ''}.` },
    ],
    newStage: { kind: 'lesson-reading', lessonId, paragraphIndex: 0 },
    effects: [{ kind: 'xp', amount: 10 }],
  };
  const first = askQuestion(lessonId, 0, 0, user);
  return {
    botMessages: [...intro.botMessages, ...first.botMessages],
    newStage: first.newStage,
    effects: [...intro.effects, ...first.effects],
  };
}

function askQuestion(lessonId: string, index: number, score: number, user: UserProfile): Step {
  const lesson = getLesson(lessonId);
  if (!lesson?.quiz) return fallback(`Quiz indisponible.`, user);
  if (index >= lesson.quiz.questions.length) {
    return finishLesson(lessonId, score, user);
  }
  const q = lesson.quiz.questions[index];
  return {
    botMessages: [
      {
        content: `**Q${index + 1}.** ${q.question}`,
        actions: q.options.map((opt, i) => ({ label: opt, payload: `answer:${i}` })),
      },
    ],
    newStage: { kind: 'quiz-question', lessonId, questionIndex: index, score },
    effects: [],
  };
}

function finishLesson(lessonId: string, score: number, user: UserProfile): Step {
  const lesson = getLesson(lessonId);
  if (!lesson?.quiz) return fallback(`Quiz indisponible.`, user);
  const total = lesson.quiz.questions.length;
  const perfect = score === total;
  const scoreLine = perfect
    ? `Sans faute 🎯 ${score}/${total}.`
    : `Score final : ${score}/${total}.`;
  const xpEarned = score * 5;

  const effects: Effect[] = [{ kind: 'complete-lesson', lessonId }];
  if (user.badges.length === 0) effects.push({ kind: 'unlock-badge', badgeId: 'first-step' });
  if (perfect) effects.push({ kind: 'unlock-badge', badgeId: 'perfect-quiz' });

  const completedAfter = [...user.completedLessonIds, lessonId];
  const domainsCovered = new Set(
    completedAfter
      .map(id => getCourseByLesson(id)?.domain)
      .filter(Boolean) as string[]
  );
  if (domainsCovered.size >= 3) effects.push({ kind: 'unlock-badge', badgeId: 'polymath' });

  return {
    botMessages: [
      { content: scoreLine },
      { kind: 'reward', content: `+${xpEarned} XP gagnés ⚡` },
      {
        content: `On continue ?`,
        actions: [
          { label: 'Autre leçon', payload: 'pick-domain' },
          { label: 'Voir mes badges', payload: 'show-badges' },
          { label: 'Retour au menu', payload: 'back-to-menu' },
        ],
      },
    ],
    newStage: { kind: 'lesson-done' },
    effects: [...effects],
  };
}

function profileStep(user: UserProfile): Step {
  const nextLevel = xpForLevel(user.level);
  const pct = Math.round((user.xp / nextLevel) * 100);
  const lessonCount = user.completedLessonIds.length;
  const coursesSet = new Set(user.completedLessonIds.map(id => getCourseByLesson(id)?.id).filter(Boolean));
  return {
    botMessages: [
      {
        content:
          `Voici ton tableau de bord 📊\n\n` +
          `• Niveau ${user.level} (${user.xp} / ${nextLevel} XP — ${pct}%)\n` +
          `• Streak : ${user.streakDays} jour${user.streakDays > 1 ? 's' : ''} 🔥\n` +
          `• Leçons terminées : ${lessonCount}\n` +
          `• Cours explorés : ${coursesSet.size} / ${courses.length}\n` +
          `• Badges débloqués : ${user.badges.length} / ${allBadges.length}`,
        actions: [
          { label: 'Mes badges', payload: 'show-badges' },
          { label: 'Retour au menu', payload: 'back-to-menu' },
        ],
      },
    ],
    newStage: { kind: 'profile' },
    effects: [],
  };
}

function badgesStep(user: UserProfile): Step {
  const lines = allBadges.map(b => {
    const got = user.badges.some(ub => ub.id === b.id);
    return got
      ? `${b.emoji} **${b.label}** — ${b.description} ✓`
      : `🔒 ${b.label} — ${b.description}`;
  });
  return {
    botMessages: [
      {
        content:
          user.badges.length === 0
            ? `Tu n'as encore aucun badge. Lance une leçon pour décrocher le premier 👣\n\n${lines.join('\n')}`
            : `Tes badges :\n\n${lines.join('\n')}`,
        actions: [
          { label: 'Apprendre', payload: 'pick-domain' },
          { label: 'Retour au menu', payload: 'back-to-menu' },
        ],
      },
    ],
    newStage: { kind: 'badges' },
    effects: [],
  };
}

function fallback(content: string, _user: UserProfile): Step {
  return {
    botMessages: [{ content, actions: menuActions }],
    newStage: { kind: 'menu' },
    effects: [],
  };
}

export function interpretText(text: string, stage: Stage): string | null {
  const t = text.toLowerCase().trim();
  if (!t) return null;
  if (/(menu|aide|help|accueil)/.test(t)) return 'back-to-menu';
  if (/(profil|stat|niveau|xp)/.test(t)) return 'show-profile';
  if (/badge/.test(t)) return 'show-badges';
  if (/(cours|apprendre|leçon|lecon|quiz)/.test(t)) return 'pick-domain';
  if (stage.kind === 'lesson-reading' && /(continu|suite|next|ok)/.test(t)) return 'lesson-continue';
  return null;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
