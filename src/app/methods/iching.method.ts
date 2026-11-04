import { InsightGroup, InsightMethod } from '../core/insight';
import { castHexagram } from '../engine/iching';
import { HEXAGRAM_TEXTS, LINE_POSITION_TEXTS } from '../engine/iching-texts';
import { rngFromSeed } from '../engine/seeded-random';

export const ichingMethod: InsightMethod = {
  id: 'iching',
  title: 'Yi King (I Ching)',
  icon: '☯',
  tagline: 'Your hexagram of the day',
  requires: 'none',
  refreshable: true,
  compute({ profile, now, refresh }) {
    // refresh 0: reproducible "hexagram of the day" for this person.
    // refresh > 0: a fresh cast each time the user asks again.
    const day = now.toISOString().slice(0, 10);
    const rng = refresh === 0 ? rngFromSeed(`iching|${profile.birthDate || 'anon'}|${day}`) : Math.random;
    const casting = castHexagram(rng);
    const { primary, relating, changingLines } = casting;
    const reading = HEXAGRAM_TEXTS[primary.number - 1];

    const groups: InsightGroup[] = [
      { title: 'Advice', facts: [{ label: 'Meet it by', value: reading.advice }] },
      {
        title: 'Structure',
        facts: [
          { label: 'Lower trigram', value: `${primary.lower.symbol} ${primary.lower.image}`, hint: primary.lower.name },
          { label: 'Upper trigram', value: `${primary.upper.symbol} ${primary.upper.image}`, hint: primary.upper.name },
        ],
      },
    ];
    if (changingLines.length) {
      groups.push({
        title: 'Changing lines',
        facts: changingLines.map((n) => ({ label: `Line ${n}`, value: LINE_POSITION_TEXTS[n - 1].replace(/^Line \d \([^)]*\): /, '') })),
      });
    }
    if (relating) {
      groups.push({
        title: 'Evolves into',
        facts: [
          { label: `${relating.symbol} ${relating.number}. ${relating.name}`, value: HEXAGRAM_TEXTS[relating.number - 1].theme },
        ],
      });
    }

    return {
      headline: `${primary.number}. ${primary.name}`,
      symbol: primary.symbol,
      text: reading.theme,
      hexagramLines: casting.lines,
      groups,
      caveat:
        refresh === 0
          ? 'Seeded from your birth date and today, so it stays the same all day. Use "New cast" for a random three-coin throw. Texts are reflection prompts, not predictions.'
          : 'Random three-coin cast. Texts are reflection prompts, not predictions.',
    };
  },
};
