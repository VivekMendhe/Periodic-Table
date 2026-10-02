import type { ElementData } from '../types/element';

export type ReactionOutcomeType =
  | 'IONIC_BOND'
  | 'COVALENT_POLAR'
  | 'COVALENT_NONPOLAR'
  | 'NOBLE_GAS_REPULSION'
  | 'METALLIC_REPULSION'
  | 'UNFAVORABLE_REPULSION';

export interface ReactionResult {
  outcome: ReactionOutcomeType;
  isReactive: boolean;
  bondTypeTitle: string;
  compoundFormula: string;
  compoundName: string;
  balancedEquation: string;
  energyType: 'exothermic' | 'endothermic' | 'inert';
  deltaEN: number;
  explanation: string;
  electronTransferCount?: number;
  donorSymbol?: string;
  acceptorSymbol?: string;
  bondOrder?: string;
}

export interface ReactionPreset {
  id: string;
  label: string;
  atomANumber: number;
  atomBNumber: number;
  category: 'ionic' | 'covalent' | 'repulsion';
  description: string;
}

export const REACTION_PRESETS: ReactionPreset[] = [
  {
    id: 'na-cl',
    label: 'Na + Cl (Table Salt)',
    atomANumber: 11, // Sodium
    atomBNumber: 17, // Chlorine
    category: 'ionic',
    description: 'Vigorous electron transfer forming a crystalline ionic lattice (NaCl).',
  },
  {
    id: 'h-o',
    label: 'H + O (Water)',
    atomANumber: 1, // Hydrogen
    atomBNumber: 8, // Oxygen
    category: 'covalent',
    description: 'Polar covalent sharing of valence electrons forming H₂O.',
  },
  {
    id: 'c-o',
    label: 'C + O (Carbon Dioxide)',
    atomANumber: 6, // Carbon
    atomBNumber: 8, // Oxygen
    category: 'covalent',
    description: 'Double covalent bonds sharing 4 electron pairs forming CO₂.',
  },
  {
    id: 'mg-o',
    label: 'Mg + O (Magnesium Oxide)',
    atomANumber: 12, // Magnesium
    atomBNumber: 8, // Oxygen
    category: 'ionic',
    description: 'Transfer of 2 electrons with intense exothermic brilliant white light (MgO).',
  },
  {
    id: 'he-na',
    label: 'He + Na (Noble Gas Reject)',
    atomANumber: 2, // Helium
    atomBNumber: 11, // Sodium
    category: 'repulsion',
    description: 'Helium has a full duplet shell. Atoms repel each other with an electrostatic bounce.',
  },
  {
    id: 'ar-fe',
    label: 'Ar + Fe (Inert Gas Barrier)',
    atomANumber: 18, // Argon
    atomBNumber: 26, // Iron
    category: 'repulsion',
    description: 'Argon has an ultra-stable filled octet. Zero chemical affinity, resulting in repulsion.',
  },
  {
    id: 'li-f',
    label: 'Li + F (Lithium Fluoride)',
    atomANumber: 3, // Lithium
    atomBNumber: 9, // Fluorine
    category: 'ionic',
    description: 'Highest electronegativity difference on the periodic table forming ionic LiF.',
  },
  {
    id: 'cu-au',
    label: 'Cu + Au (Metal Non-Reaction)',
    atomANumber: 29, // Copper
    atomBNumber: 79, // Gold
    category: 'repulsion',
    description: 'Both elements are metals with low affinity to accept electrons; no chemical molecule forms.',
  },
];

// Curated database of well-known binary compounds
interface KnownCompound {
  formula: string;
  name: string;
  equation: string;
  outcome: ReactionOutcomeType;
  energyType: 'exothermic' | 'endothermic' | 'inert';
  explanation: string;
  electronTransferCount?: number;
  bondOrder?: string;
}

