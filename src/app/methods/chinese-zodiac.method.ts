import { InsightMethod } from '../core/insight';
import { CHINESE_BRANCHES, CNY_DATES, chineseZodiacFromDate, clashingBranchIndex } from '../engine/chinese-zodiac';

const GLYPHS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];

export const chineseZodiacMethod: InsightMethod = {
  id: 'chinese-zodiac',
  title: 'Chinese zodiac',
  icon: '🐉',
  tagline: 'Animal, element and polarity',
  requires: 'birthDate',
  compute({ profile }) {
    const date = new Date(`${profile.birthDate}T12:00:00Z`);
    const sign = chineseZodiacFromDate(date);
    const clash = CHINESE_BRANCHES[clashingBranchIndex(sign.branchIndex)];
    const outOfTable = !CNY_DATES[date.getUTCFullYear()];

    return {
      headline: `${sign.stemElement} ${sign.animal}`,
      symbol: GLYPHS[sign.branchIndex],
      groups: [
        {
          facts: [
            { label: 'Animal', value: sign.animal, hint: `branch element: ${sign.branchElement}` },
            { label: 'Year element', value: sign.stemElement },
            { label: 'Polarity', value: sign.yinYang === 'yang' ? 'Yang' : 'Yin' },
            { label: 'Clashing animal', value: clash.animal },
          ],
        },
      ],
      caveat: outOfTable
        ? 'Chinese New Year date for this year is not in the table; the result may be off for January–February births.'
        : 'Resolved with the real Chinese New Year date, not just the calendar year.',
    };
  },
};
