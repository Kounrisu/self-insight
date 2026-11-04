import { describe, expect, it } from 'vitest';
import { chineseZodiacFromDate } from './chinese-zodiac';
import { castHexagram, castingFromLines } from './iching';
import { dailyLuckyNumber, westernSignNumbers } from './lucky-numbers';
import { hourNumber, lifePath, nameNumber, personalYear } from './numerology';
import { planetPositions } from './planets';
import { rngFromSeed } from './seeded-random';
import { sunEclipticLongitude } from './solar-position';
import { signFromLongitude } from './zodiac';

const noon = (d: string) => new Date(`${d}T12:00:00Z`);

describe('numerology', () => {
  it('computes the life path by summing every digit', () => {
    expect(lifePath('1990-05-17')?.digit).toBe(5); // 1+9+9+0+0+5+1+7 = 32 -> 5
  });
  it('keeps master numbers visible', () => {
    expect(lifePath('1990-09-01')).toEqual({ digit: 2, master: 11 }); // 19+9+1 = 29 -> 11 -> 2
  });
  it('rejects malformed dates and times', () => {
    expect(lifePath('17/05/1990')).toBeNull();
    expect(hourNumber('9:5')).toBeNull();
  });
  it('maps letters Pythagorean-style, ignoring accents', () => {
    expect(nameNumber('Éa')?.digit).toBe(6); // E=5 + A=1
    expect(nameNumber('123')).toBeNull();
  });
  it('computes a personal year', () => {
    // month 5 + day 17 (1+7) + year 2026 (10) = 5+8+10 = 23 -> 5
    expect(personalYear('1990-05-17', 2026)?.digit).toBe(5);
  });
});

describe('western zodiac', () => {
  it('places the Sun around the March equinox', () => {
    expect(signFromLongitude(sunEclipticLongitude(new Date('2000-03-20T00:00:00Z'))).key).toBe('pisces');
    expect(signFromLongitude(sunEclipticLongitude(new Date('2000-03-20T12:00:00Z'))).key).toBe('aries');
  });
  it('puts the Sun at ~280° on 2000-01-01 noon (Capricorn)', () => {
    const lon = sunEclipticLongitude(noon('2000-01-01'));
    expect(lon).toBeGreaterThan(280);
    expect(lon).toBeLessThan(281);
  });
});

describe('chinese zodiac', () => {
  it('uses Chinese New Year, not the calendar year', () => {
    expect(chineseZodiacFromDate(noon('2000-01-15')).animal).toBe('Rabbit'); // before 2000-02-05
    expect(chineseZodiacFromDate(noon('2000-02-05')).animal).toBe('Dragon');
  });
  it('resolves the sexagenary stem/element', () => {
    const s = chineseZodiacFromDate(noon('1984-06-01'));
    expect([s.animal, s.stemElement, s.yinYang]).toEqual(['Rat', 'Wood', 'yang']);
  });
});

describe('lucky numbers', () => {
  it('produces digits 1-9 only', () => {
    const { lucky, unlucky } = westernSignNumbers(123.4);
    for (const n of [...lucky, ...unlucky]) expect(n).toBeGreaterThanOrEqual(1), expect(n).toBeLessThanOrEqual(9);
  });
  it('is stable for a sign and a UTC day', () => {
    const d = new Date('2026-11-04T08:00:00Z');
    expect(dailyLuckyNumber('Mars', d)).toBe(dailyLuckyNumber('Mars', d));
  });
});

describe('planets', () => {
  it('returns ten bodies with a sign each', () => {
    const p = planetPositions(noon('2000-01-01'));
    expect(p).toHaveLength(10);
    expect(p[0].sign.key).toBe('capricorn');
    expect(p.every((x) => x.degree >= 0 && x.degree < 30)).toBe(true);
  });
});

describe('i ching', () => {
  it('maps known trigram pairs to King Wen numbers', () => {
    // lines bottom -> top; 7 = yang, 8 = yin
    expect(castingFromLines([7, 7, 7, 7, 7, 7]).primary.number).toBe(1); // Heaven/Heaven
    expect(castingFromLines([8, 8, 8, 8, 8, 8]).primary.number).toBe(2); // Earth/Earth
    expect(castingFromLines([7, 7, 7, 8, 8, 8]).primary.number).toBe(11); // Earth over Heaven: Peace
    expect(castingFromLines([8, 8, 8, 7, 7, 7]).primary.number).toBe(12); // Heaven over Earth: Standstill
    expect(castingFromLines([7, 8, 7, 8, 7, 8]).primary.number).toBe(63); // Water over Fire: After Completion
  });
  it('flips changing lines into the relating hexagram', () => {
    const c = castingFromLines([9, 7, 7, 7, 7, 7]);
    expect(c.changingLines).toEqual([1]);
    expect(c.primary.number).toBe(1);
    expect(c.relating?.number).toBe(44); // Coming to Meet
  });
  it('has no relating hexagram without changing lines', () => {
    expect(castingFromLines([7, 8, 7, 8, 7, 8]).relating).toBeNull();
  });
  it('is reproducible from a seed', () => {
    const a = castHexagram(rngFromSeed('x'));
    const b = castHexagram(rngFromSeed('x'));
    expect(a.lines).toEqual(b.lines);
    expect(a.lines.every((v) => v >= 6 && v <= 9)).toBe(true);
  });
});

describe('i ching texts', () => {
  it('has a theme and advice for all 64 hexagrams and 6 line positions', async () => {
    const { HEXAGRAM_TEXTS, LINE_POSITION_TEXTS } = await import('./iching-texts');
    expect(HEXAGRAM_TEXTS).toHaveLength(64);
    expect(HEXAGRAM_TEXTS.every((t) => t.theme.length > 10 && t.advice.length > 10)).toBe(true);
    expect(LINE_POSITION_TEXTS).toHaveLength(6);
  });
});
