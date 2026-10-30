import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, Trophy, TreePine, Sparkles, Award, RefreshCw, Volume2, 
  CheckCircle2, XCircle, AlertCircle, Play, ArrowRight, ChevronRight, 
  HelpCircle, BarChart3, Wifi, WifiOff, Target, Flame, Lightbulb, 
  RotateCcw, Zap, Brain, Compass, Star, GraduationCap, VolumeX, FastForward
} from 'lucide-react';

// ==========================================
// CONSTANTS & COLOR PALETTE
// ==========================================
const MIDNIGHT = '#282B4A';
const VANILLA = '#EEEBDA';

const TREE_STAGES = [
  { level: 1, name: 'Graine', minXp: 0, desc: 'Découverte et premières graines semées.' },
  { level: 2, name: 'Pousse', minXp: 150, desc: 'Acquisition des premières notions fondamentales.' },
  { level: 3, name: 'Jeune arbre', minXp: 400, desc: 'Compétences fondamentales en cours de consolidation.' },
  { level: 4, name: 'Arbre développé', minXp: 800, desc: 'Ancrage solide et compétences maîtrisées.' },
  { level: 5, name: 'Arbre florissant', minXp: 1400, desc: 'Connaissances consolidées et réutilisées avec succès.' },
  { level: 6, name: 'Arbre majestueux', minXp: 2200, desc: 'Maîtrise approfondie et autonomie remarquable !' }
];

const BADGES_DEFINITIONS = [
  { id: 'first_step', title: 'Première Étincelle', desc: 'Compléter ton tout premier exercice.', icon: '✨', reqXp: 15 },
  { id: 'math_hero', title: 'As du Calcul', desc: 'Obtenir 100 XP en Mathématiques.', icon: '📐', subject: 'Mathématiques', reqXp: 100 },
  { id: 'french_guru', title: 'Moustachu de Molière', desc: 'Obtenir 100 XP en Français.', icon: '✍️', subject: 'Français', reqXp: 100 },
  { id: 'polyglot', title: 'Explorateur Linguistique', desc: 'S\'entraîner en Anglais ou Allemand.', icon: '🌍', reqXp: 50 },
  { id: 'science_mind', title: 'Savant Fou', desc: 'Valider 5 exercices de Physique, Chimie ou SVT.', icon: '🧪', reqXp: 120 },
  { id: 'streaker', title: 'Régularité d\'Or', desc: 'Atteindre un niveau de persévérance élevé.', icon: '🔥', reqXp: 300 },
  { id: 'tree_grower', title: 'Main Verte', desc: 'Faire évoluer son arbre au niveau 3.', icon: '🌳', reqXp: 400 },
  { id: 'master_4eme', title: 'Génie de 4ème', desc: 'Atteindre le niveau 6 de l\'Arbre Majestueux.', icon: '👑', reqXp: 2200 }
];

