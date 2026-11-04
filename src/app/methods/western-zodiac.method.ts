import { InsightGroup, InsightMethod, birthInstant, hasBirthTime } from '../core/insight';
import { ascendantLongitude } from '../engine/ascendant';
import { sunEclipticLongitude } from '../engine/solar-position';
import { degreeInSign, formatDegree, signFromLongitude } from '../engine/zodiac';

export const westernZodiacMethod: InsightMethod = {
  id: 'western-zodiac',
  title: 'Western zodiac',
  icon: '♈',
  tagline: 'Sun sign and ascendant',
  requires: 'birthDate',
  compute({ profile }) {
    const instant = birthInstant(profile);
    const sunLongitude = sunEclipticLongitude(instant);
    const sun = signFromLongitude(sunLongitude);

    const facts = [
      { label: 'Element', value: sun.element },
      { label: 'Modality', value: sun.modality },
      { label: 'Ruler', value: sun.ruler },
      { label: 'Sun position', value: `${formatDegree(degreeInSign(sunLongitude))} ${sun.label}` },
    ];
    const groups: InsightGroup[] = [{ facts }];

    let caveat: string | undefined;
    if (hasBirthTime(profile) && profile.latitude !== null && profile.longitude !== null) {
      const asc = ascendantLongitude(instant, profile.latitude, profile.longitude);
      const ascSign = signFromLongitude(asc);
      groups.push({
        title: 'Ascendant',
        facts: [{ label: 'Rising sign', value: `${ascSign.symbol} ${ascSign.label}`, hint: formatDegree(degreeInSign(asc)) }],
      });
    } else {
      caveat = 'Add birth time, UTC offset, latitude and longitude to compute your ascendant.';
    }
    if (!hasBirthTime(profile)) {
      caveat = (caveat ? caveat + ' ' : '') + 'Without a birth time the Sun sign can be wrong on cusp days.';
    }

    return { headline: `${sun.label}`, symbol: sun.symbol, text: sun.description, groups, caveat };
  },
};
