import type { ElementBlock, ElementData } from '../types/element';

/**
 * Scientifically verified electron distribution per shell (K, L, M, N, O, P, Q)
 * for all 118 chemical elements according to IUPAC standards.
 */
export const ELEMENT_SHELLS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [2, 1],
  4: [2, 2],
  5: [2, 3],
  6: [2, 4],
  7: [2, 5],
  8: [2, 6],
  9: [2, 7],
  10: [2, 8],
  11: [2, 8, 1],
  12: [2, 8, 2],
  13: [2, 8, 3],
  14: [2, 8, 4],
  15: [2, 8, 5],
  16: [2, 8, 6],
  17: [2, 8, 7],
  18: [2, 8, 8],
  19: [2, 8, 8, 1],
  20: [2, 8, 8, 2],
  21: [2, 8, 9, 2],
  22: [2, 8, 10, 2],
  23: [2, 8, 11, 2],
  24: [2, 8, 13, 1], // Cr exception
  25: [2, 8, 13, 2],
  26: [2, 8, 14, 2],
  27: [2, 8, 15, 2],
  28: [2, 8, 16, 2],
  29: [2, 8, 18, 1], // Cu exception
  30: [2, 8, 18, 2],
  31: [2, 8, 18, 3],
  32: [2, 8, 18, 4],
  33: [2, 8, 18, 5],
  34: [2, 8, 18, 6],
  35: [2, 8, 18, 7],
  36: [2, 8, 18, 8],
  37: [2, 8, 18, 8, 1],
  38: [2, 8, 18, 8, 2],
  39: [2, 8, 18, 9, 2],
  40: [2, 8, 18, 10, 2],
  41: [2, 8, 18, 12, 1], // Nb exception
  42: [2, 8, 18, 13, 1], // Mo exception
  43: [2, 8, 18, 13, 2],
  44: [2, 8, 18, 15, 1], // Ru exception
  45: [2, 8, 18, 16, 1], // Rh exception
  46: [2, 8, 18, 18],    // Pd exception (0 in O shell)
  47: [2, 8, 18, 18, 1], // Ag exception
  48: [2, 8, 18, 18, 2],
  49: [2, 8, 18, 18, 3],
  50: [2, 8, 18, 18, 4],
  51: [2, 8, 18, 18, 5],
  52: [2, 8, 18, 18, 6],
  53: [2, 8, 18, 18, 7],
  54: [2, 8, 18, 18, 8],
  55: [2, 8, 18, 18, 8, 1],
  56: [2, 8, 18, 18, 8, 2],
  57: [2, 8, 18, 18, 9, 2],
  58: [2, 8, 18, 19, 9, 2],
  59: [2, 8, 18, 21, 8, 2],
  60: [2, 8, 18, 22, 8, 2],
  61: [2, 8, 18, 23, 8, 2],
  62: [2, 8, 18, 24, 8, 2],
  63: [2, 8, 18, 25, 8, 2],
  64: [2, 8, 18, 25, 9, 2], // Gd exception
  65: [2, 8, 18, 27, 8, 2],
  66: [2, 8, 18, 28, 8, 2],
  67: [2, 8, 18, 29, 8, 2],
  68: [2, 8, 18, 30, 8, 2],
  69: [2, 8, 18, 31, 8, 2],
  70: [2, 8, 18, 32, 8, 2],
  71: [2, 8, 18, 32, 9, 2],
  72: [2, 8, 18, 32, 10, 2],
  73: [2, 8, 18, 32, 11, 2],
  74: [2, 8, 18, 32, 12, 2],
  75: [2, 8, 18, 32, 13, 2],
  76: [2, 8, 18, 32, 14, 2],
  77: [2, 8, 18, 32, 15, 2],
  78: [2, 8, 18, 32, 17, 1], // Pt exception
  79: [2, 8, 18, 32, 18, 1], // Au exception
  80: [2, 8, 18, 32, 18, 2],
  81: [2, 8, 18, 32, 18, 3],
  82: [2, 8, 18, 32, 18, 4],
  83: [2, 8, 18, 32, 18, 5],
  84: [2, 8, 18, 32, 18, 6],
  85: [2, 8, 18, 32, 18, 7],
  86: [2, 8, 18, 32, 18, 8],
  87: [2, 8, 18, 32, 18, 8, 1],
  88: [2, 8, 18, 32, 18, 8, 2],
  89: [2, 8, 18, 32, 18, 9, 2],
  90: [2, 8, 18, 32, 18, 10, 2],
  91: [2, 8, 18, 32, 20, 9, 2],
  92: [2, 8, 18, 32, 21, 9, 2],
  93: [2, 8, 18, 32, 22, 9, 2],
  94: [2, 8, 18, 32, 24, 8, 2],
  95: [2, 8, 18, 32, 25, 8, 2],
  96: [2, 8, 18, 32, 25, 9, 2],
  97: [2, 8, 18, 32, 27, 8, 2],
  98: [2, 8, 18, 32, 28, 8, 2],
  99: [2, 8, 18, 32, 29, 8, 2],
  100: [2, 8, 18, 32, 30, 8, 2],
  101: [2, 8, 18, 32, 31, 8, 2],
  102: [2, 8, 18, 32, 32, 8, 2],
  103: [2, 8, 18, 32, 32, 8, 3],
  104: [2, 8, 18, 32, 32, 10, 2],
  105: [2, 8, 18, 32, 32, 11, 2],
  106: [2, 8, 18, 32, 32, 12, 2],
  107: [2, 8, 18, 32, 32, 13, 2],
  108: [2, 8, 18, 32, 32, 14, 2],
  109: [2, 8, 18, 32, 32, 15, 2],
  110: [2, 8, 18, 32, 32, 16, 2],
  111: [2, 8, 18, 32, 32, 17, 2],
  112: [2, 8, 18, 32, 32, 18, 2],
  113: [2, 8, 18, 32, 32, 18, 3],
  114: [2, 8, 18, 32, 32, 18, 4],
  115: [2, 8, 18, 32, 32, 18, 5],
  116: [2, 8, 18, 32, 32, 18, 6],
  117: [2, 8, 18, 32, 32, 18, 7],
  118: [2, 8, 18, 32, 32, 18, 8],
};