// ==========================================
// COMPREHENSIVE CURRICULUM DATA (70 EXERCISES)
// ==========================================
const INITIAL_CURRICULUM = {
  Français: {
    id: 'Français',
    color: '#E63946',
    bgLight: '#FFE8E8',
    icon: '✍️',
    skills: [
      'Accords du participe passé',
      'Distinction Homophones (a/à, et/est, ou/où)',
      'Classes et fonctions grammaticales',
      'Temps du récit (Imparfait & Passé Simple)',
      'Analyse de texte et compréhension'
    ],
    exercises: [
      {
        id: 'fr_1',
        title: 'Accord du Participe Passé (Avoir)',
        type: 'qcm',
        level: 2,
        skill: 'Accords du participe passé',
        question: 'Choisissez la bonne forme : « Les pommes que j\'ai ______ sont délicieuses. »',
        options: ['mangé', 'mangée', 'mangés', 'mangées'],
        answer: 'mangées',
        hint: 'Le Complément d\'Objet Direct (que = les pommes) est placé AVANT le verbe avoir !',
        explanation: 'Quand le COD est placé avant le verbe "avoir", le participe passé s\'accorde en genre et en nombre avec ce COD (les pommes = féminin pluriel).'
      },
      {
        id: 'fr_2',
        title: 'Homophones a / à',
        type: 'qcm',
        level: 1,
        skill: 'Distinction Homophones (a/à, et/est, ou/où)',
        question: 'Remplacer correctement : « Précieux ___ décidé d\'aller ___ la bibliothèque. »',
        options: ['a / à', 'à / a', 'a / a', 'à / à'],
        answer: 'a / à',
        hint: 'Astuce : Essaie de remplacer par "avait". Si c\'est possible, c\'est le verbe "a" sans accent.',
        explanation: '« Précieux avait décidé » fonctionne (verbe avoir -> a). « aller avait la bibliothèque » ne veut rien dire, c\'est donc la préposition « à ».'
      },
      {
        id: 'fr_3',
        title: 'Classes Grammaticales',
        type: 'qcm',
        level: 2,
        skill: 'Classes et fonctions grammaticales',
        question: 'Quelle est la classe grammaticale du mot souligné dans : « Il marche *lentement*. »',
        options: ['Adjectif qualificatif', 'Adverbe', 'Nom commun', 'Verbe'],
        answer: 'Adverbe',
        hint: 'Le mot termine par -ment et modifie le sens du verbe marcher.',
        explanation: '« Lentement » est un adverbe de manière. Il est invariable et vient préciser comment s\'effectue l\'action.'
      },
      {
        id: 'fr_4',
        title: 'Temps du Récit',
        type: 'qcm',
        level: 3,
        skill: 'Temps du récit (Imparfait & Passé Simple)',
        question: 'Dans la phrase « Il dormait paisiblement quand soudain le téléphone sonna », quel temps exprime l\'action soudaine ?',
        options: ['L\'imparfait', 'Le présent', 'Le passé simple', 'Le plus-que-parfait'],
        answer: 'Le passé simple',
        hint: 'L\'imparfait décrit un arrière-plan durable, le passé simple exprime une action ponctuelle et soudaine.',
        explanation: 'Le passé simple (« sonna ») est utilisé pour une action de premier plan, ponctuelle et bien délimitée qui interrompt l\'arrière-plan à l\'imparfait.'
      },
      {
        id: 'fr_5',
        title: 'Homophones et / est',
        type: 'qcm',
        level: 1,
        skill: 'Distinction Homophones (a/à, et/est, ou/où)',
        question: 'Complétez : « Le chien ___ noir ___ très joueur. »',
        options: ['est / et', 'et / est', 'est / est', 'et / et'],
        answer: 'est / et',
        hint: 'Essaie de remplacer par "était" pour le premier mot, puis par "et puis" pour le second.',
        explanation: '« Le chien était noir et puis très joueur » -> Le 1er est le verbe être ("est"), le 2e est la conjonction de coordination ("et").'
      },
      {
        id: 'fr_6',
        title: 'Fonction Syntaxe - COD',
        type: 'qcm',
        level: 3,
        skill: 'Classes et fonctions grammaticales',
        question: 'Quelle est la fonction de "son cahier" dans : "Précieux ouvre son cahier" ?',
        options: ['Sujet', 'Complément d\'objet direct (COD)', 'Complément d\'objet indirect (COI)', 'Attribut du sujet'],
        answer: 'Complément d\'objet direct (COD)',
        hint: 'Pose la question : Précieux ouvre quoi ?',
        explanation: 'Le groupe "son cahier" répond directement à la question "Précieux ouvre quoi ?" sans préposition. C\'est un COD.'
      },
      {
        id: 'fr_7',
        title: 'Passé Simple de l\'Indicatif',
        type: 'qcm',
        level: 3,
        skill: 'Temps du récit (Imparfait & Passé Simple)',
        question: 'Quelle est la forme correcte au passé simple : « Ils (prendre) le train de 8h. »',
        options: ['Ils prenaient', 'Ils prirent', 'Ils prendront', 'Ils prissent'],
        answer: 'Ils prirent',
        hint: 'Au passé simple, pour le verbe prendre avec "ils", la terminaison est -irent.',
        explanation: 'Le verbe prendre au passé simple donne : je pris, tu pris, il prit, nous prîmes, vous prîtes, ils prirent.'
      },
      {
        id: 'fr_8',
        title: 'Pluriel des Noms en -al',
        type: 'qcm',
        level: 2,
        skill: 'Accords du participe passé',
        question: 'Quel est le pluriel correct du mot « journal » ?',
        options: ['Journals', 'Journaux', 'Journales', 'Journau'],
        answer: 'Journaux',
        hint: 'Les noms masculins en -al font généralement leur pluriel en -aux.',
        explanation: 'Un journal -> des journaux. Exception faite pour bal, carnaval, festival, chacal, etc., qui prennent un -s.'
      },
      {
        id: 'fr_9',
        title: 'Figures de Style - La Métaphore',
        type: 'qcm',
        level: 4,
        skill: 'Analyse de texte et compréhension',
        question: 'Dans la phrase « Cet homme est un lion au combat », quelle figure de style est utilisée ?',
        options: ['Une comparaison', 'Une métaphore', 'Une personnification', 'Une hyperbole'],
        answer: 'Une métaphore',
        hint: 'On compare deux éléments directement sans utiliser d\'outil de comparaison (comme "comme" ou "tel que").',
        explanation: 'C\'est une métaphore car l\'analogie entre l\'homme et le lion est faite sans mot outil de comparaison.'
      },
      {
        id: 'fr_10',
        title: 'Pronom Personnel Complément',
        type: 'qcm',
        level: 2,
        skill: 'Classes et fonctions grammaticales',
        question: 'Dans « Je *lui* parle », quelle est la fonction du pronom « lui » ?',
        options: ['COD', 'COI', 'Sujet', 'Complément circonstanciel'],
        answer: 'COI',
        hint: 'Pose la question : Je parle À qui ?',
        explanation: 'Le pronom "lui" remplace "à cette personne". Répondant à la question "à qui ?", il s\'agit d\'un COI (Complément d\'Objet Indirect).'
      }
    ]
  },
  Mathématiques: {
    id: 'Mathématiques',
    color: '#2A9D8F',
    bgLight: '#E6F4F1',
    icon: '📐',
    skills: [
      'Calcul avec Nombres Relatifs',
      'Opérations sur les Fractions',
      'Proportionnalité & Pourcentages',
      'Calcul Littéral (Développement simple)',
      'Équations du 1er degré'
    ],
    exercises: [
      {
        id: 'math_1',
        title: 'Addition de Nombres Relatifs',
        type: 'qcm',
        level: 1,
        skill: 'Calcul avec Nombres Relatifs',
        question: 'Quel est le résultat de : (-7) + (+4) ?',
        options: ['-11', '-3', '+3', '+11'],
        answer: '-3',
        hint: 'Les deux nombres ont des signes différents. Garde le signe du plus grand en valeur absolue (7) et soustrais les distances.',
        explanation: '7 est plus grand que 4, le résultat est donc négatif. 7 - 4 = 3, donc (-7) + (+4) = -3.'
      },
      {
        id: 'math_2',
        title: 'Multiplication de Nombres Relatifs',
        type: 'qcm',
        level: 2,
        skill: 'Calcul avec Nombres Relatifs',
        question: 'Calcule le produit : (-5) × (-6)',
        options: ['-30', '+30', '-11', '+11'],
        answer: '+30',
        hint: 'Règle des signes : le produit de deux nombres de même signe est TOUJOURS positif !',
        explanation: 'Moins par moins donne plus. 5 × 6 = 30, donc (-5) × (-6) = +30.'
      },
      {
        id: 'math_3',
        title: 'Somme de Fractions de même dénominateur',
        type: 'qcm',
        level: 2,
        skill: 'Opérations sur les Fractions',
        question: 'Calcule : 3/8 + 2/8',
        options: ['5/16', '5/8', '6/8', '1/8'],
        answer: '5/8',
        hint: 'Lorsque le dénominateur est le même, on additionne uniquement les numérateurs.',
        explanation: '3/8 + 2/8 = (3+2)/8 = 5/8. Le dénominateur commun (8) ne change pas !'
      },
      {
        id: 'math_4',
        title: 'Calcul de Pourcentage simple',
        type: 'qcm',
        level: 2,
        skill: 'Proportionnalité & Pourcentages',
        question: 'Combien font 20% de 50 FCFA ?',
        options: ['5 FCFA', '10 FCFA', '15 FCFA', '20 FCFA'],
        answer: '10 FCFA',
        hint: 'Prendre 20%, c\'est multiplier par 20 puis diviser par 100 (ou diviser par 5).',
        explanation: '(20 × 50) / 100 = 1000 / 100 = 10 FCFA.'
      },
      {
        id: 'math_5',
        title: 'Développement d\'une Expression',
        type: 'qcm',
        level: 3,
        skill: 'Calcul Littéral (Développement simple)',
        question: 'Développe l\'expression : 3(x + 4)',
        options: ['3x + 4', '3x + 12', '7x', '12x'],
        answer: '3x + 12',
        hint: 'Distribue le multiplicateur 3 sur chacun des termes à l\'intérieur de la parenthèse : 3×x et 3×4.',
        explanation: '3 × (x + 4) = (3 × x) + (3 × 4) = 3x + 12. C\'est la distributivité.'
      },
      {
        id: 'math_6',
        title: 'Résolution d\'Équation simple',
        type: 'qcm',
        level: 3,
        skill: 'Équations du 1er degré',
        question: 'Résous l\'équation : x + 7 = 15. Quelle est la valeur de x ?',
        options: ['x = 22', 'x = 8', 'x = -8', 'x = 105'],
        answer: 'x = 8',
        hint: 'Isole x en soustrayant 7 des deux côtés de l\'égalité.',
        explanation: 'x = 15 - 7 => x = 8. Vérification : 8 + 7 = 15.'
      },
      {
        id: 'math_7',
        title: 'Priorités Opératoires',
        type: 'qcm',
        level: 2,
        skill: 'Calcul avec Nombres Relatifs',
        question: 'Calcule : 10 - 2 × 3',
        options: ['24', '4', '16', '-4'],
        answer: '4',
        hint: 'La multiplication est PRIORITAIRE sur la soustraction !',
        explanation: 'On effectue d\'abord la multiplication : 2 × 3 = 6. Puis 10 - 6 = 4.'
      },
      {
        id: 'math_8',
        title: 'Multiplication de Fractions',
        type: 'qcm',
        level: 3,
        skill: 'Opérations sur les Fractions',
        question: 'Calcule le produit : (2/3) × (5/7)',
        options: ['10/21', '7/10', '10/7', '14/15'],
        answer: '10/21',
        hint: 'Pour multiplier deux fractions, on multiplie les numérateurs entre eux et les dénominateurs entre eux.',
        explanation: '(2 × 5) / (3 × 7) = 10 / 21.'
      },
      {
        id: 'math_9',
        title: 'Réduction d\'Expression Littérale',
        type: 'qcm',
        level: 3,
        skill: 'Calcul Littéral (Développement simple)',
        question: 'Simplifie l\'expression : 4x + 5 + 2x - 3',
        options: ['6x + 2', '8x', '6x + 8', '11x'],
        answer: '6x + 2',
        hint: 'Regroupe les termes en x ensemble (4x + 2x) et les termes constants ensemble (5 - 3).',
        explanation: '(4x + 2x) + (5 - 3) = 6x + 2.'
      },
      {
        id: 'math_10',
        title: 'Théorème de Pythagore (Calcul d\'hypoténuse)',
        type: 'qcm',
        level: 4,
        skill: 'Équations du 1er degré',
        question: 'Soit un triangle rectangle dont les côtés de l\'angle droit mesurent 3 cm et 4 cm. Combien mesure l\'hypoténuse ?',
        options: ['5 cm', '7 cm', '25 cm', '12 cm'],
        answer: '5 cm',
        hint: 'Utilise la formule h² = a² + b², puis cherche la racine carrée.',
        explanation: 'h² = 3² + 4² = 9 + 16 = 25. La racine carrée de 25 est 5 cm.'
      }
    ]
  },
  Physique: {
    id: 'Physique',
    color: '#E9C46A',
    bgLight: '#FFF9E6',
    icon: '⚡',
    skills: [
      'Conversions et Unités SI',
      'Circuit Électrique & Intensité',
      'Loi d\'Ohm (U = R x I)',
      'Calculs de Vitesse (v = d/t)',
      'Formes et Transferts d\'Énergie'
    ],
    exercises: [
      {
        id: 'phy_1',
        title: 'Unité de la Tension Électrique',
        type: 'qcm',
        level: 1,
        skill: 'Circuit Électrique & Intensité',
        question: 'Dans le Système International, quelle est l\'unité de la tension électrique ?',
        options: ['L\'Ampère (A)', 'Le Volt (V)', 'L\'Ohm (Ω)', 'Le Watt (W)'],
        answer: 'Le Volt (V)',
        hint: 'Elle se mesure avec un voltmètre.',
        explanation: 'La tension électrique s\'exprime en Volts (V). L\'Ampère mesure l\'intensité et l\'Ohm mesure la résistance.'
      },
      {
        id: 'phy_2',
        title: 'Calcul de Vitesse moyenne',
        type: 'qcm',
        level: 2,
        skill: 'Calculs de Vitesse (v = d/t)',
        question: 'Un véhicule parcourt 150 km en 2 heures. Quelle est sa vitesse moyenne ?',
        options: ['75 km/h', '300 km/h', '100 km/h', '50 km/h'],
        answer: '75 km/h',
        hint: 'Formule : v = d / t. Divise la distance par la durée.',
        explanation: 'v = 150 km / 2 h = 75 km/h.'
      },
      {
        id: 'phy_3',
        title: 'Loi d\'Ohm',
        type: 'qcm',
        level: 3,
        skill: 'Loi d\'Ohm (U = R x I)',
        question: 'Selon la loi d\'Ohm, quelle est la formule correcte relient Tension U, Résistance R et Intensité I ?',
        options: ['U = R / I', 'U = R × I', 'U = R + I', 'R = U × I'],
        answer: 'U = R × I',
        hint: 'La tension aux bornes d\'un conducteur ohmique est proportionnelle à l\'intensité du courant qui le traverse.',
        explanation: 'La formule fondamentale est U = R × I, où U est en volts, R en ohms et I en ampères.'
      },
      {
        id: 'phy_4',
        title: 'Conversion de Masse volumique / Distance',
        type: 'qcm',
        level: 1,
        skill: 'Conversions et Unités SI',
        question: 'Combien de mètres représentent 2,5 kilomètres ?',
        options: ['250 m', '2 500 m', '25 000 m', '0,25 m'],
        answer: '2 500 m',
        hint: '1 km = 1 000 mètres. Multiplie par 1 000.',
        explanation: '2,5 × 1 000 = 2 500 mètres.'
      },
      {
        id: 'phy_5',
        title: 'Branchement de l\'Ampèremètre',
        type: 'qcm',
        level: 2,
        skill: 'Circuit Électrique & Intensité',
        question: 'Comment doit-on brancher un ampèremètre dans un circuit électrique ?',
        options: ['En série', 'En dérivation (parallèle)', 'Peut importe', 'En diagonale'],
        answer: 'En série',
        hint: 'Le courant doit traverser l\'appareil pour qu\'il puisse compter le débit d\'électrons.',
        explanation: 'Un ampèremètre s\'insère toujours en SÉRIE dans la boucle. Le voltmètre, lui, se branche en dérivation.'
      },
      {
        id: 'phy_6',
        title: 'Calcul de Tension (Loi d\'Ohm)',
        type: 'qcm',
        level: 3,
        skill: 'Loi d\'Ohm (U = R x I)',
        question: 'Un résistor de 10 Ω est traversé par un courant de 0,5 A. Quelle est la tension à ses bornes ?',
        options: ['5 V', '20 V', '10,5 V', '2,5 V'],
        answer: '5 V',
        hint: 'Utilise U = R × I.',
        explanation: 'U = 10 Ω × 0,5 A = 5 Volts.'
      },
      {
        id: 'phy_7',
        title: 'Calcul de Temps de Parcours',
        type: 'qcm',
        level: 3,
        skill: 'Calculs de Vitesse (v = d/t)',
        question: 'Un piéton marche à 5 km/h. Combien de temps mettra-t-il pour parcourir 10 km ?',
        options: ['1 heure', '2 heures', '30 minutes', '5 heures'],
        answer: '2 heures',
        hint: 'Formule : t = d / v.',
        explanation: 't = 10 km / 5 km/h = 2 heures.'
      },
      {
        id: 'phy_8',
        title: 'Source d\'Énergie Renouvelable',
        type: 'qcm',
        level: 1,
        skill: 'Formes et Transferts d\'Énergie',
        question: 'Laquelle de ces sources d\'énergie est considérée comme renouvelable ?',
        options: ['Le pétrole', 'Le charbon', 'L\'énergie solaire', 'Le gaz naturel'],
        answer: 'L\'énergie solaire',
        hint: 'Une énergie renouvelable se régénère naturellement à l\'échelle humaine.',
        explanation: 'Le soleil, le vent et l\'eau sont des sources inépuisables, contrairement aux combustibles fossiles.'
      },
      {
        id: 'phy_9',
        title: 'Circuit en Série et Panne',
        type: 'qcm',
        level: 2,
        skill: 'Circuit Électrique & Intensité',
        question: 'Dans un circuit en SÉRIE comportant deux lampes, si l\'une des lampes grille, que se passe-t-il ?',
        options: ['L\'autre lampe brille plus fort', 'L\'autre lampe s\'éteint', 'Rien ne change', 'Le circuit explose'],
        answer: 'L\'autre lampe s\'éteint',
        hint: 'Dans un circuit en série, il n\'y a qu\'une seule boucle de courant.',
        explanation: 'Si une lampe grille, la boucle est ouverte et le courant ne circule plus du tout. L\'autre lampe s\'éteint.'
      },
      {
        id: 'phy_10',
        title: 'Unité de la Puissance Électrique',
        type: 'qcm',
        level: 2,
        skill: 'Formes et Transferts d\'Énergie',
        question: 'Quelle est l\'unité de mesure de la puissance électrique d\'un appareil ?',
        options: ['Le Joule', 'Le Watt (W)', 'Le Volt', 'Le Kilowatt-heure'],
        answer: 'Le Watt (W)',
        hint: 'Regarde les étiquettes des ampoules ou des appareils ménagers.',
        explanation: 'La puissance électrique s\'exprime en Watts (W). L\'énergie consommée s\'exprime en Joules ou en kWh.'
      }
    ]
  },
  Chimie: {
    id: 'Chimie',
    color: '#F4A261',
    bgLight: '#FDF0E6',
    icon: '🧪',
    skills: [
      'États de la matière & Changements',
      'Corps purs et Mélanges',
      'Composition de l\'Air',
      'Atomes, Molécules & Symboles',
      'Réactions chimiques simples'
    ],
    exercises: [
      {
        id: 'chi_1',
        title: 'Changement d\'état : Solide vers Liquide',
        type: 'qcm',
        level: 1,
        skill: 'États de la matière & Changements',
        question: 'Comment s\'appelle le passage de l\'état solide à l\'état liquide ?',
        options: ['La solidification', 'La fusion', 'La vaporisation', 'La condensation'],
        answer: 'La fusion',
        hint: 'Pense à la glace qui fond sous le soleil.',
        explanation: 'La fusion est le passage de l\'état solide à l\'état liquide (ex: la glace qui devient eau).'
      },
      {
        id: 'chi_2',
        title: 'Composition de l\'Air',
        type: 'qcm',
        level: 2,
        skill: 'Composition de l\'Air',
        question: 'Quels sont les deux gaz principaux composant l\'air et leurs proportions approximatives ?',
        options: ['50% Oxygène / 50% Azote', '80% Dioxygène / 20% Diazote', '80% Diazote / 20% Dioxygène', '100% Dioxygène'],
        answer: '80% Diazote / 20% Dioxygène',
        hint: 'L\'azote est largement majoritaire (~78-80%) par rapport à l\'oxygène (~20-21%).',
        explanation: 'L\'air atmosphérique est constitué à environ 78-80% de Diazote (N2) et 20-21% de Dioxygène (O2).'
      },
      {
        id: 'chi_3',
        title: 'Symbole Chimique de l\'Oxygène',
        type: 'qcm',
        level: 1,
        skill: 'Atomes, Molécules & Symboles',
        question: 'Quel est le symbole atomique de l\'élément Oxygène ?',
        options: ['Ox', 'O', 'C', 'H'],
        answer: 'O',
        hint: 'C\'est la première lettre majuscule de son nom.',
        explanation: 'L\'atome d\'oxygène se note O. Carbon est C, Hydrogène est H.'
      },
      {
        id: 'chi_4',
        title: 'Mélange Homogène vs Hétérogène',
        type: 'qcm',
        level: 2,
        skill: 'Corps purs et Mélanges',
        question: 'Un mélange dans lequel on ne distingue qu\'une seule phase à l\'œil nu (ex: eau + sel dissous) est dit :',
        options: ['Hétérogène', 'Homogène', 'Pur', 'Gazeux'],
        answer: 'Homogène',
        hint: 'Homogène signifie identique sur toute l\'étendue.',
        explanation: 'Un mélange est homogène lorsqu\'on ne peut pas distinguer ses constituants à l\'œil nu après agitation.'
      },
      {
        id: 'chi_5',
        title: 'Formule Chimique de l\'Eau',
        type: 'qcm',
        level: 1,
        skill: 'Atomes, Molécules & Symboles',
        question: 'Quelle est la formule de la molécule d\'eau ?',
        options: ['CO2', 'H2O', 'NaCl', 'O2'],
        answer: 'H2O',
        hint: 'Elle contient 2 atomes d\'hydrogène et 1 atome d\'oxygène.',
        explanation: 'H2O : 2 atomes d\'Hydrogène liés à 1 atome d\'Oxygène.'
      },
      {
        id: 'chi_6',
        title: 'Test d\'identification du Dioxyde de Carbone',
        type: 'qcm',
        level: 3,
        skill: 'Réactions chimiques simples',
        question: 'Quel réactif permet d\'identifier la présence de dioxyde de carbone (CO2) ?',
        options: ['L\'eau de chaux', 'Le sulfate de cuivre anhydre', 'La liqueur de Fehling', 'Une bûchette enflammée'],
        answer: 'L\'eau de chaux',
        hint: 'Ce liquide limpide se trouble (devient laiteux) en présence de CO2.',
        explanation: 'L\'eau de chaux se trouble en devenant blanchâtre lorsqu\'elle réagit avec le dioxyde de carbone.'
      },
      {
        id: 'chi_7',
        title: 'Vaporisation vs Ébullition',
        type: 'qcm',
        level: 2,
        skill: 'États de la matière & Changements',
        question: 'Comment s\'appelle le passage rapide de l\'eau liquide en vapeur à 100°C avec formation de bulles ?',
        options: ['L\'évaporation', 'L\'ébullition', 'La sublimation', 'La condensation'],
        answer: 'L\'ébullition',
        hint: 'C\'est une vaporisation tumultueuse au sein de tout le liquide.',
        explanation: 'L\'ébullition est la vaporisation rapide sous l\'effet de la chaleur avec apparition de bulles dans la masse du liquide.'
      },
      {
        id: 'chi_8',
        title: 'Conservation de la Masse',
        type: 'qcm',
        level: 3,
        skill: 'Réactions chimiques simples',
        question: 'Lors d\'une réaction chimique, la masse totale des réactifs est :',
        options: ['Inférieure à la masse des produits', 'Égale à la masse des produits', 'Supérieure à la masse des produits', 'Aléatoire'],
        answer: 'Égale à la masse des produits',
        hint: 'Souviens-toi de la phrase de Lavoisier : « Rien ne se perd, rien ne se crée, tout se transforme. »',
        explanation: 'Principe de Lavoisier : lors de toute transformation chimique, la masse totale se conserve strictement.'
      },
      {
        id: 'chi_9',
        title: 'Formule du Dioxyde de Carbone',
        type: 'qcm',
        level: 1,
        skill: 'Atomes, Molécules & Symboles',
        question: 'Quelle est la formule chimique du dioxyde de carbone ?',
        options: ['CO', 'CO2', 'O2', 'C2O'],
        answer: 'CO2',
        hint: '"Di" signifie deux atomes d\'oxygène.',
        explanation: 'CO2 indique 1 atome de Carbone et 2 atomes d\'Oxygène.'
      },
      {
        id: 'chi_10',
        title: 'Séparation de mélanges (Filtration)',
        type: 'qcm',
        level: 2,
        skill: 'Corps purs et Mélanges',
        question: 'Quelle technique permet de séparer les constituants solides d\'un mélange hétérogène liquide/solide ?',
        options: ['La distillation', 'La filtration', 'La chromatographie', 'La fusion'],
        answer: 'La filtration',
        hint: 'On utilise du papier filtre pour retenir les particules solides.',
        explanation: 'La filtration retient les particules solides en suspension et laisse passer le filtrat liquide.'
      }
    ]
  },
  SVT: {
    id: 'SVT',
    color: '#2A9D8F',
    bgLight: '#E8F6F3',
    icon: '🌿',
    skills: [
      'Digestion & Nutriments',
      'Respiration & Échanges Gazeux',
      'Tectonique des plaques & Séismes',
      'Reproduction humaine & Puberté',
      'Écosystèmes & Chaînes alimentaires'
    ],
    exercises: [
      {
        id: 'svt_1',
        title: 'Organe de l\'Absorption Intestinale',
        type: 'qcm',
        level: 2,
        skill: 'Digestion & Nutriments',
        question: 'Dans quel organe de l\'appareil digestif s\'effectue la majeure partie de l\'absorption des nutriments vers le sang ?',
        options: ['L\'estomac', 'L\'œsophage', 'L\'intestin grêle', 'Le gros intestin'],
        answer: 'L\'intestin grêle',
        hint: 'Ses nombreuses villosités offrent une surface d\'échange gigantesque.',
        explanation: 'L\'intestin grêle possède des millions de villosités très vascularisées permettant le passage des nutriments transformés dans le sang.'
      },
      {
        id: 'svt_2',
        title: 'Lieu des Échanges Gazeux Pulmonaires',
        type: 'qcm',
        level: 2,
        skill: 'Respiration & Échanges Gazeux',
        question: 'Au niveau de quelles structures microscopiques des poumons le dioxygène passe-t-il dans le sang ?',
        options: ['Les bronchioles', 'Les alvéoles pulmonaires', 'La trachée', 'Les bronches'],
        answer: 'Les alvéoles pulmonaires',
        hint: 'Ce sont de petits sacs d\'air entourés de capillaires sanguins.',
        explanation: 'Les alvéoles pulmonaires sont le lieu d\'échange entre l\'air inspiré et le sang : le dioxygène entre, le CO2 sort.'
      },
      {
        id: 'svt_3',
        title: 'Origine des Séismes',
        type: 'qcm',
        level: 3,
        skill: 'Tectonique des plaques & Séismes',
        question: 'Quel est le point de rupture en profondeur de la roche d\'où partent les ondes sismiques ?',
        options: ['L\'épicentre', 'Le foyer (ou hypocentre)', 'Le cratère', 'La faille visible'],
        answer: 'Le foyer (ou hypocentre)',
        hint: 'L\'épicentre est à la surface, la rupture initiale a lieu en profondeur au...',
        explanation: 'Le foyer est l\'endroit en profondeur où se produit la rupture des roches. L\'épicentre est le point à la surface situé à la verticale du foyer.'
      },
      {
        id: 'svt_4',
        title: 'Premier Maillon d\'une Chaîne Alimentaire',
        type: 'qcm',
        level: 1,
        skill: 'Écosystèmes & Chaînes alimentaires',
        question: 'Quel est toujours le premier maillon d\'une chaîne alimentaire terrestre ?',
        options: ['Un carnivore', 'Un décomposeur', 'Un végétal vert (producteur primaire)', 'Un herbivore'],
        answer: 'Un végétal vert (producteur primaire)',
        hint: 'Il fabrique sa propre matière organique grâce à la lumière du soleil (photosynthèse).',
        explanation: 'Les plantes chlorophylliennes sont les producteurs primaires à la base de toutes les chaînes alimentaires.'
      },
      {
        id: 'svt_5',
        title: 'Rôle des Enzymes Digestives',
        type: 'qcm',
        level: 3,
        skill: 'Digestion & Nutriments',
        question: 'Quel est le rôle des enzymes contenues dans les sucs digestifs ?',
        options: ['Broyer mécaniquement les aliments', 'Découper chimiquement les aliments en nutriments', 'Transporter le sang', 'Neutraliser les acides'],
        answer: 'Découper chimiquement les aliments en nutriments',
        hint: 'On les compare à des "ciseaux chimiques" microscopiques.',
        explanation: 'Les enzymes hydrolysent (découpent) les grandes molécules alimentaires complexes en petites molécules assimilables : les nutriments.'
      },
      {
        id: 'svt_6',
        title: 'Définition de l\'Épicentre',
        type: 'qcm',
        level: 2,
        skill: 'Tectonique des plaques & Séismes',
        question: 'Qu\'est-ce que l\'épicentre d\'un séisme ?',
        options: ['Le lieu exact sous terre où la roche casse', 'La zone en surface où l\'intensité du séisme est la plus forte', 'L\'appareil de mesure des secousses', 'L\'échelle de magnitude'],
        answer: 'La zone en surface où l\'intensité du séisme est la plus forte',
        hint: 'C\'est le point situé à la verticale du foyer à la surface terrestre.',
        explanation: 'L\'épicentre se situe à la surface du sol, juste au-dessus du foyer. C\'est là que les secousses sont le plus violemment ressenties.'
      },
      {
        id: 'svt_7',
        title: 'Production des Cellules Reproductrices Mâles',
        type: 'qcm',
        level: 1,
        skill: 'Reproduction humaine & Puberté',
        question: 'Où sont produits les spermatozoïdes chez l\'homme ?',
        options: ['Dans la prostate', 'Dans les testicules', 'Dans la vessie', 'Dans l\'épididyme'],
        answer: 'Dans les testicules',
        hint: 'Ce sont les gonades masculines activées à la puberté.',
        explanation: 'Les testicules produisent en continu des spermatozoïdes à partir de la puberté.'
      },
      {
        id: 'svt_8',
        title: 'Décomposeurs du Sol',
        type: 'qcm',
        level: 2,
        skill: 'Écosystèmes & Chaînes alimentaires',
        question: 'Quel rôle jouent les vers de terre, champignons et bactéries du sol ?',
        options: ['Producteurs primaires', 'Décomposeurs de matière organique', 'Consommateurs secondaires', 'Super-prédateurs'],
        answer: 'Décomposeurs de matière organique',
        hint: 'Ils recyclent la matière organique morte (feuilles, cadavres) en minéraux.',
        explanation: 'Les décomposeurs dégradent les restes d\'êtres vivants et restituent au sol des sels minéraux indispensables aux plantes.'
      },
      {
        id: 'svt_9',
        title: 'Phénomène de la Photosynthèse',
        type: 'qcm',
        level: 3,
        skill: 'Écosystèmes & Chaînes alimentaires',
        question: 'Quel gaz le végétal vert absorbe-t-il à la lumière pour fabriquer sa matière ?',
        options: ['Le dioxygène', 'Le dioxyde de carbone (CO2)', 'L\'azote', 'Le méthane'],
        answer: 'Le dioxyde de carbone (CO2)',
        hint: 'Il rejette ensuite du dioxygène dans l\'atmosphère.',
        explanation: 'Sous l\'effet de la lumière, les plantes vertes absorbent du CO2 et de l\'eau pour réaliser la photosynthèse et libérer de l\'O2.'
      },
      {
        id: 'svt_10',
        title: 'Règles et Cycle Féminin',
        type: 'qcm',
        level: 2,
        skill: 'Reproduction humaine & Puberté',
        question: 'À quoi correspondent les règles (menstruations) chez la femme ?',
        options: ['À la destruction de l\'ovaire', 'À l\'élimination de la couche superficielle de la muqueuse utérine', 'À une infection urinaire', 'À la libération de l\'ovule'],
        answer: 'À l\'élimination de la couche superficielle de la muqueuse utérine',
        hint: 'S\'il n\'y a pas eu de fécondation, l\'utérus se réinitialise pour le cycle suivant.',
        explanation: 'En l\'absence de grossesse, la couche interne de l\'utérus (endomètre) préparée pour accueillir un embryon se détache : ce sont les règles.'
      }
    ]
  },
  Anglais: {
    id: 'Anglais',
    color: '#E76F51',
    bgLight: '#FDECE8',
    icon: '🇬🇧',
    skills: [
      'Present Simple vs Present Continuous',
      'Auxiliaires (Be, Have, Do)',
      'Preterit & Verbes Irréguliers',
      'Vocabulaire Thématique (School, House, Hobbies)',
      'Questions & Interrogations'
    ],
    exercises: [
      {
        id: 'ang_1',
        title: 'Present Simple - Habitual Actions',
        type: 'qcm',
        level: 1,
        skill: 'Present Simple vs Present Continuous',
        question: 'Choose the correct form: « She ______ to school every morning. »',
        options: ['go', 'goes', 'is going', 'went'],
        answer: 'goes',
        hint: 'With "He/She/It" in Present Simple, don\'t forget to add -s or -es !',
        explanation: 'Pour exprimer une habitude avec He/She/It au présent simple, on ajoute -es au verbe "go" -> "goes".'
      },
      {
        id: 'ang_2',
        title: 'Preterit of Irregular Verbs (BE)',
        type: 'qcm',
        level: 2,
        skill: 'Preterit & Verbes Irréguliers',
        question: 'Complete with the past form: « Yesterday, we ______ at the park. »',
        options: ['are', 'were', 'was', 'been'],
        answer: 'were',
        hint: 'At the preterit, BE becomes "was" for I/He/She/It and "were" for We/You/They.',
        explanation: 'Au prétérit, le verbe "to be" avec la personne "We" s\'écrit "were".'
      },
      {
        id: 'ang_3',
        title: 'Auxiliary in Questions',
        type: 'qcm',
        level: 2,
        skill: 'Questions & Interrogations',
        question: 'Find the correct question formulation: « ______ you like English history? »',
        options: ['Do', 'Are', 'Is', 'Have'],
        answer: 'Do',
        hint: 'Use the auxiliary DO for questions in Present Simple with action verbs.',
        explanation: 'Pour poser une question au présent simple avec un verbe ordinaire comme "like", on utilise l\'auxiliaire DO.'
      },
      {
        id: 'ang_4',
        title: 'Present Continuous - Action right now',
        type: 'qcm',
        level: 2,
        skill: 'Present Simple vs Present Continuous',
        question: 'Look! Precious ______ a book right now.',
        options: ['reads', 'is reading', 'read', 'was reading'],
        answer: 'is reading',
        hint: 'Action in progress at the present moment -> BE + Verbe-ING.',
        explanation: 'Pour une action en train de se dérouler au moment où l\'on parle, on utilise BE au présent + V-ING : "is reading".'
      },
      {
        id: 'ang_5',
        title: 'Vocabulary - House & Rooms',
        type: 'qcm',
        level: 1,
        skill: 'Vocabulaire Thématique (School, House, Hobbies)',
        question: 'Where do you prepare food in a house?',
        options: ['In the bedroom', 'In the bathroom', 'In the kitchen', 'In the garden'],
        answer: 'In the kitchen',
        hint: 'Kitchen = Cuisine.',
        explanation: 'The kitchen is the room where you cook meals.'
      },
      {
        id: 'ang_6',
        title: 'Irregular Verbs - To Go',
        type: 'qcm',
        level: 2,
        skill: 'Preterit & Verbes Irréguliers',
        question: 'What is the past simple (preterit) of the verb "to go"?',
        options: ['Goed', 'Went', 'Gone', 'Going'],
        answer: 'Went',
        hint: 'It is a very famous irregular verb starting with W.',
        explanation: 'To go est un verbe irrégulier : Go -> Went -> Gone. Le prétérit est "went".'
      },
      {
        id: 'ang_7',
        title: 'Possessive Adjectives',
        type: 'qcm',
        level: 1,
        skill: 'Auxiliaires (Be, Have, Do)',
        question: 'This is my sister. ______ name is Sarah.',
        options: ['His', 'Her', 'Its', 'Their'],
        answer: 'Her',
        hint: 'For a female person (sister), use HER.',
        explanation: 'En anglais, l\'adjectif possessif s\'accorde avec le possesseur : sister (féminin) -> Her name.'
      },
      {
        id: 'ang_8',
        title: 'Plural Nouns (Irregular)',
        type: 'qcm',
        level: 2,
        skill: 'Vocabulaire Thématique (School, House, Hobbies)',
        question: 'What is the plural of "child"?',
        options: ['Childs', 'Children', 'Childrens', 'Childes'],
        answer: 'Children',
        hint: 'It is an irregular plural.',
        explanation: 'One child -> many children. Il n\'y a jamais de "s" à children !'
      },
      {
        id: 'ang_9',
        title: 'Formulating Questions with WH- words',
        type: 'qcm',
        level: 3,
        skill: 'Questions & Interrogations',
        question: '______ is your birthday? - It is in May.',
        options: ['Where', 'When', 'Why', 'Who'],
        answer: 'When',
        hint: 'Which question word asks about TIME or DATE?',
        explanation: 'When = Quand (interroge sur une date/moment). Where = Où, Why = Pourquoi, Who = Qui.'
      },
      {
        id: 'ang_10',
        title: 'Prepositions of Time (In, On, At)',
        type: 'qcm',
        level: 3,
        skill: 'Vocabulaire Thématique (School, House, Hobbies)',
        question: 'Choose the correct preposition: « I will meet you ______ 8 o\'clock. »',
        options: ['in', 'on', 'at', 'for'],
        answer: 'at',
        hint: 'For precise hours/times, use AT.',
        explanation: 'On utilise "AT" devant les heures précises (at 8 o\'clock, at noon).'
      }
    ]
  },
  Allemand: {
    id: 'Allemand',
    color: '#264653',
    bgLight: '#E5ECF0',
    icon: '🇩🇪',
    skills: [
      'Articles & Genres (der, die, das)',
      'Conjugaison des Verbes au Présent',
      'Verbes Auxiliaires (sein, haben)',
      'Nombres & Salutations',
      'Cas de base (Nominatif & Accusatif)'
    ],
    exercises: [
      {
        id: 'all_1',
        title: 'Genre des Mots (Der, Die, Das)',
        type: 'qcm',
        level: 1,
        skill: 'Articles & Genres (der, die, das)',
        question: 'Quel est l\'article défini correct pour le mot « Tisch » (table) ?',
        options: ['der', 'die', 'das', 'den'],
        answer: 'der',
        hint: 'Table est masculin en allemand !',
        explanation: 'En allemand, le mot "Tisch" est du genre masculin : "der Tisch".'
      },
      {
        id: 'all_2',
        title: 'Conjugaison du Verbe SEIN (être)',
        type: 'qcm',
        level: 1,
        skill: 'Verbes Auxiliaires (sein, haben)',
        question: 'Complétez : « Ich ______ Schüler in der 4. Klasse. »',
        options: ['bist', 'ist', 'bin', 'sind'],
        answer: 'bin',
        hint: 'Je suis = Ich bin.',
        explanation: 'Conjugaison de sein au présent : ich bin, du bist, er/sie/es ist, wir sind...'
      },
      {
        id: 'all_3',
        title: 'Présent des Verbes Réguliers',
        type: 'qcm',
        level: 2,
        skill: 'Conjugaison des Verbes au Présent',
        question: 'Conjuguez le verbe « lernen » : « Du ______ Deutsch. »',
        options: ['lernen', 'lernt', 'lernst', 'lerne'],
        answer: 'lernst',
        hint: 'Avec le pronom "du", la terminaison est toujours -st !',
        explanation: 'Au présent régulier avec DU, la terminaison est -st : du lernst.'
      },
      {
        id: 'all_4',
        title: 'Les Chiffres en Allemand',
        type: 'qcm',
        level: 1,
        skill: 'Nombres & Salutations',
        question: 'Comment dit-on le nombre « 12 » en allemand ?',
        options: ['zehn', 'elf', 'zwölf', 'zwanzig'],
        answer: 'zwölf',
        hint: '10 = zehn, 11 = elf, 12 = ...',
        explanation: '12 se dit "zwölf" en allemand. (11 = elf, 20 = zwanzig).'
      },
      {
        id: 'all_5',
        title: 'Auxiliaire HABEN (avoir)',
        type: 'qcm',
        level: 2,
        skill: 'Verbes Auxiliaires (sein, haben)',
        question: 'Complétez : « Wir ______ einen Hund. »',
        options: ['hat', 'hast', 'haben', 'habe'],
        answer: 'haben',
        hint: 'Avec WIR (nous), le verbe prend la terminaison infinitif -en.',
        explanation: 'Wir haben = Nous avons.'
      },
      {
        id: 'all_6',
        title: 'Salutations - Bonjour le matin',
        type: 'qcm',
        level: 1,
        skill: 'Nombres & Salutations',
        question: 'Comment dit-on "Bonjour" le matin en allemand ?',
        options: ['Guten Abend', 'Guten Morgen', 'Gute Nacht', 'Auf Wiedersehen'],
        answer: 'Guten Morgen',
        hint: 'Morgen = Le matin.',
        explanation: 'Guten Morgen s\'utilise la matin. Guten Tag durant la journée, Guten Abend le soir.'
      },
      {
        id: 'all_7',
        title: 'Pronoms Personnels - Il / Elle',
        type: 'qcm',
        level: 1,
        skill: 'Articles & Genres (der, die, das)',
        question: 'Quel pronom signifie "elle" en allemand ?',
        options: ['er', 'sie', 'es', 'wir'],
        answer: 'sie',
        hint: 'Er = Il, Sie = Elle/Ils, Es = Neutre.',
        explanation: 'Le pronom féminin de la 3e personne du singulier est "sie" (elle).'
      },
      {
        id: 'all_8',
        title: 'Ordre des Mots dans la Phrase simple',
        type: 'qcm',
        level: 3,
        skill: 'Cas de base (Nominatif & Accusatif)',
        question: 'Où se place le verbe conjugué dans une phrase déclarative simple en allemand ?',
        options: ['En toute première position', 'En 2ème position', 'À la toute fin', 'Peut importe'],
        answer: 'En 2ème position',
        hint: 'C\'est la règle d\'or de la syntaxe allemande en phrase affirmative !',
        explanation: 'Dans une proposition indépendante ou principale affirmative, le verbe conjugué occupe TOUJOURS la 2e position.'
      },
      {
        id: 'all_9',
        title: 'Article Indéfini Neutre',
        type: 'qcm',
        level: 2,
        skill: 'Articles & Genres (der, die, das)',
        question: 'Complétez pour "un livre" (das Buch) : « Das ist ______ Buch. »',
        options: ['ein', 'eine', 'einen', 'eines'],
        answer: 'ein',
        hint: 'Au masculin/neutre nominatif, l\'article indéfini est EIN.',
        explanation: 'Pour les noms neutres (das Buch) ou masculins au nominatif, l\'article indéfini est "ein". Pour le féminin c\'est "eine".'
      },
      {
        id: 'all_10',
        title: 'Verbe Wohne (habiter)',
        type: 'qcm',
        level: 2,
        skill: 'Conjugaison des Verbes au Présent',
        question: 'Traduisez : « J\'habite à Cotonou » -> « Ich ______ in Cotonou. »',
        options: ['wohne', 'wohnst', 'wohnt', 'wohnen'],
        answer: 'wohne',
        hint: 'Avec ICH, la terminaison est -e.',
        explanation: 'Ich wohne in Cotonou. (Terminaison -e à la 1ère personne du singulier).'
      }
    ]
  }
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // State Initialization from LocalStorage
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  
  // User Profile & Progress
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('precieux_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Précieux',
      grade: '4ème',
      xp: 0,
      streakDays: 3,
      learningTimeMinutes: 42,
      lastActive: new Date().toISOString()
    };
  });

  const [subjectProgress, setSubjectProgress] = useState(() => {
    const saved = localStorage.getItem('precieux_subject_progress');
    if (saved) return JSON.parse(saved);

    const initial = {};
    Object.keys(INITIAL_CURRICULUM).forEach(sub => {
      initial[sub] = {
        xp: 0,
        level: 1, // Level 1 to 8
        completedExercises: [],
        masteredSkills: [],
        diagnosticDone: false
      };
    });
    return initial;
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('precieux_badges');
    return saved ? JSON.parse(saved) : ['first_step'];
  });

  const [errorNotebook, setErrorNotebook] = useState(() => {
    const saved = localStorage.getItem('precieux_errors');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz execution states
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedXpNotice, setEarnedXpNotice] = useState(null);

  // Audio & Speech Synth
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Diagnostic mode
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [diagnosticSubject, setDiagnosticSubject] = useState('Français');
  const [diagnosticAnswers, setDiagnosticAnswers] = useState([]);

  // Save to LocalStorage effects
  useEffect(() => {
    localStorage.setItem('precieux_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('precieux_subject_progress', JSON.stringify(subjectProgress));
  }, [subjectProgress]);

  useEffect(() => {
    localStorage.setItem('precieux_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('precieux_errors', JSON.stringify(errorNotebook));
  }, [errorNotebook]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Compute Tree Stage from total XP
  const treeStage = useMemo(() => {
    const totalXp = userProfile.xp;
    let stage = TREE_STAGES[0];
    for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
      if (totalXp >= TREE_STAGES[i].minXp) {
        stage = TREE_STAGES[i];
        break;
      }
    }
    return stage;
  }, [userProfile.xp]);

  // Handle Speech Synth
  const speakText = (text, lang = 'fr-FR') => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par ce navigateur.");
      return;
    }
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slight slowing for clarity

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Add XP and check badge unlocks
  const addXp = (amount, subjectKey = null) => {
    const newTotalXp = userProfile.xp + amount;
    setUserProfile(prev => ({ ...prev, xp: newTotalXp }));

    let updatedSubXp = 0;
    if (subjectKey) {
      setSubjectProgress(prev => {
        const sub = prev[subjectKey] || { xp: 0, level: 1, completedExercises: [], masteredSkills: [] };
        updatedSubXp = sub.xp + amount;
        // Level calculation (Level up every 100 XP up to Level 8)
        const newLevel = Math.min(8, Math.floor(updatedSubXp / 80) + 1);
        return {
          ...prev,
          [subjectKey]: {
            ...sub,
            xp: updatedSubXp,
            level: newLevel
          }
        };
      });
    }

    // Check Badges
    const newBadges = [...unlockedBadges];
    BADGES_DEFINITIONS.forEach(b => {
      if (!newBadges.includes(b.id)) {
        if (b.subject && b.subject === subjectKey && updatedSubXp >= b.reqXp) {
          newBadges.push(b.id);
        } else if (!b.subject && newTotalXp >= b.reqXp) {
          newBadges.push(b.id);
        }
      }
    });

    if (newBadges.length !== unlockedBadges.length) {
      setUnlockedBadges(newBadges);
    }
  };

  // Start Exercise
  const startExercise = (subjectKey, exerciseObj) => {
    setSelectedSubject(subjectKey);
    setActiveExercise(exerciseObj);
    setSelectedOption(null);
    setShowHint(false);
    setHasSubmitted(false);
    setIsCorrect(false);
    setEarnedXpNotice(null);
    setActiveTab('exercise');
  };

  // Handle Answer Submission
  const handleSubmitAnswer = () => {
    if (!selectedOption || hasSubmitted) return;

    setHasSubmitted(true);
    const correct = selectedOption === activeExercise.answer;
    setIsCorrect(correct);

    if (correct) {
      const earned = 15;
      addXp(earned, selectedSubject);
      setEarnedXpNotice(`+${earned} XP ! Bravo !`);

      // Mark exercise as completed
      setSubjectProgress(prev => {
        const currentSub = prev[selectedSubject];
        const completed = currentSub.completedExercises.includes(activeExercise.id)
          ? currentSub.completedExercises
          : [...currentSub.completedExercises, activeExercise.id];
        
        const mastered = currentSub.masteredSkills.includes(activeExercise.skill)
          ? currentSub.masteredSkills
          : [...currentSub.masteredSkills, activeExercise.skill];

        return {
          ...prev,
          [selectedSubject]: {
            ...currentSub,
            completedExercises: completed,
            masteredSkills: mastered
          }
        };
      });

      // Remove from error notebook if was in there
      setErrorNotebook(prev => prev.filter(e => e.id !== activeExercise.id));
    } else {
      const consolationXp = 5;
      addXp(consolationXp, selectedSubject);
      setEarnedXpNotice(`+${consolationXp} XP pour ton effort. Réessaie la méthode !`);

      // Save to error notebook
      setErrorNotebook(prev => {
        if (prev.some(e => e.id === activeExercise.id)) return prev;
        return [...prev, { ...activeExercise, subject: selectedSubject, dateAdded: new Date().toLocaleDateString() }];
      });
    }
  };

  // Reset Progress Function
  const handleResetProgress = () => {
    if (window.confirm("Es-tu sûr de vouloir réinitialiser toute la progression de Précieux ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Helper: Next Exercise
  const handleNextExercise = () => {
    const list = INITIAL_CURRICULUM[selectedSubject].exercises;
    const currentIndex = list.findIndex(e => e.id === activeExercise.id);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      startExercise(selectedSubject, list[currentIndex + 1]);
    } else {
      setActiveTab('subjects');
    }
  };

  // ==========================================
  // COMPONENT RENDERERS
  // ==========================================

  // SVG Dynamic Tree Component
  const RenderTreeSVG = ({ stage }) => {
    // Dynamic features depending on stage.level (1 to 6)
    const level = stage.level;

    return (
      <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-4">
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl transition-all duration-700">
          {/* Ground & Hill */}
          <ellipse cx="150" cy="260" rx="110" ry="25" fill="#4A7C59" />
          <ellipse cx="150" cy="258" rx="90" ry="18" fill="#68A357" />

          {/* STAGE 1: Graine */}
          {level === 1 && (
            <g className="animate-pulse">
              <ellipse cx="150" cy="250" rx="12" ry="8" fill="#8B5A2B" />
              <path d="M 150 245 Q 152 235 150 230" stroke="#76BA1B" strokeWidth="3" fill="none" />
              <circle cx="150" cy="228" r="4" fill="#76BA1B" />
            </g>
          )}

          {/* STAGE 2: Pousse */}
          {level === 2 && (
            <g className="transition-all duration-500">
              <path d="M 150 255 Q 150 210 150 190" stroke="#8B5A2B" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Leaves */}
              <path d="M 150 200 Q 130 180 120 195 Q 140 205 150 200" fill="#76BA1B" />
              <path d="M 150 190 Q 170 170 180 185 Q 160 195 150 190" fill="#76BA1B" />
            </g>
          )}

          {/* STAGE 3: Jeune arbre */}
          {level === 3 && (
            <g className="transition-all duration-500">
              {/* Trunk */}
              <path d="M 150 255 L 142 170 Q 150 150 158 170 L 150 255" fill="#6F4E37" />
              {/* Foliage */}
              <circle cx="150" cy="140" r="45" fill="#52B788" />
              <circle cx="125" cy="155" r="30" fill="#40916C" />
              <circle cx="175" cy="155" r="30" fill="#40916C" />
            </g>
          )}

          {/* STAGE 4: Arbre développé */}
          {level === 4 && (
            <g className="transition-all duration-500">
              {/* Trunk */}
              <path d="M 150 255 L 138 150 Q 150 120 162 150 L 150 255" fill="#5C3D2E" />
              {/* Branches */}
              <path d="M 145 180 Q 110 150 100 130" stroke="#5C3D2E" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 155 180 Q 190 150 200 130" stroke="#5C3D2E" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Foliage */}
              <circle cx="150" cy="110" r="55" fill="#2D6A4F" />
              <circle cx="110" cy="130" r="40" fill="#40916C" />
              <circle cx="190" cy="130" r="40" fill="#40916C" />
              <circle cx="150" cy="85" r="35" fill="#52B788" />
            </g>
          )}

          {/* STAGE 5: Arbre florissant */}
          {level === 5 && (
            <g className="transition-all duration-500">
              {/* Trunk */}
              <path d="M 150 255 L 135 140 Q 150 100 165 140 L 150 255" fill="#4A2E1B" />
              <path d="M 145 170 Q 100 140 85 120" stroke="#4A2E1B" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M 155 170 Q 200 140 215 120" stroke="#4A2E1B" strokeWidth="10" strokeLinecap="round" fill="none" />
              {/* Dense Foliage */}
              <circle cx="150" cy="95" r="65" fill="#1B4332" />
              <circle cx="95" cy="120" r="45" fill="#2D6A4F" />
              <circle cx="205" cy="120" r="45" fill="#2D6A4F" />
              <circle cx="150" cy="65" r="45" fill="#40916C" />
              {/* Flowers / Blossoms */}
              <circle cx="120" cy="80" r="7" fill="#FFB703" />
              <circle cx="180" cy="90" r="7" fill="#FFB703" />
              <circle cx="150" cy="120" r="7" fill="#FFB703" />
              <circle cx="90" cy="130" r="6" fill="#FFB703" />
              <circle cx="210" cy="130" r="6" fill="#FFB703" />
            </g>
          )}

          {/* STAGE 6: Arbre majestueux */}
          {level >= 6 && (
            <g className="transition-all duration-500">
              {/* Golden Glow Aura */}
              <circle cx="150" cy="110" r="105" fill="#FFD700" opacity="0.15" className="animate-pulse" />
              {/* Massive Trunk */}
              <path d="M 150 255 L 130 130 Q 150 80 170 130 L 150 255" fill="#3D2314" />
              <path d="M 140 160 Q 80 120 65 95" stroke="#3D2314" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M 160 160 Q 220 120 235 95" stroke="#3D2314" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* Lush Majestic Foliage */}
              <circle cx="150" cy="85" r="75" fill="#081C15" />
              <circle cx="80" cy="110" r="55" fill="#1B4332" />
              <circle cx="220" cy="110" r="55" fill="#1B4332" />
              <circle cx="150" cy="50" r="50" fill="#2D6A4F" />
              {/* Fruits and Magic Sparkles */}
              <circle cx="110" cy="70" r="8" fill="#E63946" />
              <circle cx="190" cy="75" r="8" fill="#E63946" />
              <circle cx="150" cy="110" r="8" fill="#E63946" />
              <circle cx="70" cy="120" r="7" fill="#E63946" />
              <circle cx="230" cy="120" r="7" fill="#E63946" />
              {/* Crown / Star on Top */}
              <polygon points="150,10 154,20 165,21 156,28 159,38 150,32 141,38 144,28 135,21 146,20" fill="#FFD700" />
            </g>
          )}
        </svg>

        {/* Floating Label Badge */}
        <div className="absolute bottom-2 bg-midnight/90 backdrop-blur text-vanilla px-4 py-2 rounded-full border border-vanilla/20 shadow-lg flex items-center gap-2">
          <TreePine className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-wide">{stage.name} (Niveau {stage.level})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EEEBDA] text-[#282B4A] font-sans antialiased flex flex-col selection:bg-midnight selection:text-vanilla">
      
      {/* ==========================================
          HEADER BAR
      ========================================== */}
      <header className="sticky top-0 z-40 bg-[#282B4A] text-[#EEEBDA] shadow-md border-b border-vanilla/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-midnight flex items-center justify-center font-black text-2xl shadow-md transform group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight font-serif text-amber-300 group-hover:text-amber-200 transition-colors">
                Précieux
              </h1>
              <p className="text-xs text-vanilla/70 hidden sm:block">L'App qui fait grandir l'intelligence</p>
            </div>
          </div>

          {/* Stats Bar (XP, Streak, Status) */}
          <div className="flex items-center gap-3">
            {/* Offline/Online Indicator */}
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                isOnline ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' : 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
              }`}
              title={isOnline ? "Connecté au réseau" : "Mode Hors Ligne Actif (Toutes les fonctions sont disponibles)"}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isOnline ? 'En ligne' : 'Hors ligne'}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{userProfile.streakDays}j</span>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-1.5 bg-vanilla/10 text-amber-300 px-3 py-1 rounded-full text-xs font-black border border-vanilla/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{userProfile.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN CONTENT AREA
      ========================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 mb-20 md:mb-8">

        {/* ------------------------------------------
            TAB 1: ACCUEIL (HOME)
        ------------------------------------------ */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#282B4A] text-[#EEEBDA] p-6 sm:p-8 shadow-2xl border border-vanilla/10">
              {/* Background decorative SVG illustrations */}
              <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
                <GraduationCap className="w-80 h-80 text-vanilla" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                  <Compass className="w-4 h-4" /> Programme 4ème & Remédiation
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-300 font-serif leading-tight">
                  « Coucou Précieux, on bosse sur quoi aujourd'hui ? »
                </h2>

                <p className="text-vanilla/80 text-sm sm:text-base leading-relaxed">
                  Chaque exercice réussi fait grandir ton arbre de connaissances. Reprends les bases à ton rythme, surmonte tes erreurs et deviens totalement autonome.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button 
                    onClick={() => setActiveTab('subjects')}
                    className="bg-amber-400 hover:bg-amber-300 text-midnight font-black px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
                  >
                    <BookOpen className="w-5 h-5" /> Choisir une Matière
                  </button>

                  <button 
                    onClick={() => {
                      setIsDiagnosticMode(true);
                      setActiveTab('diagnostic');
                    }}
                    className="bg-vanilla/10 hover:bg-vanilla/20 text-vanilla border border-vanilla/30 font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm"
                  >
                    <Brain className="w-5 h-5 text-amber-300" /> Évaluation Diagnostique
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Overview Section (Tree Summary + Quick Access) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tree Status Card */}
              <div 
                onClick={() => setActiveTab('tree')}
                className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-midnight/10 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-midnight/60">Mon Arbre</span>
                  <TreePine className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>

                <div className="text-center py-2">
                  <div className="text-3xl font-black text-midnight">{treeStage.name}</div>
                  <p className="text-xs text-midnight/70 mt-1">{treeStage.desc}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mt-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Progression XP</span>
                    <span>{userProfile.xp} / {TREE_STAGES[Math.min(TREE_STAGES.length - 1, treeStage.level)].minXp} XP</span>
                  </div>
                  <div className="w-full h-3 bg-midnight/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(100, (userProfile.xp / (TREE_STAGES[Math.min(TREE_STAGES.length - 1, treeStage.level)].minXp || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Error Notebook Card */}
              <div 
                onClick={() => setActiveTab('progress')}
                className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-midnight/10 shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-midnight/60">Carnet d'Erreurs</span>
                  <RotateCcw className="w-5 h-5 text-amber-600 group-hover:rotate-45 transition-transform" />
                </div>

                <div>
                  <div className="text-3xl font-black text-midnight">{errorNotebook.length} Notion{errorNotebook.length > 1 ? 's' : ''}</div>
                  <p className="text-xs text-midnight/70 mt-1">
                    {errorNotebook.length === 0 ? "Aucune erreur enregistrée ! Super travail !" : "Des notions fragiles à retravailler pour progresser."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-midnight/10 flex items-center justify-between text-xs font-bold text-midnight group-hover:text-amber-600">
                  <span>Revoir mes erreurs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Daily Challenge Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Défi Quotidien</span>
                  <Trophy className="w-5 h-5 text-amber-200" />
                </div>

                <div>
                  <h4 className="font-extrabold text-lg">Entraînement Maths & Français</h4>
                  <p className="text-xs text-amber-100 mt-1">Complète au moins 3 exercices aujourd'hui pour maintenir ta série d'apprentissage.</p>
                </div>

                <button 
                  onClick={() => {
                    setSelectedSubject('Mathématiques');
                    startExercise('Mathématiques', INITIAL_CURRICULUM['Mathématiques'].exercises[0]);
                  }}
                  className="mt-4 w-full py-2.5 bg-midnight text-vanilla hover:bg-midnight/90 font-bold rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Relever le Défi (+30 XP)
                </button>
              </div>

            </div>

            {/* Subjects Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-midnight font-serif">Les 7 Matières au Programme</h3>
                <button 
                  onClick={() => setActiveTab('subjects')}
                  className="text-xs font-bold text-midnight/70 hover:text-midnight flex items-center gap-1"
                >
                  Voir tout <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.keys(INITIAL_CURRICULUM).map(subKey => {
                  const sub = INITIAL_CURRICULUM[subKey];
                  const prog = subjectProgress[subKey] || { level: 1, xp: 0, completedExercises: [] };
                  return (
                    <div 
                      key={subKey}
                      onClick={() => {
                        setSelectedSubject(subKey);
                        setActiveTab('subject_detail');
                      }}
                      className="bg-white/90 rounded-2xl p-4 border border-midnight/10 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl group-hover:scale-110 transition-transform">{sub.icon}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-midnight/5 text-midnight">
                          Niv. {prog.level}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-midnight text-base">{subKey}</h4>
                        <p className="text-xs text-midnight/60 mt-0.5">
                          {prog.completedExercises.length} / {sub.exercises.length} validés
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-midnight/5 flex items-center justify-between text-xs font-semibold text-midnight/80">
                        <span>{prog.xp} XP</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------
            TAB 2: MATIÈRES (SUBJECTS LIST)
        ------------------------------------------ */}
        {activeTab === 'subjects' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-midnight font-serif">Toutes les Matières</h2>
              <p className="text-sm text-midnight/70">Choisis une discipline pour commencer à t'entraîner ou réviser.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(INITIAL_CURRICULUM).map(subKey => {
                const sub = INITIAL_CURRICULUM[subKey];
                const prog = subjectProgress[subKey] || { level: 1, xp: 0, completedExercises: [], masteredSkills: [] };

                return (
                  <div 
                    key={subKey}
                    className="bg-white rounded-2xl p-6 border border-midnight/10 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl p-2 rounded-2xl bg-vanilla/60">{sub.icon}</span>
                          <div>
                            <h3 className="text-xl font-extrabold text-midnight">{subKey}</h3>
                            <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-midnight text-vanilla mt-1">
                              Niveau {prog.level} / 8
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-amber-600">{prog.xp} XP</span>
                        </div>
                      </div>

                      {/* Skills Covered List */}
                      <div className="mt-4 space-y-1">
                        <span className="text-xs font-bold text-midnight/50 uppercase tracking-wider">Compétences du programme :</span>
                        <ul className="text-xs space-y-1 text-midnight/80">
                          {sub.skills.map((skill, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${prog.masteredSkills.includes(skill) ? 'text-emerald-600 fill-emerald-100' : 'text-midnight/30'}`} />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-midnight/10 flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setSelectedSubject(subKey);
                          setActiveTab('subject_detail');
                        }}
                        className="flex-1 py-2.5 bg-midnight text-vanilla hover:bg-midnight/90 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" /> Voir les exercices ({sub.exercises.length})
                      </button>

                      <button 
                        onClick={() => {
                          setDiagnosticSubject(subKey);
                          setIsDiagnosticMode(true);
                          setActiveTab('diagnostic');
                        }}
                        className="py-2.5 px-4 bg-vanilla text-midnight border border-midnight/20 font-bold rounded-xl text-xs hover:bg-midnight/5 transition-colors flex items-center gap-1.5"
                        title="Passer un test diagnostic spécifique"
                      >
                        <Brain className="w-4 h-4" /> Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB: SUBJECT DETAIL & EXERCISE SELECTOR
        ------------------------------------------ */}
        {activeTab === 'subject_detail' && selectedSubject && (
          <div className="space-y-6 animate-fadeIn">
            <button 
              onClick={() => setActiveTab('subjects')}
              className="inline-flex items-center gap-2 text-xs font-bold text-midnight/70 hover:text-midnight"
            >
              ← Retour aux matières
            </button>

            {/* Subject Header */}
            <div className="bg-white rounded-3xl p-6 border border-midnight/10 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{INITIAL_CURRICULUM[selectedSubject].icon}</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-midnight font-serif">{selectedSubject}</h2>
                  <p className="text-xs text-midnight/70">
                    Progression : {subjectProgress[selectedSubject]?.completedExercises.length || 0} / {INITIAL_CURRICULUM[selectedSubject].exercises.length} exercices complétés
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-vanilla rounded-xl border border-midnight/10">
                  <div className="text-xs text-midnight/60 font-semibold">Niveau d'aptitude</div>
                  <div className="text-lg font-black text-midnight">Niveau {subjectProgress[selectedSubject]?.level || 1}</div>
                </div>

                <div className="text-center px-4 py-2 bg-amber-400/20 text-midnight rounded-xl border border-amber-400/30">
                  <div className="text-xs text-midnight/60 font-semibold">XP Matière</div>
                  <div className="text-lg font-black text-amber-700">{subjectProgress[selectedSubject]?.xp || 0} XP</div>
                </div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-midnight font-serif">Exercices & Modules de Révision</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_CURRICULUM[selectedSubject].exercises.map((ex, idx) => {
                  const isDone = subjectProgress[selectedSubject]?.completedExercises.includes(ex.id);

                  return (
                    <div 
                      key={ex.id}
                      onClick={() => startExercise(selectedSubject, ex)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isDone 
                          ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500' 
                          : 'bg-white border-midnight/10 hover:border-midnight/30 shadow-sm hover:shadow'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-midnight/10 text-midnight'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>

                        <div>
                          <h4 className="font-bold text-midnight text-sm">{ex.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-midnight/5 text-midnight/70">
                              Niv. {ex.level}
                            </span>
                            <span className="text-xs text-midnight/60 truncate max-w-[180px]">
                              {ex.skill}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shrink-0 ${
                        isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-midnight text-vanilla hover:bg-midnight/90'
                      }`}>
                        {isDone ? 'Revoir' : 'Faire'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB: EXERCISE INTERACTIVE QUIZ ENGINE
        ------------------------------------------ */}
        {activeTab === 'exercise' && activeExercise && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            
            {/* Top Navigation Back */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('subject_detail')}
                className="inline-flex items-center gap-2 text-xs font-bold text-midnight/70 hover:text-midnight"
              >
                ← Quitter l'exercice
              </button>

              <span className="text-xs font-bold px-3 py-1 bg-midnight text-vanilla rounded-full">
                {selectedSubject} • Niveau {activeExercise.level}
              </span>
            </div>

            {/* Exercise Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-midnight/10 shadow-xl space-y-6">
              
              {/* Exercise Header */}
              <div className="space-y-2 border-b border-midnight/10 pb-4">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                  Compétence : {activeExercise.skill}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-midnight font-serif">
                  {activeExercise.title}
                </h3>
              </div>

              {/* Question Box */}
              <div className="bg-vanilla/50 rounded-2xl p-5 border border-midnight/10 text-midnight text-base sm:text-lg font-medium leading-relaxed flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-midnight/60 shrink-0 mt-0.5" />
                <div className="flex-1">
                  {activeExercise.question}
                </div>

                {/* Audio Reader button for French, English & German */}
                <button 
                  onClick={() => {
                    const langMap = { English: 'en-US', Allemand: 'de-DE', Français: 'fr-FR' };
                    speakText(activeExercise.question, langMap[selectedSubject] || 'fr-FR');
                  }}
                  className={`p-2 rounded-xl text-midnight transition-colors ${isPlayingAudio ? 'bg-amber-400 animate-bounce' : 'bg-midnight/10 hover:bg-midnight/20'}`}
                  title="Écouter la question (Audio)"
                >
                  {isPlayingAudio ? <Volume2 className="w-5 h-5 text-midnight" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Hint Trigger */}
              {!hasSubmitted && (
                <div>
                  {!showHint ? (
                    <button 
                      onClick={() => setShowHint(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" /> Besoin d'un indice ?
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 animate-fadeIn">
                      <span className="font-bold">💡 Indice : </span>{activeExercise.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Options Selection */}
              <div className="space-y-3">
                {activeExercise.options.map((option, idx) => {
                  let btnStyle = "bg-white border-midnight/20 hover:border-midnight/50 text-midnight";

                  if (selectedOption === option) {
                    btnStyle = "bg-midnight text-vanilla border-midnight font-bold shadow-md";
                  }

                  if (hasSubmitted) {
                    if (option === activeExercise.answer) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-700 font-bold shadow-md";
                    } else if (selectedOption === option && !isCorrect) {
                      btnStyle = "bg-rose-600 text-white border-rose-700 font-bold opacity-80";
                    } else {
                      btnStyle = "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {hasSubmitted && option === activeExercise.answer && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                      )}
                      {hasSubmitted && selectedOption === option && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit & Next Controls */}
              {!hasSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmitAnswer}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all shadow-lg flex items-center justify-center gap-2 ${
                    selectedOption 
                      ? 'bg-amber-400 hover:bg-amber-300 text-midnight' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-5 h-5" /> Valider ma réponse
                </button>
              ) : (
                <div className="space-y-4 pt-2 border-t border-midnight/10 animate-fadeIn">
                  
                  {/* Feedback Notice */}
                  <div className={`p-4 rounded-2xl flex items-start gap-3 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />}
                    <div>
                      <h4 className="font-bold text-base">{isCorrect ? "C'est exact ! Bravo !" : "Pas tout à fait..."}</h4>
                      <p className="text-xs mt-1 leading-relaxed">{earnedXpNotice}</p>
                    </div>
                  </div>

                  {/* Step-by-Step Pedagogical Explanation */}
                  <div className="bg-vanilla/60 p-4 rounded-2xl border border-midnight/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-midnight uppercase tracking-wider">
                      <Brain className="w-4 h-4 text-midnight" /> Explication Pédagogique & Méthode :
                    </div>
                    <p className="text-xs sm:text-sm text-midnight/90 leading-relaxed">
                      {activeExercise.explanation}
                    </p>
                  </div>

                  {/* Next Exercise Button */}
                  <button
                    onClick={handleNextExercise}
                    className="w-full py-4 bg-midnight hover:bg-midnight/90 text-vanilla font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Exercice Suivant <ArrowRight className="w-5 h-5" />
                  </button>

                </div>
              )}

            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 3: MON ARBRE (EVOLVING TREE)
        ------------------------------------------ */}
        {activeTab === 'tree' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-3xl font-black text-midnight font-serif">Ton Arbre de Progression</h2>
              <p className="text-sm text-midnight/70">
                L'arbre grandit au fur et à mesure que tu consolides tes connaissances. Chaque effort compte !
              </p>
            </div>

            {/* Tree Interactive Display */}
            <div className="bg-white rounded-3xl p-6 border border-midnight/10 shadow-xl max-w-xl mx-auto text-center space-y-6">
              
              <RenderTreeSVG stage={treeStage} />

              <div className="p-4 bg-vanilla rounded-2xl border border-midnight/10 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-midnight text-sm">Stade : {treeStage.name}</span>
                  <span className="text-xs font-bold text-amber-600">{userProfile.xp} XP au total</span>
                </div>
                <p className="text-xs text-midnight/80">{treeStage.desc}</p>
              </div>

              {/* Stages Roadmap */}
              <div className="space-y-3 pt-4 border-t border-midnight/10 text-left">
                <h4 className="font-extrabold text-xs text-midnight uppercase tracking-wider">Les 6 Stades d'Évolution de l'Arbre :</h4>
                <div className="space-y-2">
                  {TREE_STAGES.map((st) => {
                    const isReached = userProfile.xp >= st.minXp;
                    return (
                      <div 
                        key={st.level}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          isReached ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isReached ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {st.level}
                          </span>
                          <span>{st.name}</span>
                        </div>
                        <span>{st.minXp} XP requis</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 4: DIAGNOSTIC INITIAL
        ------------------------------------------ */}
        {activeTab === 'diagnostic' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-midnight/10 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-400/20 text-midnight rounded-2xl">
                  <Brain className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-midnight font-serif">Diagnostic de Niveau</h2>
                  <p className="text-xs text-midnight/70">Évalue ton vrai niveau actuel sans aucune sanction.</p>
                </div>
              </div>

              {/* Subject Selection for Diagnostic */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-midnight uppercase">Matière à évaluer :</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(INITIAL_CURRICULUM).map(s => (
                    <button
                      key={s}
                      onClick={() => setDiagnosticSubject(s)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        diagnosticSubject === s ? 'bg-midnight text-vanilla border-midnight' : 'bg-vanilla/40 text-midnight border-midnight/10 hover:bg-vanilla'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <span className="font-bold">📌 Comment fonctionne le diagnostic ?</span>
                <p className="leading-relaxed">
                  3 questions ciblées de difficultés différentes vont t'être posées. L'application ajustera immédiatement ton niveau conseillé pour éviter les blocages.
                </p>
              </div>

              <button 
                onClick={() => {
                  const subEx = INITIAL_CURRICULUM[diagnosticSubject].exercises[0];
                  startExercise(diagnosticSubject, subEx);
                }}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-midnight font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Lancer le Diagnostic ({diagnosticSubject}) <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------
            TAB 5: MA PROGRESSION & STATISTIQUES
        ------------------------------------------ */}
        {activeTab === 'progress' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-black text-midnight font-serif">Ma Progression & Statistiques</h2>
              <p className="text-sm text-midnight/70">Un bilan honnête de tes accomplissements et des points à renforcer.</p>
            </div>

            {/* General Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-midnight/10 shadow-sm text-center">
                <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <div className="text-2xl font-black text-midnight">{userProfile.xp}</div>
                <div className="text-xs text-midnight/60 font-semibold">XP Cumulés</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-midnight/10 shadow-sm text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <div className="text-2xl font-black text-midnight">{userProfile.streakDays} Jours</div>
                <div className="text-xs text-midnight/60 font-semibold">Série Régulière</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-midnight/10 shadow-sm text-center">
                <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <div className="text-2xl font-black text-midnight">{unlockedBadges.length} / {BADGES_DEFINITIONS.length}</div>
                <div className="text-xs text-midnight/60 font-semibold">Badges Débloqués</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-midnight/10 shadow-sm text-center">
                <BarChart3 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <div className="text-2xl font-black text-midnight">{userProfile.learningTimeMinutes} min</div>
                <div className="text-xs text-midnight/60 font-semibold">Temps d'Apprentissage</div>
              </div>
            </div>

            {/* Badges Collection Grid */}
            <div className="bg-white rounded-3xl p-6 border border-midnight/10 shadow-md space-y-4">
              <h3 className="text-lg font-extrabold text-midnight font-serif">Mes Badges d'Accomplissement</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BADGES_DEFINITIONS.map(badge => {
                  const isUnlocked = unlockedBadges.includes(badge.id);

                  return (
                    <div 
                      key={badge.id}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isUnlocked ? 'bg-amber-50/60 border-amber-300 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-bold text-midnight text-xs">{badge.title}</h4>
                      <p className="text-[10px] text-midnight/70 mt-1">{badge.desc}</p>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                        isUnlocked ? 'bg-amber-400 text-midnight' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isUnlocked ? 'Obtenu !' : `${badge.reqXp} XP requis`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Notebook Section */}
            <div className="bg-white rounded-3xl p-6 border border-midnight/10 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-midnight font-serif">Carnet des Notions à Renforcer</h3>
                  <p className="text-xs text-midnight/60">Réentraîne-toi sur tes erreurs passées pour les transformer en succès.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                  {errorNotebook.length} fragile(s)
                </span>
              </div>

              {errorNotebook.length === 0 ? (
                <div className="p-8 text-center text-midnight/50 bg-vanilla/40 rounded-2xl border border-dashed border-midnight/20 text-xs">
                  Aucune erreur en attente. Tu maîtrises parfaitement toutes tes notions traitées !
                </div>
              ) : (
                <div className="space-y-3">
                  {errorNotebook.map(errEx => (
                    <div 
                      key={errEx.id}
                      onClick={() => startExercise(errEx.subject, errEx)}
                      className="p-4 bg-amber-50/50 hover:bg-amber-50 rounded-2xl border border-amber-200 transition-all cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-800">{errEx.subject}</span>
                        <h4 className="font-bold text-midnight text-sm">{errEx.title}</h4>
                        <p className="text-xs text-midnight/70 mt-0.5">{errEx.skill}</p>
                      </div>

                      <button className="px-3 py-1.5 bg-midnight text-vanilla font-bold text-xs rounded-xl hover:bg-midnight/90 shrink-0">
                        Corriger maintenant
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger Zone: Reset Data */}
            <div className="pt-6 border-t border-midnight/10 flex justify-end">
              <button 
                onClick={handleResetProgress}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Réinitialiser les données de progression
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ==========================================
          BOTTOM NAVIGATION (MOBILE & DESKTOP SUITE)
      ========================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#282B4A] text-[#EEEBDA] border-t border-vanilla/10 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'home' ? 'text-amber-300 scale-105' : 'text-vanilla/60 hover:text-vanilla'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Accueil</span>
          </button>

          <button 
            onClick={() => setActiveTab('subjects')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects' || activeTab === 'subject_detail' ? 'text-amber-300 scale-105' : 'text-vanilla/60 hover:text-vanilla'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Matières</span>
          </button>

          <button 
            onClick={() => setActiveTab('tree')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tree' ? 'text-amber-300 scale-105' : 'text-vanilla/60 hover:text-vanilla'
            }`}
          >
            <TreePine className="w-5 h-5" />
            <span>Mon Arbre</span>
          </button>

          <button 
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'progress' ? 'text-amber-300 scale-105' : 'text-vanilla/60 hover:text-vanilla'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Progression</span>
          </button>

        </div>
      </nav>

    </div>
  );
}