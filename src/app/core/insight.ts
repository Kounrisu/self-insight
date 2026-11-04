import { InjectionToken } from '@angular/core';

/**
 * The seam that makes methods interchangeable: every technique (zodiac,
 * numerology, I Ching, ...) implements `InsightMethod` and returns a
 * `InsightResult`, which the generic <si-insight-card> knows how to render.
 * Add, remove or swap a method by editing the providers in app.config.ts.
 */

export interface BirthProfile {
  name: string;
  /** YYYY-MM-DD or empty. */
  birthDate: string;
  /** HH:MM (local) or empty when unknown. */
  birthTime: string;
  /** Hours offset from UTC at the birth place (e.g. 1 for CET). */
  utcOffset: number;
  latitude: number | null;
  longitude: number | null;
}

export const EMPTY_PROFILE: BirthProfile = {
  name: '',
  birthDate: '',
  birthTime: '',
  utcOffset: 0,
  latitude: null,
  longitude: null,
};

export interface InsightFact {
  label: string;
  value: string;
  hint?: string;
}

export interface InsightGroup {
  title?: string;
  facts: InsightFact[];
}

export interface InsightNumbers {
  label: string;
  values: number[];
  tone: 'lucky' | 'unlucky' | 'neutral';
}

export interface InsightResult {
  headline: string;
  /** Big glyph shown next to the headline (sign symbol, hexagram, ...). */
  symbol?: string;
  text?: string;
  groups?: InsightGroup[];
  numbers?: InsightNumbers[];
  /** Hexagram line values (bottom → top) for the line drawing. */
  hexagramLines?: number[];
  /** Honest limits of the reading (missing inputs, approximations). */
  caveat?: string;
}

export interface InsightContext {
  profile: BirthProfile;
  now: Date;
  /** Increments each time the user asks a refreshable method for a new reading. */
  refresh: number;
}

export interface InsightMethod {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  /** 'birthDate' methods show a prompt instead of a card until a date is set. */
  requires: 'birthDate' | 'none';
  refreshable?: boolean;
  compute(ctx: InsightContext): InsightResult | null;
}

export const INSIGHT_METHODS = new InjectionToken<InsightMethod[]>('INSIGHT_METHODS');

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidBirthDate(value: string, now = new Date()): boolean {
  const m = DATE_RE.exec(value);
  if (!m) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= now.toISOString().slice(0, 10) &&
    Number(m[1]) >= 1900
  );
}

/** Birth moment as a UTC instant; noon UTC when no birth time is known. */
export function birthInstant(profile: BirthProfile): Date {
  const time = /^\d{2}:\d{2}$/.test(profile.birthTime) ? profile.birthTime : '12:00';
  const local = new Date(`${profile.birthDate}T${time}:00Z`);
  const offset = /^\d{2}:\d{2}$/.test(profile.birthTime) ? profile.utcOffset : 0;
  return new Date(local.getTime() - offset * 3_600_000);
}

export function hasBirthTime(profile: BirthProfile): boolean {
  return /^\d{2}:\d{2}$/.test(profile.birthTime);
}
