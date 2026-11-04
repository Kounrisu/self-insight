import { Injectable, computed, effect, signal } from '@angular/core';
import { BirthProfile, EMPTY_PROFILE, isValidBirthDate } from './insight';

const STORAGE_KEY = 'self-insight.profile.v1';

function load(): BirthProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

/** Holds the user's birth profile (kept only in this browser's localStorage). */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly profile = signal<BirthProfile>(load());
  readonly hasValidDate = computed(() => isValidBirthDate(this.profile().birthDate));

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile()));
      } catch {
        /* storage unavailable: keep the in-memory profile */
      }
    });
  }

  update(patch: Partial<BirthProfile>): void {
    this.profile.update((p) => ({ ...p, ...patch }));
  }

  clear(): void {
    this.profile.set(EMPTY_PROFILE);
  }
}
