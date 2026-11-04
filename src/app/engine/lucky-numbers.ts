// Lucky / unlucky number correspondences. Ported from LotoKarma's
// zodiac-numbers.ts: Western pair from the Chaldean planet number + degree in
// sign; Chinese pair from the branch position + year-stem element (Wu Xing).
// These are symbolic conventions, not predictions.
import { reduceToDigit } from './numerology';
import { ZODIAC_SIGNS, degreeInSign, signIndexFromLongitude } from './zodiac';
import { CHINESE_BRANCHES, ChineseZodiacSign, clashingBranchIndex } from './chinese-zodiac';

export const CHALDEAN_NUMBERS: Record<string, number> = {
  Sun: 1, Moon: 2, Jupiter: 3, Uranus: 4, Mercury: 5, Venus: 6, Neptune: 7, Saturn: 8, Mars: 9,
};

export const WU_XING_NUMBERS: Record<string, number> = {
  Water: 1, Fire: 2, Wood: 3, Metal: 4, Earth: 5,
};

export interface SignNumbers {
  lucky: [number, number];
  unlucky: [number, number];
}

export function westernSignNumbers(longitude: number): SignNumbers {
  const safe = Number.isFinite(longitude) ? longitude : 0;
  const index = signIndexFromLongitude(safe);
  const opposite = ZODIAC_SIGNS[(index + 6) % 12];
  const degree = Math.floor(degreeInSign(safe));
  return {
    lucky: [CHALDEAN_NUMBERS[ZODIAC_SIGNS[index].chaldeanPlanet], reduceToDigit(degree)],
    unlucky: [CHALDEAN_NUMBERS[opposite.chaldeanPlanet], reduceToDigit(30 - degree)],
  };
}

export function chineseSignNumbers(sign: ChineseZodiacSign): SignNumbers {
  const clashIndex = clashingBranchIndex(sign.branchIndex);
  return {
    lucky: [sign.branchIndex + 1, WU_XING_NUMBERS[sign.stemElement]],
    unlucky: [clashIndex + 1, WU_XING_NUMBERS[CHINESE_BRANCHES[clashIndex].element]],
  };
}

/** Horoscope-column style number: same for everyone on a given sign and UTC day. */
export function dailyLuckyNumber(chaldeanPlanet: string, date: Date = new Date()): number {
  const planetDigit = CHALDEAN_NUMBERS[chaldeanPlanet];
  const dateDigit = reduceToDigit(date.getUTCFullYear() + date.getUTCMonth() + 1 + date.getUTCDate());
  return reduceToDigit(planetDigit * 10 + dateDigit);
}