/**
 * Key real-world applications for chemical elements
 */
export const ELEMENT_APPLICATIONS: Record<number, string[]> = {
  1: ['Rocket propellant fuel', 'Ammonia fertilizer production', 'Hydrogen fuel cells', 'Petroleum hydrocracking'],
  2: ['MRI scanner superconducting magnet coolant', 'Deep-sea diving breathing gas (Heliox)', 'Party & scientific weather balloons', 'Semiconductor manufacturing atmosphere'],
  3: ['Rechargeable lithium-ion batteries', 'Psychiatric mood stabilizer medications', 'High-temperature lubricating greases', 'Aircraft lightweight aluminum-lithium alloys'],
  4: ['Aerospace spacecraft structural mirrors', 'X-ray tube transmission windows', 'Non-sparking copper-beryllium tools', 'Particle physics accelerator beam pipes'],
  5: ['Borosilicate heat-resistant glass (Pyrex)', 'Agricultural micronutrient fertilizers', 'Kevlar bulletproof composite additives', 'Nuclear reactor control rod neutron absorbers'],
  6: ['Organic chemistry & all living organisms', 'Carbon-fiber structural composites', 'Diamond cutting tools & jewelry', 'Steel production & graphite battery anodes'],
  7: ['Haber-Bosch industrial ammonia synthesis', 'Cryogenic liquid nitrogen preservation', 'Inert food packaging atmosphere', 'Explosives, nitrates, and gunpowder'],
  8: ['Aerobic cellular respiration in living organisms', 'Hospital medical oxygen therapy', 'Steel production oxygen blast furnaces', 'Rocket fuel liquid oxidizer (LOX)'],
  9: ['Drinking water fluoridation & dental cavity protection', 'PTFE non-stick polymers (Teflon)', 'Uranium hexafluoride enrichment processing', 'Refrigerants and air-conditioning gases'],
  10: ['Neon advertising glow signs & lasers', 'High-voltage vacuum tube indicators', 'Cryogenic refrigerant for specialized electronics', 'Lightning arrestors'],
  11: ['Table salt (Sodium chloride) seasoning', 'Liquid sodium nuclear coolant', 'Street lighting sodium-vapor lamps', 'Baking soda, soaps, and chemical synthesis'],
  12: ['Lightweight structural alloys for racing & laptops', 'Chlorophyll photosynthesis core in plants', 'Flares, sparklers, and fireworks', 'Antacids and laxatives (Milk of Magnesia)'],
  13: ['Aircraft, automotive, and building structures', 'Beverage cans, kitchen foil, and cooking pans', 'High-voltage overhead electrical power lines', 'Window frames and lightweight bicycle frames'],
  14: ['Semiconductor computer microchips & CPUs', 'Solar photovoltaic power cells', 'Silicone sealants, adhesives, and kitchenware', 'Glass, concrete, and ceramic manufacturing'],
  15: ['Agricultural NPK crop fertilizers', 'DNA and RNA genetic backbone in cells', 'Safety match heads & pyrotechnics', 'Industrial water softeners & detergents'],
  16: ['Sulfuric acid industrial production (top chemical globally)', 'Rubber vulcanization for car tires', 'Gunpowder, matches, and fireworks', 'Fungicides and skin treatments'],
  17: ['Municipal water purification & disinfection', 'PVC piping, vinyl siding, and vinyl flooring', 'Household bleach and sanitizing agents', 'Pharmaceutical synthesis & crop protection'],
  18: ['TIG/MIG inert shielding gas for welding', 'Double-pane insulated energy-saving windows', 'Incandescent and fluorescent light bulbs', 'Titanium and reactive metal processing'],
  19: ['Potash agricultural crop fertilizers', 'Nerve signal transmission in the human body', 'Potassium hydroxide liquid soaps', 'Food preservation and pickling salts'],
  20: ['Bone and teeth skeletal mineralization', 'Cement, concrete, and construction mortar', 'Cheese making & food processing', 'Steelmaking deoxidizer and alloy desulfurizer'],
  26: ['Steel construction girders, bridges, and skyscrapers', 'Automotive frames and engine blocks', 'Hemoglobin oxygen carrier in human blood', 'Magnetic transformer cores and electrical tools'],
  28: ['Stainless steel alloy production', 'Rechargeable nickel-metal hydride & Li-ion batteries', 'Corrosion-resistant electroplating', 'Gas turbine engine blades & coins'],
  29: ['Electrical wiring and power grid cables', 'Plumbing pipes, fittings, and HVAC tubing', 'Printed circuit board conductive traces', 'Brass and bronze architectural hardware'],
  30: ['Galvanized anti-corrosion coating for steel', 'Brass alloy component manufacturing', 'Die-cast automotive parts and toys', 'Zinc oxide sunscreens and skin creams'],
  47: ['Solar cell silver conductive paste', 'Fine jewelry, silverware, and bullion coins', 'Antibacterial medical wound dressings', 'High-fidelity audio connectors and switches'],
  78: ['Catalytic converters in automobile exhausts', 'Chemotherapy anti-cancer drugs (Cisplatin)', 'High-end fine jewelry and luxury watches', 'Chemical industry catalysts and laboratory crucibles'],
  79: ['Monetary reserve bullion and investment coins', 'Corrosion-free gold bond wires in electronics', 'Spacecraft heat-reflective astronaut visor foils', 'High-end jewelry and dental restorations'],
  80: ['Historical mercury fever thermometers', 'Fluorescent lighting tube vapor', 'Dental silver amalgam tooth fillings', 'Barometers and industrial electrical switches'],
  82: ['Automotive 12V lead-acid starter batteries', 'Hospital radiation and X-ray shielding aprons', 'Acoustic soundproofing architectural barriers', 'Stained-glass window came and solders'],
  92: ['Nuclear power generation fuel pellets (U-235)', 'Naval nuclear submarine propulsion reactors', 'Depleted uranium armor-piercing kinetic rounds', 'Historical uranium glass fluorescent art'],
};

