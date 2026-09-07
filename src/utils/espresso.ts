import { DialInGuidance } from '../types/recipe.ts';

export interface BrewRatioInfo {
  ratioText: string;
  ratioValue: number;
  style: 'Ristretto' | 'Espresso' | 'Lungo' | 'Filter / Americano';
  badgeClass: string;
}

/**
 * Calculates brew ratio and style category from dose and yield
 */
export function calculateBrewRatio(dose: number, yieldAmount: number): BrewRatioInfo {
  if (!dose || dose <= 0 || !yieldAmount || yieldAmount <= 0) {
    return {
      ratioText: '—',
      ratioValue: 0,
      style: 'Espresso',
      badgeClass: 'ratio-badge-neutral'
    };
  }

  const ratio = yieldAmount / dose;
  const formattedRatio = `1:${ratio.toFixed(1)}`;

  if (ratio < 1.6) {
    return {
      ratioText: formattedRatio,
      ratioValue: ratio,
      style: 'Ristretto',
      badgeClass: 'ratio-badge-ristretto'
    };
  } else if (ratio <= 2.6) {
    return {
      ratioText: formattedRatio,
      ratioValue: ratio,
      style: 'Espresso',
      badgeClass: 'ratio-badge-espresso'
    };
  } else if (ratio <= 4.0) {
    return {
      ratioText: formattedRatio,
      ratioValue: ratio,
      style: 'Lungo',
      badgeClass: 'ratio-badge-lungo'
    };
  } else {
    return {
      ratioText: formattedRatio,
      ratioValue: ratio,
      style: 'Filter / Americano',
      badgeClass: 'ratio-badge-filter'
    };
  }
}

/**
 * Dial-in diagnosis options based on the Espresso Compass
 */
export const DIAL_IN_GUIDES: DialInGuidance[] = [
  {
    symptom: 'Sour, Sharp, or Salty (Fast Shot)',
    tasteCategory: 'sour',
    description: 'Espresso tastes sharply acidic, salty, or puckering, and usually runs very fast (< 22 seconds).',
    diagnosis: 'Under-extraction. Water passed through too quickly without dissolving the sweet, balancing sugars.',
    actions: [
      'Grind Finer: Move Fellow Opus 1 to 2 micro-ticks finer to slow down the flow.',
      'Increase Yield: Extract more liquid (e.g. 18g:36g -> 18g:40g) to push extraction further.',
      'Improve Puck Prep: Use a WDT tool to break up clumps and prevent channeling.'
    ],
    opusAdjustment: 'Rotate outer ring finer (e.g., 2.2 -> 2.0) or use the blue inner micro-ring.',
    bambinoTip: 'Run a blank shot through the portafilter first to ensure group head and basket are thoroughly pre-heated.'
  },
  {
    symptom: 'Bitter, Harsh, Dry or Astringent',
    tasteCategory: 'bitter',
    description: 'Espresso leaves a dry, sandpaper feeling on the tongue, tastes like ash, rubber, or medicinal bitterness, and often drips very slowly (> 36 seconds).',
    diagnosis: 'Over-extraction. Water has extracted the heavy, bitter tannins and organic acids.',
    actions: [
      'Grind Coarser: Move Fellow Opus 1 to 2 micro-clicks coarser to allow faster, gentler flow.',
      'Decrease Yield: Stop the shot earlier (e.g. 18g:36g -> 18g:32g) to cut off the bitter tail.',
      'Gentle Tamp: Ensure you are tamping level without overtightening.'
    ],
    opusAdjustment: 'Rotate outer ring coarser (e.g., 2.0 -> 2.2) or click inner micro-ring coarser.',
    bambinoTip: 'Breville Bambino uses a 9-bar OPV; choking the machine with too fine a grind leads to severe channeling and localized bitter burn.'
  },
  {
    symptom: 'Weak, Watery, or Hollow',
    tasteCategory: 'watery',
    description: 'Espresso lacks body, feels thin like dark water, and has a very short, fleeting finish.',
    diagnosis: 'Low strength (TDS) and excessive brew ratio.',
    actions: [
      'Increase Dose: Increase coffee dose slightly (e.g. 17g -> 18g in the Bambino 54mm basket).',
      'Decrease Yield: Shorten ratio towards a tighter 1:2.0 or 1:1.8.',
      'Grind Finer: Slow down contact time to extract more soluble solids.'
    ],
    opusAdjustment: 'Step down 1 micro-tick finer on Fellow Opus.',
    bambinoTip: 'Make sure you are using a non-pressurized (single-wall) basket if grinding fresh on the Opus.'
  },
  {
    symptom: 'Heavy, Muddy, or Overwhelming',
    tasteCategory: 'strong',
    description: 'Intensely intense, syrupy, but muddy flavor where distinct fruit or chocolate notes cannot be tasted.',
    diagnosis: 'Overwhelming strength with restricted yield.',
    actions: [
      'Increase Yield: Extend the shot from 1:1.5 to 1:2.2 to open up clarity and sweetness.',
      'Check Dose: Ensure you are not overfilling the 54mm Bambino basket (recommended 17.5g - 18.5g max).'
    ],
    opusAdjustment: 'Keep grind size steady, just lengthen liquid yield by 4-6 grams.',
    bambinoTip: 'Use Bambino manual mode: hold 1-cup/2-cup button for pre-infusion, release to pump, press again to stop at your exact target weight on your scale.'
  },
  {
    symptom: 'Sweet Spot: Sweet, Rich & Balanced!',
    tasteCategory: 'balanced',
    description: 'Vibrant acidity balanced by rich sweetness, velvety crema, and a lingering pleasant chocolate or floral finish.',
    diagnosis: 'Ideal extraction and strength dialed in perfectly!',
    actions: [
      'Save Recipe: Lock in these exact numbers in your Café notebook!',
      'Consistency: Keep identical puck prep and dosing for future cups.'
    ],
    opusAdjustment: 'Do not touch dial settings for this bean bag.',
    bambinoTip: 'Enjoy your coffee! As the beans age past 2-3 weeks off roast, you may need 1 micro-tick finer over time.'
  }
];
