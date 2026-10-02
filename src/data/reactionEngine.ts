import type { ElementData, ElementCategory } from '../types/element';

export type ReactionOutcomeType =
  | 'IONIC_BOND'
  | 'COVALENT_POLAR'
  | 'COVALENT_NONPOLAR'
  | 'NOBLE_GAS_REPULSION'
  | 'METALLIC_REPULSION'
  | 'UNFAVORABLE_REPULSION';

export interface ValenceTransferInfo {
  donorShellFrom: string; // e.g. "Outer 3s¹ ring"
  acceptorShellTo: string; // e.g. "Outer 3p⁵ → 3p⁶ octet"
  electronCount: number; // e.g. 1
  transferType: 'leap' | 'share' | 'repel';
}

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
  reactantACount: number; // e.g. 2 for 2Na
  reactantBCount: number; // e.g. 1 for Cl2
  productCount: number; // e.g. 2 for 2NaCl
  productUnits: string; // e.g. "2 Units of NaCl"
  stoichiometryRatioText: string; // e.g. "2 Na + 1 Cl₂ → 2 NaCl (2:1 Ratio)"
  valenceDetails: ValenceTransferInfo;
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
    label: 'Na + Cl (Table Salt ⚡)',
    atomANumber: 11, // Sodium
    atomBNumber: 17, // Chlorine
    category: 'ionic',
    description: '2 Na atoms + 1 Cl₂ molecule → 2 NaCl crystal units. Outer 3s¹ electron leaps to 3p⁵ shell.',
  },
  {
    id: 'h-o',
    label: 'H + O (Water 💧)',
    atomANumber: 1, // Hydrogen
    atomBNumber: 8, // Oxygen
    category: 'covalent',
    description: '2 H atoms + 1 O atom → 1 H₂O molecule. Valence rings overlap to share 2 electron pairs.',
  },
  {
    id: 'c-o',
    label: 'C + O (Carbon Dioxide 🌬️)',
    atomANumber: 6, // Carbon
    atomBNumber: 8, // Oxygen
    category: 'covalent',
    description: '1 C atom + 2 O atoms → 1 CO₂ molecule. Double covalent sharing across overlapping orbital rings.',
  },
  {
    id: 'mg-o',
    label: 'Mg + O (Magnesium Oxide 💥)',
    atomANumber: 12, // Magnesium
    atomBNumber: 8, // Oxygen
    category: 'ionic',
    description: '2 Mg atoms + 1 O₂ molecule → 2 MgO. 2 electrons leap from 3s² ring to 2p⁴ ring.',
  },
  {
    id: 'he-na',
    label: 'He + Na (Noble Reject 🛡️)',
    atomANumber: 2, // Helium
    atomBNumber: 11, // Sodium
    category: 'repulsion',
    description: '1 He + 1 Na → 0 Products. Helium has a full duplet shell (1s²). Electron clouds repel with elastic bounce.',
  },
  {
    id: 'ar-fe',
    label: 'Ar + Fe (Inert Octet 🛑)',
    atomANumber: 18, // Argon
    atomBNumber: 26, // Iron
    category: 'repulsion',
    description: '1 Ar + 1 Fe → 0 Products. Complete octet shields Argon; zero chemical affinity.',
  },
  {
    id: 'li-f',
    label: 'Li + F (Max ΔEN ⚡)',
    atomANumber: 3, // Lithium
    atomBNumber: 9, // Fluorine
    category: 'ionic',
    description: '2 Li atoms + 1 F₂ molecule → 2 LiF. Single 2s¹ valence electron leaps to 2p⁵ octet.',
  },
  {
    id: 'cu-au',
    label: 'Cu + Au (Metal Non-reaction)',
    atomANumber: 29, // Copper
    atomBNumber: 79, // Gold
    category: 'repulsion',
    description: 'Both elements are metal donors; no discrete chemical molecule forms without melting.',
  },
];

