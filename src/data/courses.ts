import type { Course, Domain } from '@/types';

export const courses: Course[] = [
  {
    id: 'hist-rev-fr',
    title: 'La Révolution française',
    domain: 'Histoire',
    emoji: '⚔️',
    description: "De 1789 à 1799, les bouleversements qui ont refondé la France.",
    lessons: [
      {
        id: 'hist-rev-fr-l1',
        title: 'Les causes de la Révolution',
        paragraphs: [
          "Fin du XVIIIe siècle, la France va mal. Trois bombes à retardement explosent en même temps :\n- Une **dette publique** colossale laissée par les guerres\n- De **mauvaises récoltes** → les campagnes ont faim\n- Des **inégalités** énormes entre les trois ordres",
          "Les **trois ordres**, c'est la société d'Ancien Régime en trois cases :\n- **Clergé** — environ 1% de la population\n- **Noblesse** — 2%\n- **Tiers état** — 97%, et c'est eux qui paient quasiment **tous les impôts** 😬",
          "Côté idées, ça bouillonne. Les **Lumières** remettent en cause le pouvoir absolu :\n- **Voltaire** — la liberté de penser\n- **Rousseau** — le contrat social\n- **Montesquieu** — la séparation des pouvoirs",
          "Mai **1789** : **Louis XVI** convoque les **États généraux** à Versailles pour essayer de régler la crise. Sans le savoir, il vient d'ouvrir la porte à la Révolution.",
        ],
        quiz: {
          id: 'hist-rev-fr-l1-q',
          questions: [
            {
              id: 'q1',
              question: "En quelle année les États généraux sont-ils convoqués ?",
              options: ['1776', '1789', '1799', '1804'],
              correctIndex: 1,
              explanation: "C'est en mai 1789 que Louis XVI convoque les États généraux à Versailles.",
            },
            {
              id: 'q2',
              question: "Quel ordre portait la plus grande part de l'impôt ?",
              options: ['Le clergé', 'La noblesse', 'Le tiers état', 'Le roi'],
              correctIndex: 2,
              explanation: "Le tiers état — environ 97% de la population — supportait l'essentiel de la fiscalité.",
            },
          ],
        },
      },
      {
        id: 'hist-rev-fr-l2',
        title: 'La prise de la Bastille',
        paragraphs: [
          "**14 juillet 1789** — Paris est à cran. Deux étincelles :\n- **Louis XVI** vient de renvoyer **Necker**, un ministre populaire\n- Il concentre des **troupes** autour de la capitale\n\nLa rumeur gonfle : le roi va frapper.",
          "Le matin, des milliers de Parisiens se mettent en mouvement :\n- Première étape : les **Invalides** — on récupère des armes\n- Deuxième étape : la **Bastille** — forteresse symbole de l'arbitraire royal, où le roi enfermait qui il voulait",
          "La forteresse tombe après quelques heures. À l'intérieur ? Seulement **7 prisonniers**. Mais le symbole est énorme.\n\nLe **14 juillet** deviendra **fête nationale française en 1880**.",
        ],
        quiz: {
          id: 'hist-rev-fr-l2-q',
          questions: [
            {
              id: 'q1',
              question: "Quelle est la date de la prise de la Bastille ?",
              options: ['4 juillet 1789', '14 juillet 1789', '14 août 1789', '26 août 1789'],
              correctIndex: 1,
              explanation: "Le 14 juillet 1789, devenu fête nationale en 1880.",
            },
          ],
        },
      },
    ],
  },
  {
    id: 'cg-capitales',
    title: 'Capitales du monde',
    domain: 'Culture G',
    emoji: '🌍',
    description: "Teste ta connaissance des capitales des cinq continents.",
    lessons: [
      {
        id: 'cg-capitales-l1',
        title: 'Europe — les incontournables',
        paragraphs: [
          "Tour rapide de l'Europe. On commence par les **classiques**, ceux que tout le monde connaît :\n- **Paris** — France\n- **Berlin** — Allemagne\n- **Madrid** — Espagne\n- **Rome** — Italie",
          "Un cran plus piège, mais à retenir absolument :\n- **Lisbonne** — Portugal\n- **Athènes** — Grèce\n- **Vienne** — Autriche\n- **Amsterdam** — Pays-Bas *(mais le gouvernement siège à La Haye — piège classique en quiz !)*",
          "Et au nord, les **capitales scandinaves** :\n- **Stockholm** — Suède\n- **Oslo** — Norvège\n- **Helsinki** — Finlande\n- **Copenhague** — Danemark",
        ],
        quiz: {
          id: 'cg-capitales-l1-q',
          questions: [
            {
              id: 'q1',
              question: "Quelle est la capitale du Portugal ?",
              options: ['Porto', 'Lisbonne', 'Madrid', 'Barcelone'],
              correctIndex: 1,
              explanation: "Lisbonne (Lisboa) est la capitale et la plus grande ville du Portugal.",
            },
            {
              id: 'q2',
              question: "Quelle est la capitale officielle des Pays-Bas ?",
              options: ['Rotterdam', 'La Haye', 'Amsterdam', 'Utrecht'],
              correctIndex: 2,
              explanation: "Amsterdam — même si le gouvernement siège à La Haye, c'est le piège classique.",
            },
          ],
        },
      },
    ],
  },
  {
    id: 'eco-bases',
    title: "Les bases de l'économie",
    domain: 'Économie',
    emoji: '💹',
    description: "Offre, demande, inflation : les concepts fondamentaux expliqués simplement.",
    lessons: [
      {
        id: 'eco-bases-l1',
        title: "L'offre et la demande",
        paragraphs: [
          "Tout marché repose sur deux forces qui se font face :\n- **Offre** — ce que les vendeurs veulent vendre à un prix donné\n- **Demande** — ce que les acheteurs veulent acheter\n\nLà où les deux se rencontrent, il se passe quelque chose de magique.",
          "Ce point de rencontre s'appelle le **prix d'équilibre** : celui où la quantité offerte = la quantité demandée. Ni surplus, ni pénurie.",
          "Que se passe-t-il si l'équilibre se casse ?\n- **Demande qui monte + offre stable** → les prix grimpent 📈\n- **Offre qui s'effondre + demande stable** → les prix grimpent aussi\n\nExemple concret : les **masques chirurgicaux** début **2020**. Demande x1000, offre inchangée → prix qui s'envolent.",
        ],
        quiz: {
          id: 'eco-bases-l1-q',
          questions: [
            {
              id: 'q1',
              question: "Si la demande augmente et l'offre reste stable, que se passe-t-il ?",
              options: ['Les prix baissent', 'Les prix montent', 'Rien ne change', "L'offre disparaît"],
              correctIndex: 1,
              explanation: "Plus de demande face à une offre fixe = pression à la hausse sur les prix.",
            },
          ],
        },
      },
      {
        id: 'eco-bases-l2',
        title: "L'inflation",
        paragraphs: [
          "**L'inflation**, c'est la hausse **générale et durable** des prix. Deux mots-clés :\n- **Générale** — ça touche (presque) tout, pas juste un produit\n- **Durable** — ça s'installe dans le temps, pas un pic ponctuel",
          "L'effet direct sur toi ? Ton **pouvoir d'achat** baisse.\n\nAvec **100€** aujourd'hui, tu achètes **moins de choses** que l'an dernier. Même billet, moins de caddie.",
          "Qui surveille ça ? Les **banques centrales**. Leur mission :\n- Maintenir l'inflation autour de **2%** par an\n- Lever les **taux d'intérêt** si ça chauffe trop → crédit plus cher → économie qui ralentit → prix qui se calment",
        ],
        quiz: {
          id: 'eco-bases-l2-q',
          questions: [
            {
              id: 'q1',
              question: "Quel est l'objectif d'inflation visé par la plupart des banques centrales ?",
              options: ['0%', 'Environ 2%', 'Environ 5%', '10%'],
              correctIndex: 1,
              explanation: "La cible classique est ~2% : assez pour éviter la déflation, assez bas pour préserver le pouvoir d'achat.",
            },
          ],
        },
      },
    ],
  },
];

export const domains: Domain[] = ['Histoire', 'Culture G', 'Économie'];
export const getCourse = (id: string) => courses.find(c => c.id === id);
export const getLesson = (id: string) => courses.flatMap(c => c.lessons).find(l => l.id === id);
export const getCourseByLesson = (lessonId: string) =>
  courses.find(c => c.lessons.some(l => l.id === lessonId));
export const coursesByDomain = (domain: Domain) => courses.filter(c => c.domain === domain);