const KNOWN_REACTIONS: Record<string, KnownCompound> = {
  '1-8': {
    formula: 'H₂O',
    name: 'Water (Dihydrogen Monoxide)',
    equation: '2H₂ + O₂ → 2H₂O',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Oxygen shares valence electrons with two Hydrogen atoms, forming a polar bent molecule with hydrogen bonding potential.',
    bondOrder: 'Single Polar Covalent (O-H)',
  },
  '8-1': {
    formula: 'H₂O',
    name: 'Water (Dihydrogen Monoxide)',
    equation: '2H₂ + O₂ → 2H₂O',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Oxygen shares valence electrons with Hydrogen atoms, forming a polar covalent structure.',
    bondOrder: 'Single Polar Covalent (O-H)',
  },
  '11-17': {
    formula: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    equation: '2Na + Cl₂ → 2NaCl',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Sodium donates its lone 3s¹ valence electron to Chlorine (3s² 3p⁵), creating Na⁺ and Cl⁻ ions bound by intense electrostatic attraction.',
    electronTransferCount: 1,
    bondOrder: 'Ionic Electrostatic Attraction',
  },
  '17-11': {
    formula: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    equation: '2Na + Cl₂ → 2NaCl',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Chlorine accepts one electron from Sodium, producing a stable crystalline cubic ionic lattice.',
    electronTransferCount: 1,
    bondOrder: 'Ionic Electrostatic Attraction',
  },
  '12-8': {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    equation: '2Mg + O₂ → 2MgO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Magnesium transfers 2 valence electrons to Oxygen, releasing brilliant white light and establishing a high-melting ionic lattice (Mg²⁺ and O²⁻).',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Bond (Mg²⁺ O²⁻)',
  },
  '8-12': {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    equation: '2Mg + O₂ → 2MgO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Oxygen accepts two electrons from Magnesium to complete its octet, forming crystalline MgO.',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Bond (Mg²⁺ O²⁻)',
  },
  '6-8': {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    equation: 'C + O₂ → CO₂',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Carbon forms linear double covalent bonds with two Oxygen atoms (O=C=O), sharing 4 pairs of electrons in a thermodynamically stable gas.',
    bondOrder: 'Double Covalent (O=C=O)',
  },
  '8-6': {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    equation: 'C + O₂ → CO₂',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Carbon and Oxygen share electron pairs in linear geometry, satisfying octet rules for both elements.',
    bondOrder: 'Double Covalent (O=C=O)',
  },
  '3-9': {
    formula: 'LiF',
    name: 'Lithium Fluoride',
    equation: '2Li + F₂ → 2LiF',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Lithium donates 1 electron to Fluorine. This pairing exhibits the highest electronegativity gradient on the periodic table (ΔEN ≈ 3.0).',
    electronTransferCount: 1,
    bondOrder: 'Strong Ionic Bond',
  },
  '9-3': {
    formula: 'LiF',
    name: 'Lithium Fluoride',
    equation: '2Li + F₂ → 2LiF',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Fluorine strips the 2s electron from Lithium, creating Li⁺ and F⁻ in a rock-salt crystalline structure.',
    electronTransferCount: 1,
    bondOrder: 'Strong Ionic Bond',
  },
  '1-17': {
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    equation: 'H₂ + Cl₂ → 2HCl',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Hydrogen shares its single electron with Chlorine to form a polar covalent gas that dissociates into hydrochloric acid in aqueous solutions.',
    bondOrder: 'Polar Single Covalent',
  },
  '17-1': {
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    equation: 'H₂ + Cl₂ → 2HCl',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Hydrogen and Chlorine share an electron pair with dipole moment oriented toward Chlorine.',
    bondOrder: 'Polar Single Covalent',
  },
  '1-9': {
    formula: 'HF',
    name: 'Hydrogen Fluoride',
    equation: 'H₂ + F₂ → 2HF',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Extremely polar covalent molecule with intense dipole-dipole hydrogen bonding capacity.',
    bondOrder: 'Ultra-Polar Covalent (H-F)',
  },
  '9-1': {
    formula: 'HF',
    name: 'Hydrogen Fluoride',
    equation: 'H₂ + F₂ → 2HF',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Strongly polar single covalent bond formed between Hydrogen and the most electronegative element.',
    bondOrder: 'Ultra-Polar Covalent (H-F)',
  },
  '6-1': {
    formula: 'CH₄',
    name: 'Methane',
    equation: 'C + 2H₂ → CH₄',
    outcome: 'COVALENT_NONPOLAR',
    energyType: 'exothermic',
    explanation: 'Carbon forms four symmetrical sp³ covalent bonds with Hydrogen atoms in tetrahedral geometry (ΔEN = 0.35, nonpolar).',
    bondOrder: 'Single Covalent (sp³ hybrid)',
  },
  '1-6': {
    formula: 'CH₄',
    name: 'Methane',
    equation: 'C + 2H₂ → CH₄',
    outcome: 'COVALENT_NONPOLAR',
    energyType: 'exothermic',
    explanation: 'Four hydrogen atoms share electrons with carbon to achieve a stable nonpolar tetrahedral hydrocarbon.',
    bondOrder: 'Single Covalent (sp³ hybrid)',
  },
  '7-1': {
    formula: 'NH₃',
    name: 'Ammonia',
    equation: 'N₂ + 3H₂ → 2NH₃',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Nitrogen shares electrons with three Hydrogen atoms, leaving one lone pair in a trigonal pyramidal geometry.',
    bondOrder: 'Polar Covalent with Lone Pair',
  },
  '1-7': {
    formula: 'NH₃',
    name: 'Ammonia',
    equation: 'N₂ + 3H₂ → 2NH₃',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Nitrogen binds three hydrogens covalently, producing the essential precursor of fertilizers.',
    bondOrder: 'Polar Covalent with Lone Pair',
  },
  '20-8': {
    formula: 'CaO',
    name: 'Calcium Oxide (Quicklime)',
    equation: '2Ca + O₂ → 2CaO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Calcium donates two electrons (4s²) to Oxygen, yielding refractory ionic crystals of Ca²⁺ and O²⁻.',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Lattice',
  },
  '8-20': {
    formula: 'CaO',
    name: 'Calcium Oxide (Quicklime)',
    equation: '2Ca + O₂ → 2CaO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Calcium readily oxidizes, giving up valence electrons to form calcium oxide quicklime.',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Lattice',
  },
  '19-35': {
    formula: 'KBr',
    name: 'Potassium Bromide',
    equation: '2K + Br₂ → 2KBr',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Potassium donates its 4s¹ electron to Bromine, creating K⁺ and Br⁻ ionic salts with high water solubility.',
    electronTransferCount: 1,
    bondOrder: 'Single Ionic Bond',
  },
  '35-19': {
    formula: 'KBr',
    name: 'Potassium Bromide',
    equation: '2K + Br₂ → 2KBr',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Bromine oxidizes potassium metal through an electron transfer event, yielding cubic KBr salts.',
    electronTransferCount: 1,
    bondOrder: 'Single Ionic Bond',
  },
  '26-8': {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide (Rust)',
    equation: '4Fe + 3O₂ → 2Fe₂O₃',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Iron donates valence and 3d electrons to Oxygen atoms over oxidation steps, producing reddish-brown rust.',
    electronTransferCount: 3,
    bondOrder: 'Transition Metal Ionic Lattice',
  },
  '8-26': {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide (Rust)',
    equation: '4Fe + 3O₂ → 2Fe₂O₃',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Oxygen oxidizes Iron into an insoluble red-brown ionic oxide matrix.',
    electronTransferCount: 3,
    bondOrder: 'Transition Metal Ionic Lattice',
  },
};

