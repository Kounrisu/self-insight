import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { INSIGHT_METHODS, InsightContext, InsightMethod, InsightResult } from './core/insight';
import { ProfileService } from './core/profile.service';
import { InsightCardComponent } from './shared/insight-card';
import { ProfileFormComponent } from './features/profile-form';

@Component({
  selector: 'app-root',
  imports: [InsightCardComponent, ProfileFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top">
      <h1>🔮 SelfInsight</h1>
      <p class="muted">
        Explore yourself through the zodiac, numerology, the Yi King, the planets and luck.
        Symbolic tools for reflection, not predictions.
      </p>
    </header>

    <main>
      <si-profile-form />

      <section class="grid" aria-label="Readings">
        @for (method of methods; track method.id) {
          <si-insight-card
            [method]="method"
            [result]="results()[method.id]"
            [needsBirthDate]="method.requires === 'birthDate' && !profileService.hasValidDate()"
            (refreshRequested)="refresh(method)"
          />
        }
      </section>
    </main>
  `,
  styles: `
    .top { padding: 2rem 1.25rem 0.5rem; max-width: 72rem; margin: 0 auto; }
    main { max-width: 72rem; margin: 0 auto; padding: 1rem 1.25rem 3rem; display: grid; gap: 1.25rem; }
    .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr)); align-items: start; }
  `,
})
export class App {
  protected readonly methods = inject(INSIGHT_METHODS);
  protected readonly profileService = inject(ProfileService);
  private readonly refreshes = signal<Record<string, number>>({});

  protected readonly results = computed(() => {
    const profile = this.profileService.profile();
    const validDate = this.profileService.hasValidDate();
    const refreshes = this.refreshes();
    const now = new Date();
    const out: Record<string, InsightResult | null> = {};
    for (const method of this.methods) {
      if (method.requires === 'birthDate' && !validDate) {
        out[method.id] = null;
        continue;
      }
      // A half-typed or invalid date must never reach the engines.
      const safe = validDate ? profile : { ...profile, birthDate: '' };
      const ctx: InsightContext = { profile: safe, now, refresh: refreshes[method.id] ?? 0 };
      out[method.id] = method.compute(ctx);
    }
    return out;
  });

  protected refresh(method: InsightMethod): void {
    this.refreshes.update((r) => ({ ...r, [method.id]: (r[method.id] ?? 0) + 1 }));
  }
}
