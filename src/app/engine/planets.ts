// Planet positions via astronomy-engine (same library LotoKarma uses for its
// planetary generator). Geocentric ecliptic longitudes, tropical zodiac.
import { Body, Ecliptic, GeoVector } from 'astronomy-engine';
import { degreeInSign, signFromLongitude, ZodiacSign } from './zodiac';

export interface PlanetPosition {
  key: string;
  name: string;
  glyph: string;
  longitude: number;
  sign: ZodiacSign;
  degree: number;
}

const BODIES: [Body, string, string][] = [
  [Body.Sun, 'Sun', '☉'],
  [Body.Moon, 'Moon', '☽'],
  [Body.Mercury, 'Mercury', '☿'],
  [Body.Venus, 'Venus', '♀'],
  [Body.Mars, 'Mars', '♂'],
  [Body.Jupiter, 'Jupiter', '♃'],
  [Body.Saturn, 'Saturn', '♄'],
  [Body.Uranus, 'Uranus', '♅'],
  [Body.Neptune, 'Neptune', '♆'],
  [Body.Pluto, 'Pluto', '♇'],
];

export function planetPositions(at: Date): PlanetPosition[] {
  return BODIES.map(([body, name, glyph]) => {
    const longitude = Ecliptic(GeoVector(body, at, true)).elon;
    return {
      key: body.toLowerCase(),
      name,
      glyph,
      longitude,
      sign: signFromLongitude(longitude),
      degree: degreeInSign(longitude),
    };
  });
}
