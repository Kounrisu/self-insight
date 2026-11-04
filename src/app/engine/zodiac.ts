// Western (tropical) zodiac. Ported from LotoKarma's zodiac.ts (English labels).
// Sign order matters: index 0 starts at ecliptic longitude 0°, so
// `signIndexFromLongitude` can index straight into this array.

export interface ZodiacSign {
  key: string;
  label: string;
  symbol: string;
  /** Planet used by the Chaldean number system (see lucky-numbers.ts). */
  chaldeanPlanet: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  /** Traditional/modern ruler shown to the user. */
  ruler: string;
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { key: 'aries', label: 'Aries', symbol: '♈', chaldeanPlanet: 'Mars', element: 'Fire', modality: 'Cardinal', ruler: 'Mars',
    description: 'Direct and energetic: the first sign, driven by initiative and courage.' },
  { key: 'taurus', label: 'Taurus', symbol: '♉', chaldeanPlanet: 'Venus', element: 'Earth', modality: 'Fixed', ruler: 'Venus',
    description: 'Steady and sensual: patience, loyalty and a taste for simple pleasures.' },
  { key: 'gemini', label: 'Gemini', symbol: '♊', chaldeanPlanet: 'Mercury', element: 'Air', modality: 'Mutable', ruler: 'Mercury',
    description: 'Curious and quick: communication, duality and constant movement.' },
  { key: 'cancer', label: 'Cancer', symbol: '♋', chaldeanPlanet: 'Moon', element: 'Water', modality: 'Cardinal', ruler: 'Moon',
    description: 'Intuitive and protective: sensitivity, memory and emotional cycles.' },
  { key: 'leo', label: 'Leo', symbol: '♌', chaldeanPlanet: 'Sun', element: 'Fire', modality: 'Fixed', ruler: 'Sun',
    description: 'Radiant and generous: confidence, warmth and the wish to be seen.' },
  { key: 'virgo', label: 'Virgo', symbol: '♍', chaldeanPlanet: 'Mercury', element: 'Earth', modality: 'Mutable', ruler: 'Mercury',
    description: 'Methodical and precise: attention to detail, analysis and service.' },
  { key: 'libra', label: 'Libra', symbol: '♎', chaldeanPlanet: 'Venus', element: 'Air', modality: 'Cardinal', ruler: 'Venus',
    description: 'Harmonious and diplomatic: balance, fairness and aesthetics.' },
  { key: 'scorpio', label: 'Scorpio', symbol: '♏', chaldeanPlanet: 'Mars', element: 'Water', modality: 'Fixed', ruler: 'Pluto (traditionally Mars)',
    description: 'Intense and secretive: depth, transformation and emotional stamina.' },
  { key: 'sagittarius', label: 'Sagittarius', symbol: '♐', chaldeanPlanet: 'Jupiter', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter',
    description: 'Adventurous and optimistic: expansion, freedom and the search for meaning.' },
  { key: 'capricorn', label: 'Capricorn', symbol: '♑', chaldeanPlanet: 'Saturn', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn',
    description: 'Disciplined and ambitious: perseverance and building for the long term.' },
  { key: 'aquarius', label: 'Aquarius', symbol: '♒', chaldeanPlanet: 'Uranus', element: 'Air', modality: 'Fixed', ruler: 'Uranus (traditionally Saturn)',
    description: 'Original and independent: ideas, community and a taste for the unconventional.' },
  { key: 'pisces', label: 'Pisces', symbol: '♓', chaldeanPlanet: 'Neptune', element: 'Water', modality: 'Mutable', ruler: 'Neptune (traditionally Jupiter)',
    description: 'Dreamy and empathic: imagination, compassion and intuition.' },
];

export function signIndexFromLongitude(longitude: number): number {
  return Math.floor((((longitude % 360) + 360) % 360) / 30) % 12;
}

export function signFromLongitude(longitude: number): ZodiacSign {
  return ZODIAC_SIGNS[signIndexFromLongitude(longitude)];
}

export function degreeInSign(longitude: number): number {
  return (((longitude % 360) + 360) % 360) % 30;
}

/** "12°34′" style formatting of a degree-in-sign value. */
export function formatDegree(degree: number): string {
  const whole = Math.floor(degree);
  const minutes = Math.floor((degree - whole) * 60);
  return `${whole}°${String(minutes).padStart(2, '0')}′`;
}