/**
 * Fun educational facts for chemical elements
 */
export const ELEMENT_FUN_FACTS: Record<number, string> = {
  1: 'Hydrogen makes up over 90% of all atoms and 75% of all mass in the universe.',
  2: 'Helium was first discovered on the Sun via spectroscopy 27 years before it was found on Earth!',
  3: 'Lithium is so light that it can float on water (and even on kerosene), yet burns with a brilliant crimson flame.',
  4: 'Pure emeralds get their rich green color from chromium impurities inside a beryllium mineral (Beryl).',
  5: 'Boron carbide is one of the hardest materials known to humankind, utilized in tank armor and bulletproof vests.',
  6: 'Carbon is the basis for all known life, forming millions of compounds ranging from soft pencil graphite to ultra-hard diamond.',
  7: 'Nitrogen gas forms about 78% of Earth’s atmosphere, keeping the air stable and preventing runaway combustion.',
  8: 'Liquid oxygen is pale sky-blue and exhibits strong attraction to magnets (paramagnetic).',
  9: 'Fluorine is the most chemically reactive and electronegative of all elements; it reacts violently with almost everything, even water.',
  10: 'Only pure neon produces the iconic reddish-orange glow in "neon signs"; all other colors come from different gases or coatings.',
  11: 'Sodium is a soft metal you can slice with a butter knife, but it reacts explosively when dropped into water.',
  12: 'Burning magnesium produces an intense ultraviolet-white light so bright it was historically used in photographic flashbulbs.',
  13: 'In the 1850s, aluminum was rarer and more valuable than gold; Emperor Napoleon III ate with aluminum cutlery while guests had gold.',
  14: 'The second most abundant element in Earth’s crust (28%), silicon gave its name to Silicon Valley for its computer chip supremacy.',
  15: 'Phosphorus was discovered in 1669 by alchemist Hennig Brand while boiling human urine in search of the Philosopher’s Stone.',
  16: 'Known in biblical times as "brimstone", sulfur burns with an eerie blue flame and produces a suffocating smell.',
  17: 'During World War I, green chlorine gas was weaponized; today, it safeguards billions of people from deadly waterborne cholera.',
  18: 'Argon takes its name from the Greek word "argos", meaning lazy or idle, because it resists forming chemical bonds.',
  19: 'Bananas are naturally rich in potassium, containing a tiny fraction of radioactive Potassium-40 ($^{40}\\text{K}$).',
  20: 'Calcium is the 5th most abundant element in the human body, serving as the primary structural component of our bones.',
  26: 'The Earth’s molten iron core creates the geomagnetic field that shields all life on our planet from deadly solar radiation.',
  28: 'Nickel is named after "Kupfernickel" (Old Nick’s copper), a mythical German mischievous devil who tricked miners.',
  29: 'Copper was the first metal ever manipulated by humans over 10,000 years ago, ushering in the Bronze Age.',
  30: 'Without zinc, over 300 essential enzymes in our bodies wouldn’t function, and we would lose our senses of taste and smell.',
  47: 'Silver is the most electrically and thermally conductive, and most optically reflective metal in existence.',
  78: 'All the platinum ever mined in human history would fit in an average-sized living room with room to spare!',
  79: 'Gold is virtually indestructible and does not tarnish or rust; all the gold ever mined since antiquity is still in use today.',
  80: 'Mercury is the only metal that is a liquid at standard room temperature and pressure.',
  92: 'One single 7-gram pellet of uranium produces as much electrical energy as 3.5 barrels of oil or 1 ton of coal.',
};

