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
          "À la fin du XVIIIe siècle, la France traverse une crise profonde. Trois facteurs majeurs s'entremêlent : une dette publique colossale après les guerres, de mauvaises récoltes qui affament les campagnes, et des inégalités criantes entre les trois ordres.",
          "Les trois ordres, c'est : le clergé (environ 1% de la population), la noblesse (2%), et le tiers état — le reste, soit 97%. Et devine quoi ? C'est le tiers état qui paie presque tous les impôts.",
          "Les idées des Lumières (Voltaire, Rousseau, Montesquieu) circulent et remettent en cause le pouvoir absolu. Quand Louis XVI convoque les États généraux en mai 1789, il ouvre — sans le savoir — la porte à la Révolution.",
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
          "Le 14 juillet 1789, Paris bouillonne. Le roi vient de renvoyer Necker, un ministre populaire, et concentre des troupes autour de la capitale. La peur d'un coup de force royal monte d'un cran.",
          "Ce matin-là, des milliers de Parisiens prennent d'abord les Invalides pour récupérer des armes, puis marchent sur la Bastille — forteresse symbole de l'arbitraire royal, où le roi pouvait faire enfermer qui bon lui semblait.",
          "La forteresse tombe après quelques heures de combat. À l'intérieur, il n'y a que 7 prisonniers. Mais le symbole est immense. Le 14 juillet deviendra fête nationale française en 1880.",
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
          "Tour rapide de l'Europe. Les classiques d'abord : Paris pour la France, Berlin pour l'Allemagne, Madrid pour l'Espagne, Rome pour l'Italie.",
          "Moins évidentes parfois : Lisbonne au Portugal, Athènes en Grèce, Vienne en Autriche. Et Amsterdam aux Pays-Bas — même si le gouvernement siège à La Haye. Un piège classique en quiz !",
          "Au nord : Stockholm en Suède, Oslo en Norvège, Helsinki en Finlande, Copenhague au Danemark. Les capitales scandinaves.",
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
          "L'offre, c'est ce que les vendeurs veulent vendre à un prix donné. La demande, c'est ce que les acheteurs veulent acheter. Les deux se rencontrent sur un marché.",
          "Quand les deux s'équilibrent, on trouve le prix d'équilibre : celui où la quantité offerte est égale à la quantité demandée.",
          "Que se passe-t-il si la demande monte et que l'offre reste stable ? Les prix grimpent. C'est exactement ce qui s'est passé avec les masques chirurgicaux au début 2020.",
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
          "L'inflation, c'est la hausse générale et durable des prix. Pas une hausse ponctuelle sur un produit — une hausse qui touche tout, sur la durée.",
          "Effet direct sur toi : ton pouvoir d'achat baisse. Avec 100€, tu achètes moins de choses cette année que l'an dernier.",
          "Les banques centrales surveillent ça de près. Leur cible habituelle : maintenir l'inflation autour de 2% par an, en jouant sur les taux d'intérêt. Trop d'inflation => taux qui montent pour freiner l'économie.",
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
