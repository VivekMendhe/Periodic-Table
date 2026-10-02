export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementBlock = 's' | 'p' | 'd' | 'f';

export type PhaseAtRoomTemp = 'Solid' | 'Liquid' | 'Gas' | 'Unknown';

export type ColorMode = 'category' | 'block' | 'phase' | 'electronegativity';

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: ElementCategory;
  group: number | null;
  period: number;
  block: ElementBlock;
  electronConfiguration: string;
  electronegativity: string;
  oxidationStates: string[];
  meltingPoint: string;
  boilingPoint: string;
  density: string;
  discoveredBy: string;
  discoveryYear: string;
  phaseAtRoomTemperature: PhaseAtRoomTemp;
  description: string;
  shells?: number[];
  applications?: string[];
  funFact?: string;
  meltingPointKelvin?: number | null;
  boilingPointKelvin?: number | null;
}

export interface CategoryInfo {
  id: ElementCategory;
  name: string;
  description: string;
  colorLight: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  colorDark: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}
