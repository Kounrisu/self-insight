// Sun's apparent ecliptic longitude, low-precision formula (Meeus,
// "Astronomical Algorithms", ch. 25) — ~0.01deg accuracy, no ephemeris file
// needed, pure closed-form arithmetic from a UTC date/time.

const DEG2RAD = Math.PI / 180;

function normalizeDegrees(x: number): number {
  return ((x % 360) + 360) % 360;
}

/** Julian Day for a UTC instant (Gregorian calendar). */
export function julianDay(date: Date): number {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day =
    date.getUTCDate() +
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

/** Sun's apparent ecliptic longitude in degrees, [0, 360). */
export function sunEclipticLongitude(date: Date): number {
  const jd = julianDay(date);
  const t = (jd - 2451545.0) / 36525; // Julian centuries since J2000.0

  const meanLongitude = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  const meanAnomalyDeg = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const meanAnomaly = meanAnomalyDeg * DEG2RAD;

  const equationOfCenter =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(meanAnomaly) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * meanAnomaly) +
    0.000289 * Math.sin(3 * meanAnomaly);

  const trueLongitude = meanLongitude + equationOfCenter;

  // Small correction for nutation + aberration -> apparent longitude.
  const omega = 125.04 - 1934.136 * t;
  const apparentLongitude = trueLongitude - 0.00569 - 0.00478 * Math.sin(omega * DEG2RAD);

  return normalizeDegrees(apparentLongitude);
}
