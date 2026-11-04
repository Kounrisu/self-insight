import { InsightFact, InsightGroup, InsightMethod, birthInstant, hasBirthTime } from '../core/insight';
import { PlanetPosition, planetPositions } from '../engine/planets';
import { formatDegree } from '../engine/zodiac';

const toFacts = (positions: PlanetPosition[]): InsightFact[] =>
  positions.map((p) => ({
    label: `${p.glyph} ${p.name}`,
    value: `${p.sign.symbol} ${p.sign.label}`,
    hint: formatDegree(p.degree),
  }));

export const planetsMethod: InsightMethod = {
  id: 'planets',
  title: 'Planet positions',
  icon: '🪐',
  tagline: 'The sky at your birth and today',
  requires: 'none',
  compute({ profile, now }) {
    const current = planetPositions(now);
    const groups: InsightGroup[] = [];
    let caveat: string | undefined;
    let headline = 'The sky today';
    let text: string | undefined;

    if (profile.birthDate) {
      const natal = planetPositions(birthInstant(profile));
      groups.push({ title: 'At birth', facts: toFacts(natal) });
      headline = `Moon in ${natal[1].sign.label} · Sun in ${natal[0].sign.label}`;
      if (!hasBirthTime(profile)) {
        caveat = 'No birth time given: positions are computed for 12:00 UTC (the Moon can be off by about 6°).';
      }
    } else {
      text = 'Add your birth date to also see where the planets stood when you were born.';
    }
    groups.push({ title: 'Today', facts: toFacts(current) });

    return { headline, symbol: '🪐', text, groups, caveat };
  },
};
