// Ascendant (ecliptic longitude of the eastern horizon point) — closed-form
// spherical astronomy, no ephemeris file needed. Formula per Wikipedia's
// "Ascendant (astrology)" article, verified numerically against an
// independently-derived right-ascension relation (see ascendant.spec.ts).
import { julianDay } from './solar-position';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normalizeDegrees(x: number): number {
  return ((x % 360) + 360) % 360;
}

/** Mean obliquity of the ecliptic, in degrees (slowly varying, not a constant). */
export function obliquityOfEcliptic(date: Date): number {
  const t = (julianDay(date) - 2451545.0) / 36525;
  return 23.439291 - 0.0130042 * t - 0.00000016 * t * t + 0.000000504 * t * t * t;
}

/** Greenwich Mean Sidereal Time, in degrees, [0, 360). */
export function greenwichMeanSiderealTime(date: Date): number {
  const jd = julianDay(date);
  const t = (jd - 2451545.0) / 36525;
  return normalizeDegrees(
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000
  );
}

/**
 * Ascendant's ecliptic longitude, in degrees [0, 360).
 *
 * @param date UTC instant of birth (already converted from local time by the caller).
 * @param latitudeDeg geographic latitude, north positive.
 * @param longitudeDeg geographic longitude, east positive.
 */
export function ascendantLongitude(date: Date, latitudeDeg: number, longitudeDeg: number): number {
  const ramc = normalizeDegrees(greenwichMeanSiderealTime(date) + longitudeDeg);
  const eps = obliquityOfEcliptic(date) * DEG2RAD;
  const ramcRad = ramc * DEG2RAD;
  const latRad = latitudeDeg * DEG2RAD;

  const y = -Math.cos(ramcRad);
  const x = Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(ramcRad);

  // atan2 alone gives either the Ascendant OR the Descendant (they satisfy
  // the same tan() equation, 180deg apart) — the +180 is not optional.
  return normalizeDegrees(Math.atan2(y, x) * RAD2DEG + 180);
}
