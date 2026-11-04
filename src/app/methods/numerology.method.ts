import { InsightFact, InsightMethod } from '../core/insight';
import {
  MASTER_MEANINGS,
  NUMEROLOGY_MEANINGS,
  NumberReading,
  hourNumber,
  lifePath,
  nameNumber,
  personalYear,
  soulUrgeNumber,
} from '../engine/numerology';

const show = (r: NumberReading) => (r.master ? `${r.master} / ${r.digit}` : String(r.digit));

export const numerologyMethod: InsightMethod = {
  id: 'numerology',
  title: 'Numerology',
  icon: '🔢',
  tagline: 'Life path, name and year numbers',
  requires: 'birthDate',
  compute({ profile, now }) {
    const path = lifePath(profile.birthDate);
    if (!path) return null;

    const facts: InsightFact[] = [{ label: 'Life path', value: show(path) }];
    const year = personalYear(profile.birthDate, now.getUTCFullYear());
    if (year) facts.push({ label: `Personal year ${now.getUTCFullYear()}`, value: show(year) });
    const expression = nameNumber(profile.name);
    if (expression) facts.push({ label: 'Expression (name)', value: show(expression) });
    const soul = soulUrgeNumber(profile.name);
    if (soul) facts.push({ label: 'Soul urge (vowels)', value: show(soul) });
    const hour = hourNumber(profile.birthTime);
    if (hour) facts.push({ label: 'Birth hour', value: String(hour) });

    const text = [NUMEROLOGY_MEANINGS[path.digit], path.master ? MASTER_MEANINGS[path.master] : '']
      .filter(Boolean)
      .join(' ');

    return {
      headline: `Life path ${path.master ?? path.digit}`,
      symbol: String(path.digit),
      text,
      groups: [{ facts }],
      caveat: expression ? undefined : 'Enter your full name to unlock the expression and soul urge numbers.',
    };
  },
};
