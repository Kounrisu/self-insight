// Pythagorean numerology. Ported from LotoKarma's numerology.ts, with master
// numbers (11, 22, 33) kept visible and a personal-year helper added.

const DIACRITICS_REGEX = /[̀-ͯ]/g;

function digitSum(n: number): number {
  return String(Math.floor(Math.abs(n)))
    .split('')
    .reduce((sum, d) => sum + Number(d), 0);
}

/** Reduce to a single digit 1-9 (0 maps to 9, as in LotoKarma). */
export function reduceToDigit(n: number): number {
  let value = Math.floor(Math.abs(n));
  while (value > 9) value = digitSum(value);
  return value === 0 ? 9 : value;
}

/** Reduce to 1-9 but stop on master numbers 11, 22, 33. */
export function reduceKeepMaster(n: number): number {
  let value = Math.floor(Math.abs(n));
  while (value > 9 && ![11, 22, 33].includes(value)) value = digitSum(value);
  return value === 0 ? 9 : value;
}

export interface NumberReading {
  /** Single digit 1-9. */
  digit: number;
  /** 11, 22 or 33 when the unreduced chain passes through a master number. */
  master: number | null;
}

function reading(total: number): NumberReading {
  const kept = reduceKeepMaster(total);
  return { digit: reduceToDigit(total), master: kept > 9 ? kept : null };
}

/** Life path: sum of every digit of YYYY-MM-DD. */
export function lifePath(dateStr: string): NumberReading | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) return null;
  return reading(digitSum(Number(m[1])) + digitSum(Number(m[2])) + digitSum(Number(m[3])));
}

/** Personal year: birth month + birth day + the year being asked about. */
export function personalYear(dateStr: string, year: number): NumberReading | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) return null;
  return reading(digitSum(Number(m[2])) + digitSum(Number(m[3])) + digitSum(year));
}

const LETTER_VALUES: Record<string, number> = {};
['AJS', 'BKT', 'CLU', 'DMV', 'ENW', 'FOX', 'GPY', 'HQZ', 'IR'].forEach((group, i) =>
  group.split('').forEach((c) => (LETTER_VALUES[c] = i + 1)),
);

function lettersOf(text: string): string {
  return text.toUpperCase().normalize('NFD').replace(DIACRITICS_REGEX, '').replace(/[^A-Z]/g, '');
}

/** Expression ("destiny") number from the full name. */
export function nameNumber(name: string): NumberReading | null {
  const letters = lettersOf(name);
  if (!letters) return null;
  return reading(letters.split('').reduce((acc, c) => acc + (LETTER_VALUES[c] ?? 0), 0));
}

/** Soul urge: vowels only. */
export function soulUrgeNumber(name: string): NumberReading | null {
  const letters = lettersOf(name).replace(/[^AEIOU]/g, '');
  if (!letters) return null;
  return reading(letters.split('').reduce((acc, c) => acc + (LETTER_VALUES[c] ?? 0), 0));
}

/** Hour number: digits of HH:MM. */
export function hourNumber(timeStr: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(timeStr.trim());
  if (!m) return null;
  return reduceToDigit(digitSum(Number(m[1])) + digitSum(Number(m[2])));
}

export const NUMEROLOGY_MEANINGS: Record<number, string> = {
  1: 'The leader. Independence, initiative and the will to go first.',
  2: 'The diplomat. Sensitivity, cooperation and a sense of connection.',
  3: 'The expressive one. Creativity, communication and joy of living.',
  4: 'The builder. Rigor, stability and well-made work.',
  5: 'The free spirit. Change, curiosity and a taste for adventure.',
  6: 'The nurturer. Responsibility, family and service.',
  7: 'The seeker. Introspection, analysis and the quest for meaning.',
  8: 'The achiever. Ambition, material success and long-term vision.',
  9: 'The humanist. Generosity, idealism and the big picture.',
};

export const MASTER_MEANINGS: Record<number, string> = {
  11: 'Master 11: heightened intuition and inspiration.',
  22: 'Master 22: the master builder, turning large visions into reality.',
  33: 'Master 33: the master teacher, devoted to guiding others.',
};
