import { InsightMethod, birthInstant } from '../core/insight';
import { chineseZodiacFromDate } from '../engine/chinese-zodiac';
import { chineseSignNumbers, dailyLuckyNumber, westernSignNumbers } from '../engine/lucky-numbers';
import { sunEclipticLongitude } from '../engine/solar-position';
import { signFromLongitude } from '../engine/zodiac';

export const luckMethod: InsightMethod = {
  id: 'luck',
  title: 'Luck',
  icon: '🍀',
  tagline: 'Lucky and unlucky numbers',
  requires: 'birthDate',
  compute({ profile, now }) {
    const longitude = sunEclipticLongitude(birthInstant(profile));
    const sign = signFromLongitude(longitude);
    const chinese = chineseZodiacFromDate(new Date(`${profile.birthDate}T12:00:00Z`));
    const west = westernSignNumbers(longitude);
    const east = chineseSignNumbers(chinese);
    const today = dailyLuckyNumber(sign.chaldeanPlanet, now);

    const uniq = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);

    return {
      headline: `Today's number: ${today}`,
      symbol: '🍀',
      numbers: [
        { label: `Lucky · ${sign.label} (Chaldean planet + degree)`, values: uniq(west.lucky), tone: 'lucky' },
        { label: `Lucky · ${chinese.animal} (branch + element)`, values: uniq(east.lucky), tone: 'lucky' },
        { label: 'Challenging · opposite sign', values: uniq(west.unlucky), tone: 'unlucky' },
        { label: 'Challenging · clashing animal', values: uniq(east.unlucky), tone: 'unlucky' },
        { label: `Daily number for ${sign.label}`, values: [today], tone: 'neutral' },
      ],
      caveat: 'Symbolic conventions for reflection and fun. They do not change the odds of any game of chance.',
    };
  },
};