/**
 * Safely parse Celsius temperatures to Kelvin
 */
export function parseCelsiusToKelvin(tempStr: string): number | null {
  if (!tempStr || tempStr.toLowerCase().includes('unknown') || tempStr.toLowerCase().includes('not')) {
    return null;
  }
  const cleaned = tempStr.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return null;
  return Number((parsed + 273.15).toFixed(2));
}

/**
 * Compute the state of matter of an element at a given Kelvin temperature
 */
export function getElementStateAtTemp(
  element: ElementData,
  tempK: number
): 'Solid' | 'Liquid' | 'Gas' | 'Unknown' {
  const meltK = element.meltingPointKelvin ?? parseCelsiusToKelvin(element.meltingPoint);
  const boilK = element.boilingPointKelvin ?? parseCelsiusToKelvin(element.boilingPoint);

  if (meltK === null && boilK === null) {
    // If unknown, fallback to room temperature phase
    return element.phaseAtRoomTemperature || 'Unknown';
  }

  // Helium special case: Helium does not freeze under normal 1 atm pressure even at 0 K without pressure
  if (element.atomicNumber === 2) {
    if (boilK !== null && tempK >= boilK) return 'Gas';
    return 'Liquid';
  }

  if (boilK !== null && tempK >= boilK) {
    return 'Gas';
  }

  if (meltK !== null && tempK >= meltK) {
    return 'Liquid';
  }

  if (meltK !== null && tempK < meltK) {
    return 'Solid';
  }

  return element.phaseAtRoomTemperature || 'Solid';
}

/**
 * Color configuration for Blocks (s, p, d, f)
 */
export const BLOCK_COLORS: Record<
  ElementBlock,
  {
    name: string;
    light: { bg: string; border: string; text: string; accent: string };
    dark: { bg: string; border: string; text: string; accent: string };
  }