/**
 * Universal Chemical Reaction Simulator Engine
 * Determines the interaction between any pair of elements from the 118 elements.
 */
export function calculateReaction(elemA: ElementData, elemB: ElementData): ReactionResult {
  const key = `${elemA.atomicNumber}-${elemB.atomicNumber}`;
  
  // 1. Check direct curated database match first
  if (KNOWN_REACTIONS[key]) {
    const known = KNOWN_REACTIONS[key];
    const enA = parseFloat(elemA.electronegativity) || 0;
    const enB = parseFloat(elemB.electronegativity) || 0;
    const deltaEN = Math.abs(enA - enB);

    return {
      outcome: known.outcome,
      isReactive: true,
      bondTypeTitle:
        known.outcome === 'IONIC_BOND'
          ? 'Ionic Chemical Bond'
          : known.outcome === 'COVALENT_POLAR'
          ? 'Polar Covalent Molecule'
          : 'Nonpolar Covalent Molecule',
      compoundFormula: known.formula,
      compoundName: known.name,
      balancedEquation: known.equation,
      energyType: known.energyType,
      deltaEN: parseFloat(deltaEN.toFixed(2)),
      explanation: known.explanation,
      electronTransferCount: known.electronTransferCount,
      donorSymbol: enA < enB ? elemA.symbol : elemB.symbol,
      acceptorSymbol: enA < enB ? elemB.symbol : elemA.symbol,
      bondOrder: known.bondOrder,
    };
  }

  // 2. Identify Element Properties
  const isNobleA = elemA.category === 'noble-gas';
  const isNobleB = elemB.category === 'noble-gas';

  // 2A. Noble Gas Repulsion (Inertness)
  if (isNobleA || isNobleB) {
    const noble = isNobleA ? elemA : elemB;
    const other = isNobleA ? elemB : elemA;
    return {
      outcome: 'NOBLE_GAS_REPULSION',
      isReactive: false,
      bondTypeTitle: 'Inert Repulsion (No Reaction)',
      compoundFormula: 'No Compound Formed',
      compoundName: 'Inert Collision / Elastic Bounce',
      balancedEquation: `${elemA.symbol} + ${elemB.symbol} ↛ No Reaction`,
      energyType: 'inert',
      deltaEN: 0,
      explanation: `${noble.name} belongs to Group 18 with a complete, chemically stable valence electron octet (${noble.atomicNumber === 2 ? '1s² duplet' : 's²p⁶ octet'}). It possesses near-zero electron affinity and extraordinarily high ionization energy, causing incoming ${other.name} atoms to bounce off elastically due to electron cloud shielding and Pauli exclusion.`,
    };
  }

  // Same element (Diatomic check)
  if (elemA.atomicNumber === elemB.atomicNumber) {
    if (['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'].includes(elemA.symbol)) {
      return {
        outcome: 'COVALENT_NONPOLAR',
        isReactive: true,
        bondTypeTitle: 'Nonpolar Diatomic Covalent Molecule',
        compoundFormula: `${elemA.symbol}₂`,
        compoundName: `Diatomic ${elemA.name}`,
        balancedEquation: `2${elemA.symbol} → ${elemA.symbol}₂`,
        energyType: 'exothermic',
        deltaEN: 0.0,
        explanation: `Two identical ${elemA.name} atoms share their valence electrons with zero electronegativity difference (ΔEN = 0.00), forming a perfectly symmetrical nonpolar covalent diatomic molecule.`,
        bondOrder: elemA.symbol === 'N' ? 'Triple Covalent (N≡N)' : elemA.symbol === 'O' ? 'Double Covalent (O=O)' : 'Single Covalent',
      };
    } else {
      return {
        outcome: 'METALLIC_REPULSION',
        isReactive: false,
        bondTypeTitle: 'Elemental Crystal Lattice (Bulk)',
        compoundFormula: `${elemA.symbol} (bulk)`,
        compoundName: `Elemental ${elemA.name}`,
        balancedEquation: `n ${elemA.symbol} → ${elemA.symbol}ₙ (lattice)`,
        energyType: 'inert',
        deltaEN: 0.0,
        explanation: `Identical atoms of ${elemA.name} condense into a bulk elemental solid lattice rather than a discrete binary molecule under standard conditions.`,
      };
    }
  }

  // Parse Electronegativities
  const enA = parseFloat(elemA.electronegativity) || (elemA.category === 'alkali-metal' ? 0.9 : 2.0);
  const enB = parseFloat(elemB.electronegativity) || (elemB.category === 'alkali-metal' ? 0.9 : 2.0);
  const deltaEN = parseFloat(Math.abs(enA - enB).toFixed(2));

  const metalCategories = [
    'alkali-metal',
    'alkaline-earth',
    'transition-metal',
    'post-transition-metal',
    'lanthanide',
    'actinide',
  ];
  const isMetalA = metalCategories.includes(elemA.category);
  const isMetalB = metalCategories.includes(elemB.category);

  // 2B. Metal + Metal -> Metallic Alloy / Repulsion
  if (isMetalA && isMetalB) {
    return {
      outcome: 'METALLIC_REPULSION',
      isReactive: false,
      bondTypeTitle: 'Metallic Solid Solution / Alloy (No Discrete Molecule)',
      compoundFormula: `${elemA.symbol}-${elemB.symbol} Alloy`,
      compoundName: `${elemA.name}–${elemB.name} Metallic Blend`,
      balancedEquation: `${elemA.symbol} + ${elemB.symbol} ↛ No Chemical Molecule (Melting Required)`,
      energyType: 'inert',
      deltaEN,
      explanation: `Both ${elemA.name} and ${elemB.name} are electropositive metals with low electron affinities. They do not exchange or localize electrons into discrete chemical molecules; under standard conditions they bounce off one another unless melted together into an intermetallic alloy.`,
    };
  }

  // 2C. Metal + Non-Metal or High ΔEN -> Ionic Bond
  if ((isMetalA !== isMetalB && deltaEN >= 1.4) || deltaEN >= 1.8) {
    const metal = isMetalA ? elemA : elemB;
    const nonMetal = isMetalA ? elemB : elemA;

    return {
      outcome: 'IONIC_BOND',
      isReactive: true,
      bondTypeTitle: 'Ionic Chemical Bond (Electron Transfer)',
      compoundFormula: `${metal.symbol}${nonMetal.symbol}`,
      compoundName: `${metal.name} ${nonMetal.name}ide`,
      balancedEquation: `${metal.symbol} + ${nonMetal.symbol} → ${metal.symbol}${nonMetal.symbol}`,
      energyType: 'exothermic',
      deltaEN,
      explanation: `Strong electronegativity difference (ΔEN = ${deltaEN.toFixed(2)}) drives the transfer of valence electrons from electropositive ${metal.name} (donor) to electronegative ${nonMetal.name} (acceptor), creating opposite ions bound by coulombic forces.`,
      electronTransferCount: 1,
      donorSymbol: metal.symbol,
      acceptorSymbol: nonMetal.symbol,
      bondOrder: 'Ionic Coulombs Attraction',
    };
  }

  // 2D. Non-Metal + Non-Metal -> Covalent Bond
  if (!isMetalA && !isMetalB) {
    const isPolar = deltaEN >= 0.4;
    return {
      outcome: isPolar ? 'COVALENT_POLAR' : 'COVALENT_NONPOLAR',
      isReactive: true,
      bondTypeTitle: isPolar ? 'Polar Covalent Molecule' : 'Nonpolar Covalent Molecule',
      compoundFormula: `${elemA.symbol}${elemB.symbol}`,
      compoundName: `${elemA.name} ${elemB.name}ide`,
      balancedEquation: `${elemA.symbol} + ${elemB.symbol} → ${elemA.symbol}${elemB.symbol}`,
      energyType: 'exothermic',
      deltaEN,
      explanation: isPolar
        ? `Both elements are nonmetals with a moderate electronegativity difference (ΔEN = ${deltaEN.toFixed(2)}). They share valence electron pairs with an asymmetric dipole density centered toward ${enA > enB ? elemA.name : elemB.name}.`
        : `Both elements are nonmetals with similar electronegativities (ΔEN = ${deltaEN.toFixed(2)} < 0.40). They share electron clouds with near-equal distribution, forming a nonpolar covalent bond.`,
      bondOrder: isPolar ? 'Polar Shared Electron Cloud' : 'Nonpolar Symmetrical Cloud',
    };
  }

  // Fallback Repulsion / Unfavorable
  return {
    outcome: 'UNFAVORABLE_REPULSION',
    isReactive: false,
    bondTypeTitle: 'Thermodynamically Unfavorable (Repulsion)',
    compoundFormula: 'No Reaction',
    compoundName: 'Electrostatic Repulsion',
    balancedEquation: `${elemA.symbol} + ${elemB.symbol} ↛ No Reaction at 298 K`,
    energyType: 'inert',
    deltaEN,
    explanation: `Under standard ambient temperature and pressure (298 K, 1 atm), the activation energy barrier and orbital valence geometry between ${elemA.name} and ${elemB.name} prevent spontaneous bond formation. The atoms repel each other.`,
  };
}
