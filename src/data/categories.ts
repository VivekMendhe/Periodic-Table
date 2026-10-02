import type { CategoryInfo, ElementCategory } from '../types/element';

export const CATEGORIES: Record<ElementCategory, CategoryInfo> = {
  'alkali-metal': {
    id: 'alkali-metal',
    name: 'Alkali Metal',
    description: 'Highly reactive metals in Group 1 with a single valence electron.',
    colorLight: {
      bg: '#ffe4e6', // light rose
      border: '#fda4af',
      text: '#9f1239',
      accent: '#e11d48',
    },
    colorDark: {
      bg: 'rgba(244, 63, 94, 0.18)',
      border: 'rgba(244, 63, 94, 0.45)',
      text: '#fda4af',
      accent: '#fb7185',
    },
  },
  'alkaline-earth-metal': {
    id: 'alkaline-earth-metal',
    name: 'Alkaline Earth Metal',
    description: 'Reactive divalent metals in Group 2 that form alkaline hydroxides.',
    colorLight: {
      bg: '#ffedd5', // light orange
      border: '#fed7aa',
      text: '#9a3412',
      accent: '#ea580c',
    },
    colorDark: {
      bg: 'rgba(249, 115, 22, 0.18)',
      border: 'rgba(249, 115, 22, 0.45)',
      text: '#fdba74',
      accent: '#fb923c',
    },
  },
  'transition-metal': {
    id: 'transition-metal',
    name: 'Transition Metal',
    description: 'D-block metallic elements with partially filled d-orbitals and variable oxidation states.',
    colorLight: {
      bg: '#fef9c3', // pastel yellow
      border: '#fde047',
      text: '#854d0e',
      accent: '#ca8a04',
    },
    colorDark: {
      bg: 'rgba(234, 179, 8, 0.18)',
      border: 'rgba(234, 179, 8, 0.45)',
      text: '#fef08a',
      accent: '#facc15',
    },
  },
  'post-transition-metal': {
    id: 'post-transition-metal',
    name: 'Post-transition Metal',
    description: 'Metallic elements in the p-block with lower melting points and higher electronegativities than transition metals.',
    colorLight: {
      bg: '#e0f2fe', // sky blue
      border: '#bae6fd',
      text: '#0369a1',
      accent: '#0284c7',
    },
    colorDark: {
      bg: 'rgba(14, 165, 233, 0.18)',
      border: 'rgba(14, 165, 233, 0.45)',
      text: '#7dd3fc',
      accent: '#38bdf8',
    },
  },
  'metalloid': {
    id: 'metalloid',
    name: 'Metalloid',
    description: 'Elements with properties intermediate between typical metals and nonmetals.',
    colorLight: {
      bg: '#d1fae5', // mint/emerald
      border: '#a7f3d0',
      text: '#065f46',
      accent: '#059669',
    },
    colorDark: {
      bg: 'rgba(16, 185, 129, 0.18)',
      border: 'rgba(16, 185, 129, 0.45)',
      text: '#6ee7b7',
      accent: '#34d399',
    },
  },
  'nonmetal': {
    id: 'nonmetal',
    name: 'Nonmetal',
    description: 'Electronegative elements that readily gain or share electrons, including essential building blocks of life.',
    colorLight: {
      bg: '#dcfce7', // soft green
      border: '#bbf7d0',
      text: '#166534',
      accent: '#16a34a',
    },
    colorDark: {
      bg: 'rgba(34, 197, 94, 0.18)',
      border: 'rgba(34, 197, 94, 0.45)',
      text: '#86efac',
      accent: '#4ade80',
    },
  },
  'halogen': {
    id: 'halogen',
    name: 'Halogen',
    description: 'Highly reactive nonmetals in Group 17 that form strongly acidic salts with hydrogen.',
    colorLight: {
      bg: '#ede9fe', // soft violet
      border: '#ddd6fe',
      text: '#5b21b6',
      accent: '#7c3aed',
    },
    colorDark: {
      bg: 'rgba(139, 92, 246, 0.18)',
      border: 'rgba(139, 92, 246, 0.45)',
      text: '#c4b5fd',
      accent: '#a78bfa',
    },
  },
  'noble-gas': {
    id: 'noble-gas',
    name: 'Noble Gas',
    description: 'Odorless, colorless, extremely unreactive elements with full valence electron shells.',
    colorLight: {
      bg: '#e0e7ff', // soft indigo/blue
      border: '#c7d2fe',
      text: '#3730a3',
      accent: '#4f46e5',
    },
    colorDark: {
      bg: 'rgba(99, 102, 241, 0.18)',
      border: 'rgba(99, 102, 241, 0.45)',
      text: '#a5b4fc',
      accent: '#818cf8',
    },
  },
  'lanthanide': {
    id: 'lanthanide',
    name: 'Lanthanide',
    description: 'Series of 15 metallic elements from lanthanum to lutetium with filling 4f orbitals.',
    colorLight: {
      bg: '#fce7f3', // soft pink
      border: '#fbcfe8',
      text: '#9d174d',
      accent: '#db2777',
    },
    colorDark: {
      bg: 'rgba(236, 72, 153, 0.18)',
      border: 'rgba(236, 72, 153, 0.45)',
      text: '#f472b6',
      accent: '#f472b6',
    },
  },
  'actinide': {
    id: 'actinide',
    name: 'Actinide',
    description: 'Series of 15 radioactive metallic elements from actinium to lawrencium with filling 5f orbitals.',
    colorLight: {
      bg: '#ffe4e6', // rose / soft crimson
      border: '#fecdd3',
      text: '#881337',
      accent: '#be123c',
    },
    colorDark: {
      bg: 'rgba(225, 29, 72, 0.18)',
      border: 'rgba(225, 29, 72, 0.45)',
      text: '#fda4af',
      accent: '#fb7185',
    },
  },
  'unknown': {
    id: 'unknown',
    name: 'Unknown',
    description: 'Superheavy synthetic elements whose chemical properties are currently predicted or unconfirmed.',
    colorLight: {
      bg: '#f1f5f9', // slate
      border: '#cbd5e1',
      text: '#475569',
      accent: '#64748b',
    },
    colorDark: {
      bg: 'rgba(148, 163, 184, 0.18)',
      border: 'rgba(148, 163, 184, 0.45)',
      text: '#cbd5e1',
      accent: '#94a3b8',
    },
  },
};

export const CATEGORY_LIST: CategoryInfo[] = [
  CATEGORIES['alkali-metal'],
  CATEGORIES['alkaline-earth-metal'],
  CATEGORIES['transition-metal'],
  CATEGORIES['post-transition-metal'],
  CATEGORIES['metalloid'],
  CATEGORIES['nonmetal'],
  CATEGORIES['halogen'],
  CATEGORIES['noble-gas'],
  CATEGORIES['lanthanide'],
  CATEGORIES['actinide'],
];