> = {
  s: {
    name: 's-block',
    light: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.5)', text: '#b91c1c', accent: '#ef4444' },
    dark: { bg: 'rgba(239, 68, 68, 0.22)', border: 'rgba(248, 113, 113, 0.6)', text: '#fca5a5', accent: '#f87171' },
  },
  p: {
    name: 'p-block',
    light: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.5)', text: '#b45309', accent: '#f59e0b' },
    dark: { bg: 'rgba(245, 158, 11, 0.22)', border: 'rgba(251, 191, 36, 0.6)', text: '#fde68a', accent: '#fbbf24' },
  },
  d: {
    name: 'd-block',
    light: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.5)', text: '#1d4ed8', accent: '#3b82f6' },
    dark: { bg: 'rgba(59, 130, 246, 0.22)', border: 'rgba(96, 165, 250, 0.6)', text: '#bfdbfe', accent: '#60a5fa' },
  },
  f: {
    name: 'f-block',
    light: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.5)', text: '#047857', accent: '#10b981' },
    dark: { bg: 'rgba(16, 185, 129, 0.22)', border: 'rgba(52, 211, 153, 0.6)', text: '#a7f3d0', accent: '#34d399' },
  },
};

/**
 * Color configuration for States of Matter (Solid, Liquid, Gas, Unknown)
 */
export const PHASE_COLORS = {
  Solid: {
    light: { bg: 'rgba(100, 116, 139, 0.14)', border: 'rgba(100, 116, 139, 0.5)', text: '#334155', accent: '#64748b' },
    dark: { bg: 'rgba(100, 116, 139, 0.24)', border: 'rgba(148, 163, 184, 0.5)', text: '#cbd5e1', accent: '#94a3b8' },
  },
  Liquid: {
    light: { bg: 'rgba(6, 182, 212, 0.16)', border: 'rgba(6, 182, 212, 0.6)', text: '#0e7490', accent: '#06b6d4' },
    dark: { bg: 'rgba(6, 182, 212, 0.26)', border: 'rgba(34, 211, 238, 0.7)', text: '#a5f3fc', accent: '#22d3ee' },
  },
  Gas: {
    light: { bg: 'rgba(249, 115, 22, 0.14)', border: 'rgba(249, 115, 22, 0.5)', text: '#c2410c', accent: '#f97316' },
    dark: { bg: 'rgba(249, 115, 22, 0.24)', border: 'rgba(251, 146, 60, 0.6)', text: '#fed7aa', accent: '#fb923c' },
  },
  Unknown: {
    light: { bg: 'rgba(156, 163, 175, 0.1)', border: 'rgba(156, 163, 175, 0.4)', text: '#6b7280', accent: '#9ca3af' },
    dark: { bg: 'rgba(156, 163, 175, 0.18)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af', accent: '#9ca3af' },
  },
};

/**
 * Compute electronegativity heat color (0.7 to 4.0 on Pauling Scale)
 */
export function getElectronegativityColor(
  electronegativity: string,
  theme: 'light' | 'dark'
) {
  const val = parseFloat(electronegativity);
  if (isNaN(val)) {
    return theme === 'dark'
      ? { bg: 'rgba(100, 116, 139, 0.2)', border: 'rgba(100, 116, 139, 0.4)', text: '#94a3b8', accent: '#64748b' }
      : { bg: 'rgba(203, 213, 225, 0.3)', border: 'rgba(148, 163, 184, 0.4)', text: '#64748b', accent: '#94a3b8' };
  }

  // Normalize between 0.7 (Francium) and 3.98 (Fluorine) -> 0 to 1
  const ratio = Math.max(0, Math.min(1, (val - 0.7) / (4.0 - 0.7)));

  // Hue scale: Blue/Purple (low electronegativity, 240) to Cyan (180) to Green (120) to Yellow (60) to Red (high, 0)
  const hue = Math.round((1 - ratio) * 240);

  if (theme === 'dark') {
    return {
      bg: `hsla(${hue}, 75%, 50%, 0.22)`,
      border: `hsla(${hue}, 80%, 60%, 0.6)`,
      text: `hsla(${hue}, 90%, 80%, 1)`,
      accent: `hsl(${hue}, 85%, 60%)`,
    };
  }

  return {
    bg: `hsla(${hue}, 70%, 55%, 0.15)`,
    border: `hsla(${hue}, 75%, 45%, 0.55)`,
    text: `hsl(${hue}, 90%, 25%)`,
    accent: `hsl(${hue}, 80%, 45%)`,
  };
}
