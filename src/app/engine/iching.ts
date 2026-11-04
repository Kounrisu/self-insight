// I Ching (Yi King): hexagram construction with the three-coin method.
// Lines are listed bottom → top. Values: 6 = old yin (changing), 7 = young
// yang, 8 = young yin, 9 = old yang (changing).

export type LineValue = 6 | 7 | 8 | 9;

export interface Trigram {
  key: string;
  name: string;
  image: string;
  symbol: string;
}

// Indexed by code = bottom + 2*middle + 4*top, where yang = 1.
const TRIGRAM_BY_CODE: Trigram[] = [
  { key: 'kun', name: 'Kun', image: 'Earth', symbol: '☷' },
  { key: 'zhen', name: 'Zhen', image: 'Thunder', symbol: '☳' },
  { key: 'kan', name: 'Kan', image: 'Water', symbol: '☵' },
  { key: 'dui', name: 'Dui', image: 'Lake', symbol: '☱' },
  { key: 'gen', name: 'Gen', image: 'Mountain', symbol: '☶' },
  { key: 'li', name: 'Li', image: 'Fire', symbol: '☲' },
  { key: 'xun', name: 'Xun', image: 'Wind', symbol: '☴' },
  { key: 'qian', name: 'Qian', image: 'Heaven', symbol: '☰' },
];

// King Wen numbers: rows = lower trigram, columns = upper trigram, both in
// this order.
const KING_WEN_ORDER = ['qian', 'zhen', 'kan', 'gen', 'kun', 'xun', 'li', 'dui'];
const KING_WEN_MATRIX: number[][] = [
  [1, 34, 5, 26, 11, 9, 14, 43],
  [25, 51, 3, 27, 24, 42, 21, 17],
  [6, 40, 29, 4, 7, 59, 64, 47],
  [33, 62, 39, 52, 15, 53, 56, 31],
  [12, 16, 8, 23, 2, 20, 35, 45],
  [44, 32, 48, 18, 46, 57, 50, 28],
  [13, 55, 63, 22, 36, 37, 30, 49],
  [10, 54, 60, 41, 19, 61, 38, 58],
];

export const HEXAGRAM_NAMES: readonly string[] = [
  'The Creative', 'The Receptive', 'Difficulty at the Beginning', 'Youthful Folly', 'Waiting',
  'Conflict', 'The Army', 'Holding Together', 'Small Taming', 'Treading',
  'Peace', 'Standstill', 'Fellowship', 'Great Possession', 'Modesty',
  'Enthusiasm', 'Following', 'Work on the Decayed', 'Approach', 'Contemplation',
  'Biting Through', 'Grace', 'Splitting Apart', 'Return', 'Innocence',
  'Great Taming', 'Nourishment', 'Great Excess', 'The Abysmal (Water)', 'The Clinging (Fire)',
  'Influence', 'Duration', 'Retreat', 'Great Power', 'Progress',
  'Darkening of the Light', 'The Family', 'Opposition', 'Obstruction', 'Deliverance',
  'Decrease', 'Increase', 'Breakthrough', 'Coming to Meet', 'Gathering Together',
  'Pushing Upward', 'Oppression', 'The Well', 'Revolution', 'The Cauldron',
  'The Arousing (Thunder)', 'Keeping Still (Mountain)', 'Development', 'The Marrying Maiden', 'Abundance',
  'The Wanderer', 'The Gentle (Wind)', 'The Joyous (Lake)', 'Dispersion', 'Limitation',
  'Inner Truth', 'Small Excess', 'After Completion', 'Before Completion',
];

export interface Hexagram {
  number: number;
  name: string;
  /** Unicode hexagram glyph (code points follow King Wen order). */
  symbol: string;
  lower: Trigram;
  upper: Trigram;
}

const isYang = (v: LineValue) => v === 7 || v === 9;

function hexagramFromYang(yang: boolean[]): Hexagram {
  const code = (a: boolean, b: boolean, c: boolean) => Number(a) + 2 * Number(b) + 4 * Number(c);
  const lower = TRIGRAM_BY_CODE[code(yang[0], yang[1], yang[2])];
  const upper = TRIGRAM_BY_CODE[code(yang[3], yang[4], yang[5])];
  const number = KING_WEN_MATRIX[KING_WEN_ORDER.indexOf(lower.key)][KING_WEN_ORDER.indexOf(upper.key)];
  return {
    number,
    name: HEXAGRAM_NAMES[number - 1],
    symbol: String.fromCodePoint(0x4dc0 + number - 1),
    lower,
    upper,
  };
}

export interface Casting {
  lines: LineValue[];
  primary: Hexagram;
  /** Hexagram after changing lines flip; null when no line changes. */
  relating: Hexagram | null;
  /** 1-based positions (1 = bottom) of changing lines. */
  changingLines: number[];
}

/** Build a casting from six line values (bottom → top). */
export function castingFromLines(lines: LineValue[]): Casting {
  if (lines.length !== 6) throw new RangeError('A hexagram needs exactly six lines');
  const changingLines = lines.flatMap((v, i) => (v === 6 || v === 9 ? [i + 1] : []));
  const primary = hexagramFromYang(lines.map(isYang));
  const relating = changingLines.length
    ? hexagramFromYang(lines.map((v) => (v === 6 || v === 9 ? !isYang(v) : isYang(v))))
    : null;
  return { lines, primary, relating, changingLines };
}

/** Three-coin method: heads = 3, tails = 2, so each line is 6, 7, 8 or 9. */
export function castHexagram(rng: () => number): Casting {
  const coin = () => (rng() < 0.5 ? 2 : 3);
  const lines = Array.from({ length: 6 }, () => (coin() + coin() + coin()) as LineValue);
  return castingFromLines(lines);
}
