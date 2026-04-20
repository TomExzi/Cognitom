# CognitoChat — Guide projet

## Vision
App d'apprentissage où la **navigation et l'interaction passent principalement par un chatbot**. L'utilisateur discute avec le bot pour choisir un cours, suivre une leçon, répondre à un quiz, ou naviguer vers d'autres features (profil, progression, badges).

- **Stack actuelle** : Vite + React 18 + TypeScript + Tailwind CSS v4
- **Portage mobile prévu** : Expo / React Native (plus tard) — donc les composants UI doivent rester agnostiques du DOM autant que possible (éviter les APIs web-only complexes, préférer les patterns portables).
- **Données** : tout en **mockup** pour le moment, pas de backend.
- **Bot** : scripté (arbre de décision / matching simple) ; ~10% des interactions pourront être branchées à un LLM plus tard.

## Principes de design

### Règle 60 / 30 / 10
- **60% dominant** — fond clair neutre (`base`, `base-soft`). Espaces, layout.
- **30% secondaire** — surfaces (`surface`, `surface-muted`, `border-soft`), bulles, cartes.
- **10% accent** — `accent` (indigo `#6366F1`) pour actions/progression + `reward` (ambre `#F59E0B`) pour récompenses (XP, streak, badges). À doser ensemble : **max 2 accents visibles par écran**.

### Ton visuel
- Minimaliste + gamifié : coins arrondis généreux (`rounded-xl` / `rounded-2xl`), ombres douces, micro-animations sur les interactions.
- L'ambre est réservé aux moments de récompense pour garder son impact.
- Typographie : Inter (system fallback).

## Architecture

```
src/
  components/      composants UI réutilisables
  features/        features organisées par domaine (chat, courses, gamification, profile)
  data/            mock data (courses, lessons, quizzes, user)
  bot/             logique du chatbot scripté
  hooks/           hooks React partagés
  types.ts         types TypeScript partagés
  App.tsx          layout principal
```

## Conventions de code
- **Pas de commentaires** sauf WHY non-évident (contrainte cachée, workaround).
- Pas d'over-engineering : on n'ajoute une abstraction que quand le besoin est réel (3e duplication).
- **Imports absolus** via `@/` → `src/`.
- Composants fonctionnels + hooks. Pas de classes.
- Types explicites sur les API publiques (props, data), inférés pour le local.
- **Pas de `any`** sauf justification.

## Modèle de données (mock)

- `Course` : `id`, `title`, `domain` (Histoire / Culture G / Économie), `description`, `lessons[]`
- `Lesson` : `id`, `title`, `content` (markdown-lite), `quiz?`
- `Quiz` : `id`, `questions[]` (QCM pour l'instant)
- `QuizQuestion` : `question`, `options[]`, `correctIndex`, `explanation`
- `UserProfile` : `name`, `xp`, `level`, `streakDays`, `badges[]`, `completedLessons[]`

## Gamification (règles MVP)
- **XP** : +10 par leçon lue, +5 par bonne réponse, bonus streak.
- **Niveau** : seuils à définir progressivement (ex: 100 XP = lvl 2).
- **Streak** : jour consécutif de pratique.
- **Badges** : débloqués à des milestones (1re leçon, 1er quiz 100%, 7 jours streak…).

## Chat : pattern d'interaction
- **Messages** = suite de `ChatMessage` (from: `bot` | `user`, content, éventuellement `actions[]` : boutons de réponse rapide).
- **Quiz court / QCM simple** → inline dans le chat (bulles + boutons).
- **Exercice long / leçon** → ouvre un **mini-écran** (panneau de droite) ; le bot commente le résultat une fois terminé.
- Le bot peut proposer de la navigation (ex: "voir tes badges ?") qui ouvre aussi un mini-écran.

## Commandes
- `npm run dev` — serveur de dev
- `npm run build` — build prod
- `npm run preview` — preview du build