export function getBohrShells(atomicNumber: number): number[] {
  const maxPerShell = [2, 8, 18, 32, 32, 18, 8];
  let remaining = atomicNumber;
  const shells: number[] = [];
  for (const max of maxPerShell) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, max);
    shells.push(take);
    remaining -= take;
  }
  return shells.length > 0 ? shells : [1];
}

interface KnownCompound {
  formula: string;
  name: string;
  equation: string;
  outcome: ReactionOutcomeType;
  energyType: 'exothermic' | 'endothermic' | 'inert';
  explanation: string;
  electronTransferCount?: number;
  bondOrder?: string;
  reactantACount: number;
  reactantBCount: number;
  productCount: number;
  productUnits: string;
  stoichiometryRatioText: string;
  valenceDetails: ValenceTransferInfo;
}

const KNOWN_REACTIONS: Record<string, KnownCompound> = {
  '1-8': {
    formula: 'H₂O',
    name: 'Water (Dihydrogen Monoxide)',
    equation: '2H₂ + O₂ → 2H₂O',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: '2 Hydrogen atoms share their 1s¹ electrons with 1 Oxygen atom (2s²2p⁴). The orbital rings overlap, creating two polar covalent shared pairs to complete Oxygen\'s octet.',
    bondOrder: 'Single Polar Covalent (O-H)',
    reactantACount: 2,
    reactantBCount: 1,
    productCount: 1,
    productUnits: '1 Molecule of H₂O',
    stoichiometryRatioText: '2 H atoms + 1 O atom → 1 H₂O molecule (2:1 Ratio)',
    valenceDetails: {
      donorShellFrom: '1s¹ valence ring (2 H atoms)',
      acceptorShellTo: '2p⁴ outer ring → 2p⁶ octet',
      electronCount: 2,
      transferType: 'share',
    },
  },
  '8-1': {
    formula: 'H₂O',
    name: 'Water (Dihydrogen Monoxide)',
    equation: 'O₂ + 2H₂ → 2H₂O',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: '1 Oxygen atom binds with 2 Hydrogen atoms through orbital ring overlap, sharing electrons to yield water.',
    bondOrder: 'Single Polar Covalent (O-H)',
    reactantACount: 1,
    reactantBCount: 2,
    productCount: 1,
    productUnits: '1 Molecule of H₂O',
    stoichiometryRatioText: '1 O atom + 2 H atoms → 1 H₂O molecule (1:2 Ratio)',
    valenceDetails: {
      donorShellFrom: '1s¹ valence ring (2 H atoms)',
      acceptorShellTo: '2p⁴ outer ring → 2p⁶ octet',
      electronCount: 2,
      transferType: 'share',
    },
  },
  '11-17': {
    formula: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    equation: '2Na + Cl₂ → 2NaCl',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: '2 Sodium atoms donate their outermost 3s¹ electron into the 3p⁵ shell of Chlorine. Sodium\'s 3rd ring vanishes (revealing full 2p⁶ octet), and Chlorine gains its 8th electron, establishing 2 NaCl formula units.',
    electronTransferCount: 1,
    bondOrder: 'Ionic Electrostatic Attraction',
    reactantACount: 2,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Formula Units of NaCl',
    stoichiometryRatioText: '2 Na atoms + 1 Cl₂ molecule → 2 NaCl units (2:1:2 Ratio)',
    valenceDetails: {
      donorShellFrom: 'Sodium Outer 3s¹ ring (Shell 3)',
      acceptorShellTo: 'Chlorine Outer 3p⁵ ring → 3p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '17-11': {
    formula: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    equation: 'Cl₂ + 2Na → 2NaCl',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Chlorine strips valence electrons from Sodium, completing its 3p shell into an octet lattice.',
    electronTransferCount: 1,
    bondOrder: 'Ionic Electrostatic Attraction',
    reactantACount: 1,
    reactantBCount: 2,
    productCount: 2,
    productUnits: '2 Formula Units of NaCl',
    stoichiometryRatioText: '1 Cl₂ molecule + 2 Na atoms → 2 NaCl units',
    valenceDetails: {
      donorShellFrom: 'Sodium Outer 3s¹ ring',
      acceptorShellTo: 'Chlorine Outer 3p⁵ ring → 3p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '12-8': {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    equation: '2Mg + O₂ → 2MgO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: '2 Magnesium atoms each leap 2 valence electrons from their 3s² outer ring into the 2p⁴ outer ring of Oxygen, releasing intense white exothermic light and creating 2 units of refractory MgO.',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Bond (Mg²⁺ O²⁻)',
    reactantACount: 2,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Formula Units of MgO',
    stoichiometryRatioText: '2 Mg atoms + 1 O₂ molecule → 2 MgO units (2:1:2 Ratio)',
    valenceDetails: {
      donorShellFrom: 'Magnesium Outer 3s² ring (Shell 3)',
      acceptorShellTo: 'Oxygen Outer 2p⁴ ring → 2p⁶ octet',
      electronCount: 2,
      transferType: 'leap',
    },
  },
  '8-12': {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    equation: 'O₂ + 2Mg → 2MgO',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Oxygen takes 2 electrons per atom from Magnesium to form crystalline MgO units.',
    electronTransferCount: 2,
    bondOrder: 'Bivalent Ionic Bond (Mg²⁺ O²⁻)',
    reactantACount: 1,
    reactantBCount: 2,
    productCount: 2,
    productUnits: '2 Formula Units of MgO',
    stoichiometryRatioText: '1 O₂ molecule + 2 Mg atoms → 2 MgO units',
    valenceDetails: {
      donorShellFrom: 'Magnesium Outer 3s² ring',
      acceptorShellTo: 'Oxygen Outer 2p⁴ ring → 2p⁶ octet',
      electronCount: 2,
      transferType: 'leap',
    },
  },
  '6-8': {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    equation: 'C + O₂ → CO₂',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: '1 Carbon atom (4 valence e⁻) overlaps rings with 2 Oxygen atoms (6 valence e⁻ each) to form 4 shared electron pairs (double covalent O=C=O bonds), yielding 1 linear CO₂ molecule.',
    bondOrder: 'Double Covalent (O=C=O)',
    reactantACount: 1,
    reactantBCount: 1,
    productCount: 1,
    productUnits: '1 Molecule of CO₂',
    stoichiometryRatioText: '1 C atom + 1 O₂ molecule → 1 CO₂ molecule (1:1 Ratio)',
    valenceDetails: {
      donorShellFrom: 'Carbon 2s²2p² outer ring',
      acceptorShellTo: 'Oxygen 2s²2p⁴ outer ring (4 shared pairs)',
      electronCount: 4,
      transferType: 'share',
    },
  },
  '8-6': {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    equation: 'O₂ + C → CO₂',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Oxygen molecules and Carbon react via ring overlap into stable carbon dioxide gas.',
    bondOrder: 'Double Covalent (O=C=O)',
    reactantACount: 1,
    reactantBCount: 1,
    productCount: 1,
    productUnits: '1 Molecule of CO₂',
    stoichiometryRatioText: '1 O₂ molecule + 1 C atom → 1 CO₂ molecule',
    valenceDetails: {
      donorShellFrom: 'Carbon 2s²2p² outer ring',
      acceptorShellTo: 'Oxygen 2s²2p⁴ outer ring (4 shared pairs)',
      electronCount: 4,
      transferType: 'share',
    },
  },
  '3-9': {
    formula: 'LiF',
    name: 'Lithium Fluoride',
    equation: '2Li + F₂ → 2LiF',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: '2 Lithium atoms transfer their lone 2s¹ valence electron to Fluorine (2s²2p⁵). Lithium\'s outer ring collapses leaving a 1s² duplet, and Fluorine achieves 2p⁶ octet, producing 2 LiF units.',
    electronTransferCount: 1,
    bondOrder: 'Strong Ionic Bond',
    reactantACount: 2,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Formula Units of LiF',
    stoichiometryRatioText: '2 Li atoms + 1 F₂ molecule → 2 LiF units',
    valenceDetails: {
      donorShellFrom: 'Lithium Outer 2s¹ ring',
      acceptorShellTo: 'Fluorine Outer 2p⁵ ring → 2p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '9-3': {
    formula: 'LiF',
    name: 'Lithium Fluoride',
    equation: 'F₂ + 2Li → 2LiF',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Fluorine strips electrons from Lithium into an ionic salt structure.',
    electronTransferCount: 1,
    bondOrder: 'Strong Ionic Bond',
    reactantACount: 1,
    reactantBCount: 2,
    productCount: 2,
    productUnits: '2 Formula Units of LiF',
    stoichiometryRatioText: '1 F₂ molecule + 2 Li atoms → 2 LiF units',
    valenceDetails: {
      donorShellFrom: 'Lithium Outer 2s¹ ring',
      acceptorShellTo: 'Fluorine Outer 2p⁵ ring → 2p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '1-17': {
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    equation: 'H₂ + Cl₂ → 2HCl',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: '1 H₂ molecule (2 atoms) and 1 Cl₂ molecule (2 atoms) overlap orbital rings to share two electron pairs, yielding 2 HCl polar gas molecules.',
    bondOrder: 'Polar Single Covalent',
    reactantACount: 1,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Molecules of HCl',
    stoichiometryRatioText: '1 H₂ + 1 Cl₂ → 2 HCl molecules (1:1:2 Ratio)',
    valenceDetails: {
      donorShellFrom: 'Hydrogen 1s¹ ring',
      acceptorShellTo: 'Chlorine 3p⁵ ring (Shared pair)',
      electronCount: 1,
      transferType: 'share',
    },
  },
  '17-1': {
    formula: 'HCl',
    name: 'Hydrogen Chloride',
    equation: 'Cl₂ + H₂ → 2HCl',
    outcome: 'COVALENT_POLAR',
    energyType: 'exothermic',
    explanation: 'Chlorine and Hydrogen share electron pairs to produce 2 molecules of HCl.',
    bondOrder: 'Polar Single Covalent',
    reactantACount: 1,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Molecules of HCl',
    stoichiometryRatioText: '1 Cl₂ + 1 H₂ → 2 HCl molecules',
    valenceDetails: {
      donorShellFrom: 'Hydrogen 1s¹ ring',
      acceptorShellTo: 'Chlorine 3p⁵ ring',
      electronCount: 1,
      transferType: 'share',
    },
  },
  '19-35': {
    formula: 'KBr',
    name: 'Potassium Bromide',
    equation: '2K + Br₂ → 2KBr',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: '2 Potassium atoms leap their 4s¹ electrons into Bromine 4p⁵ shells, forming 2 units of crystalline KBr salt.',
    electronTransferCount: 1,
    bondOrder: 'Single Ionic Bond',
    reactantACount: 2,
    reactantBCount: 1,
    productCount: 2,
    productUnits: '2 Formula Units of KBr',
    stoichiometryRatioText: '2 K atoms + 1 Br₂ molecule → 2 KBr units',
    valenceDetails: {
      donorShellFrom: 'Potassium Outer 4s¹ ring',
      acceptorShellTo: 'Bromine Outer 4p⁵ ring → 4p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '35-19': {
    formula: 'KBr',
    name: 'Potassium Bromide',
    equation: 'Br₂ + 2K → 2KBr',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Bromine oxidizes potassium metal, forming 2 units of KBr.',
    electronTransferCount: 1,
    bondOrder: 'Single Ionic Bond',
    reactantACount: 1,
    reactantBCount: 2,
    productCount: 2,
    productUnits: '2 Formula Units of KBr',
    stoichiometryRatioText: '1 Br₂ + 2 K → 2 KBr units',
    valenceDetails: {
      donorShellFrom: 'Potassium Outer 4s¹ ring',
      acceptorShellTo: 'Bromine Outer 4p⁵ ring → 4p⁶ octet',
      electronCount: 1,
      transferType: 'leap',
    },
  },
  '26-8': {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide (Rust)',
    equation: '4Fe + 3O₂ → 2Fe₂O₃',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: '4 Iron atoms donate valence electrons into 3 Oxygen molecules (6 O atoms), yielding 2 units of reddish-brown rust (Fe₂O₃).',
    electronTransferCount: 3,
    bondOrder: 'Transition Metal Ionic Lattice',
    reactantACount: 4,
    reactantBCount: 3,
    productCount: 2,
    productUnits: '2 Formula Units of Fe₂O₃',
    stoichiometryRatioText: '4 Fe atoms + 3 O₂ molecules → 2 Fe₂O₃ units (4:3:2 Ratio)',
    valenceDetails: {
      donorShellFrom: 'Iron Outer 4s²3d⁶ ring',
      acceptorShellTo: 'Oxygen Outer 2p⁴ ring → 2p⁶ octet',
      electronCount: 3,
      transferType: 'leap',
    },
  },
  '8-26': {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide (Rust)',
    equation: '3O₂ + 4Fe → 2Fe₂O₃',
    outcome: 'IONIC_BOND',
    energyType: 'exothermic',
    explanation: 'Oxygen oxidizes Iron into rust units.',
    electronTransferCount: 3,
    bondOrder: 'Transition Metal Ionic Lattice',
    reactantACount: 3,
    reactantBCount: 4,
    productCount: 2,
    productUnits: '2 Formula Units of Fe₂O₃',
    stoichiometryRatioText: '3 O₂ molecules + 4 Fe atoms → 2 Fe₂O₃ units',
    valenceDetails: {
      donorShellFrom: 'Iron Outer 4s²3d⁶ ring',
      acceptorShellTo: 'Oxygen Outer 2p⁴ ring → 2p⁶ octet',
      electronCount: 3,
      transferType: 'leap',
    },
  },
};

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
      reactantACount: known.reactantACount,
      reactantBCount: known.reactantBCount,
      productCount: known.productCount,
      productUnits: known.productUnits,
      stoichiometryRatioText: known.stoichiometryRatioText,
      valenceDetails: known.valenceDetails,
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
      reactantACount: 1,
      reactantBCount: 1,
      productCount: 0,
      productUnits: '0 Products (Atoms separate)',
      stoichiometryRatioText: `1 ${elemA.symbol} + 1 ${elemB.symbol} ↛ 0 Products (Repulsion)`,
      valenceDetails: {
        donorShellFrom: 'None (Inert)',
        acceptorShellTo: `${noble.symbol} octet is already saturated (8 e⁻)`,
        electronCount: 0,
        transferType: 'repel',
      },
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
        explanation: `Two identical ${elemA.name} atoms share their valence orbital rings with zero electronegativity difference (ΔEN = 0.00), forming a perfectly symmetrical diatomic covalent molecule.`,
        bondOrder: elemA.symbol === 'N' ? 'Triple Covalent (N≡N)' : elemA.symbol === 'O' ? 'Double Covalent (O=O)' : 'Single Covalent',
        reactantACount: 2,
        reactantBCount: 0,
        productCount: 1,
        productUnits: `1 Molecule of ${elemA.symbol}₂`,
        stoichiometryRatioText: `2 ${elemA.symbol} atoms → 1 ${elemA.symbol}₂ molecule`,
        valenceDetails: {
          donorShellFrom: `${elemA.symbol} valence ring`,
          acceptorShellTo: `Shared orbital loop between both ${elemA.symbol} atoms`,
          electronCount: 2,
          transferType: 'share',
        },
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
        reactantACount: 1,
        reactantBCount: 1,
        productCount: 0,
        productUnits: 'Bulk lattice solid',
        stoichiometryRatioText: `1 ${elemA.symbol} + 1 ${elemB.symbol} → Bulk solid phase`,
        valenceDetails: {
          donorShellFrom: 'Delocalized electron sea',
          acceptorShellTo: 'Lattice coordination',
          electronCount: 0,
          transferType: 'repel',
        },
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
      reactantACount: 1,
      reactantBCount: 1,
      productCount: 0,
      productUnits: '0 Molecules (Solid blend only)',
      stoichiometryRatioText: `1 ${elemA.symbol} + 1 ${elemB.symbol} ↛ Alloy blend (Requires high heat)`,
      valenceDetails: {
        donorShellFrom: 'Both metals are donors',
        acceptorShellTo: 'No acceptor orbital available',
        electronCount: 0,
        transferType: 'repel',
      },
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
      balancedEquation: `2${metal.symbol} + ${nonMetal.symbol}₂ → 2${metal.symbol}${nonMetal.symbol}`,
      energyType: 'exothermic',
      deltaEN,
      explanation: `Strong electronegativity difference (ΔEN = ${deltaEN.toFixed(2)}) drives the transfer of valence electrons from electropositive ${metal.name} (donor) into the outer ring of electronegative ${nonMetal.name} (acceptor), creating opposite ions bound by coulombic forces.`,
      electronTransferCount: 1,
      donorSymbol: metal.symbol,
      acceptorSymbol: nonMetal.symbol,
      bondOrder: 'Ionic Coulombs Attraction',
      reactantACount: 2,
      reactantBCount: 1,
      productCount: 2,
      productUnits: `2 Formula Units of ${metal.symbol}${nonMetal.symbol}`,
      stoichiometryRatioText: `2 ${metal.symbol} atoms + 1 ${nonMetal.symbol}₂ molecule → 2 ${metal.symbol}${nonMetal.symbol} units`,
      valenceDetails: {
        donorShellFrom: `${metal.symbol} outermost valence ring`,
        acceptorShellTo: `${nonMetal.symbol} outermost octet ring`,
        electronCount: 1,
        transferType: 'leap',
      },
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
        ? `Both elements are nonmetals with a moderate electronegativity difference (ΔEN = ${deltaEN.toFixed(2)}). Their outer rings overlap, sharing electron pairs with an asymmetric dipole density centered toward ${enA > enB ? elemA.name : elemB.name}.`
        : `Both elements are nonmetals with similar electronegativities (ΔEN = ${deltaEN.toFixed(2)} < 0.40). Their outer rings overlap to share electron clouds with near-equal distribution, forming a nonpolar covalent bond.`,
      bondOrder: isPolar ? 'Polar Shared Electron Cloud' : 'Nonpolar Symmetrical Cloud',
      reactantACount: 1,
      reactantBCount: 1,
      productCount: 1,
      productUnits: `1 Molecule of ${elemA.symbol}${elemB.symbol}`,
      stoichiometryRatioText: `1 ${elemA.symbol} atom + 1 ${elemB.symbol} atom → 1 ${elemA.symbol}${elemB.symbol} molecule (1:1 Ratio)`,
      valenceDetails: {
        donorShellFrom: `${elemA.symbol} valence ring`,
        acceptorShellTo: `Shared orbital overlap with ${elemB.symbol}`,
        electronCount: 2,
        transferType: 'share',
      },
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
    reactantACount: 1,
    reactantBCount: 1,
    productCount: 0,
    productUnits: '0 Products (Repulsion)',
    stoichiometryRatioText: `1 ${elemA.symbol} + 1 ${elemB.symbol} ↛ No bond formed`,
    valenceDetails: {
      donorShellFrom: 'Valence orbitals misaligned',
      acceptorShellTo: 'No stable overlap geometry',
      electronCount: 0,
      transferType: 'repel',
    },
  };
}

export interface AtomVisualNode {
  id: string;
  symbol: string;
  name: string;
  atomicNumber: number;
  category: ElementCategory;
  role: 'reactantA' | 'reactantB';
  startX: number; // percentage (0-100)
  startY: number; // percentage (0-100)
  bondedX: number; // percentage (0-100)
  bondedY: number; // percentage (0-100)
  radius: number; // px radius
  chargeSign?: '+' | '−';
}

export interface BondConnectionLine {
  id: string;
  fromAtomId: string;
  toAtomId: string;
  isDouble?: boolean;
}

export interface ReactionAssemblyPlan {
  atoms: AtomVisualNode[];
  bonds: BondConnectionLine[];
}

export function generateAtomAssemblyLayout(
  elemA: ElementData,
  elemB: ElementData,
  reaction: ReactionResult
): ReactionAssemblyPlan {
  const isIonic = reaction.outcome === 'IONIC_BOND';
  const isCovalent = reaction.outcome === 'COVALENT_POLAR' || reaction.outcome === 'COVALENT_NONPOLAR';
  const isRepulsion = !reaction.isReactive;

  // Water H2O (2 H + 1 O)
  if (
    (elemA.symbol === 'H' && elemB.symbol === 'O') ||
    (elemA.symbol === 'O' && elemB.symbol === 'H')
  ) {
    const isA_Hydrogen = elemA.symbol === 'H';
    const hElem = isA_Hydrogen ? elemA : elemB;
    const oElem = isA_Hydrogen ? elemB : elemA;

    return {
      atoms: [
        {
          id: 'h1',
          symbol: 'H',
          name: 'Hydrogen',
          atomicNumber: 1,
          category: hElem.category,
          role: isA_Hydrogen ? 'reactantA' : 'reactantB',
          startX: isA_Hydrogen ? 18 : 82,
          startY: 30,
          bondedX: 40,
          bondedY: 34,
          radius: 20,
        },
        {
          id: 'h2',
          symbol: 'H',
          name: 'Hydrogen',
          atomicNumber: 1,
          category: hElem.category,
          role: isA_Hydrogen ? 'reactantA' : 'reactantB',
          startX: isA_Hydrogen ? 18 : 82,
          startY: 70,
          bondedX: 40,
          bondedY: 66,
          radius: 20,
        },
        {
          id: 'o1',
          symbol: 'O',
          name: 'Oxygen',
          atomicNumber: 8,
          category: oElem.category,
          role: isA_Hydrogen ? 'reactantB' : 'reactantA',
          startX: isA_Hydrogen ? 82 : 18,
          startY: 50,
          bondedX: 56,
          bondedY: 50,
          radius: 34,
        },
      ],
      bonds: [
        { id: 'b1', fromAtomId: 'o1', toAtomId: 'h1' },
        { id: 'b2', fromAtomId: 'o1', toAtomId: 'h2' },
      ],
    };
  }

  // Carbon Dioxide CO2 (1 C + 2 O)
  if (
    (elemA.symbol === 'C' && elemB.symbol === 'O') ||
    (elemA.symbol === 'O' && elemB.symbol === 'C')
  ) {
    const isA_Carbon = elemA.symbol === 'C';
    const cElem = isA_Carbon ? elemA : elemB;
    const oElem = isA_Carbon ? elemB : elemA;

    return {
      atoms: [
        {
          id: 'c1',
          symbol: 'C',
          name: 'Carbon',
          atomicNumber: 6,
          category: cElem.category,
          role: isA_Carbon ? 'reactantA' : 'reactantB',
          startX: isA_Carbon ? 18 : 82,
          startY: 50,
          bondedX: 50,
          bondedY: 50,
          radius: 32,
        },
        {
          id: 'o1',
          symbol: 'O',
          name: 'Oxygen',
          atomicNumber: 8,
          category: oElem.category,
          role: isA_Carbon ? 'reactantB' : 'reactantA',
          startX: isA_Carbon ? 82 : 18,
          startY: 32,
          bondedX: 32,
          bondedY: 50,
          radius: 28,
        },
        {
          id: 'o2',
          symbol: 'O',
          name: 'Oxygen',
          atomicNumber: 8,
          category: oElem.category,
          role: isA_Carbon ? 'reactantB' : 'reactantA',
          startX: isA_Carbon ? 82 : 18,
          startY: 68,
          bondedX: 68,
          bondedY: 50,
          radius: 28,
        },
      ],
      bonds: [
        { id: 'b1', fromAtomId: 'c1', toAtomId: 'o1', isDouble: true },
        { id: 'b2', fromAtomId: 'c1', toAtomId: 'o2', isDouble: true },
      ],
    };
  }

  // Table Salt NaCl (2 Na + 2 Cl or 1:1 pair)
  if (
    (elemA.symbol === 'Na' && elemB.symbol === 'Cl') ||
    (elemA.symbol === 'Cl' && elemB.symbol === 'Na')
  ) {
    const isA_Na = elemA.symbol === 'Na';
    const naElem = isA_Na ? elemA : elemB;
    const clElem = isA_Na ? elemB : elemA;

    return {
      atoms: [
        {
          id: 'na1',
          symbol: 'Na',
          name: 'Sodium',
          atomicNumber: 11,
          category: naElem.category,
          role: isA_Na ? 'reactantA' : 'reactantB',
          startX: isA_Na ? 18 : 82,
          startY: 34,
          bondedX: 38,
          bondedY: 38,
          radius: 28,
          chargeSign: '+',
        },
        {
          id: 'cl1',
          symbol: 'Cl',
          name: 'Chlorine',
          atomicNumber: 17,
          category: clElem.category,
          role: isA_Na ? 'reactantB' : 'reactantA',
          startX: isA_Na ? 82 : 18,
          startY: 34,
          bondedX: 52,
          bondedY: 38,
          radius: 32,
          chargeSign: '−',
        },
        {
          id: 'na2',
          symbol: 'Na',
          name: 'Sodium',
          atomicNumber: 11,
          category: naElem.category,
          role: isA_Na ? 'reactantA' : 'reactantB',
          startX: isA_Na ? 18 : 82,
          startY: 66,
          bondedX: 48,
          bondedY: 66,
          radius: 28,
          chargeSign: '+',
        },
        {
          id: 'cl2',
          symbol: 'Cl',
          name: 'Chlorine',
          atomicNumber: 17,
          category: clElem.category,
          role: isA_Na ? 'reactantB' : 'reactantA',
          startX: isA_Na ? 82 : 18,
          startY: 66,
          bondedX: 62,
          bondedY: 66,
          radius: 32,
          chargeSign: '−',
        },
      ],
      bonds: [
        { id: 'b1', fromAtomId: 'na1', toAtomId: 'cl1' },
        { id: 'b2', fromAtomId: 'na2', toAtomId: 'cl2' },
      ],
    };
  }

  // Repulsion cases
  if (isRepulsion) {
    return {
      atoms: [
        {
          id: 'atom-a',
          symbol: elemA.symbol,
          name: elemA.name,
          atomicNumber: elemA.atomicNumber,
          category: elemA.category,
          role: 'reactantA',
          startX: 20,
          startY: 50,
          bondedX: 10, // Bounced back!
          bondedY: 50,
          radius: 32,
        },
        {
          id: 'atom-b',
          symbol: elemB.symbol,
          name: elemB.name,
          atomicNumber: elemB.atomicNumber,
          category: elemB.category,
          role: 'reactantB',
          startX: 80,
          startY: 50,
          bondedX: 90, // Bounced back!
          bondedY: 50,
          radius: 32,
        },
      ],
      bonds: [],
    };
  }

  // General 1:1 reaction
  const donorIsA = reaction.donorSymbol === elemA.symbol;
  return {
    atoms: [
      {
        id: 'atom-a',
        symbol: elemA.symbol,
        name: elemA.name,
        atomicNumber: elemA.atomicNumber,
        category: elemA.category,
        role: 'reactantA',
        startX: 22,
        startY: 50,
        bondedX: 43,
        bondedY: 50,
        radius: 30,
        chargeSign: isIonic ? (donorIsA ? '+' : '−') : undefined,
      },
      {
        id: 'atom-b',
        symbol: elemB.symbol,
        name: elemB.name,
        atomicNumber: elemB.atomicNumber,
        category: elemB.category,
        role: 'reactantB',
        startX: 78,
        startY: 50,
        bondedX: 57,
        bondedY: 50,
        radius: 32,
        chargeSign: isIonic ? (donorIsA ? '−' : '+') : undefined,
      },
    ],
    bonds: [
      { id: 'b1', fromAtomId: 'atom-a', toAtomId: 'atom-b', isDouble: isCovalent && reaction.bondOrder?.includes('Double') },
    ],
  };
}
