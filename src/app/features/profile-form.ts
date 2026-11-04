import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { isValidBirthDate } from '../core/insight';
import { ProfileService } from '../core/profile.service';

@Component({
  selector: 'si-profile-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="card" (submit)="$event.preventDefault()">
      <h2>👤 About you</h2>
      <p class="muted">Saved only in this browser. Birth time and place are optional but sharpen the planets and ascendant.</p>
      <div class="fields">
        <label>Full name
          <input type="text" autocomplete="name" [value]="p().name" (input)="set({ name: val($event) })" />
        </label>
        <label>Birth date
          <input type="date" [value]="p().birthDate" [class.bad]="dateBad()" (input)="set({ birthDate: val($event) })" />
        </label>
        <label>Birth time
          <input type="time" [value]="p().birthTime" (input)="set({ birthTime: val($event) })" />
        </label>
        <label>UTC offset (hours)
          <input type="number" step="0.5" min="-12" max="14" [value]="p().utcOffset" (input)="set({ utcOffset: num($event) ?? 0 })" />
        </label>
        <label>Latitude
          <input type="number" step="0.0001" min="-90" max="90" [value]="p().latitude ?? ''" (input)="set({ latitude: num($event) })" />
        </label>
        <label>Longitude (east +)
          <input type="number" step="0.0001" min="-180" max="180" [value]="p().longitude ?? ''" (input)="set({ longitude: num($event) })" />
        </label>
      </div>
      @if (dateBad()) {
        <p class="error" role="alert">Enter a real birth date (1900 or later, not in the future).</p>
      }
      <button type="button" class="secondary" (click)="profiles.clear()">Clear</button>
    </form>
  `,
  styles: `
    .card { background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015)), var(--surface);
      border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius); box-shadow: var(--shadow-soft); padding: 1.25rem; }
    h2 { margin: 0 0 .25rem; font-size: 1.15rem; }
    .fields { display: grid; gap: .75rem 1rem; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); margin: 1rem 0; }
    label { display: grid; gap: .25rem; font-size: .85rem; color: var(--muted); }
    input { background: var(--surface-3); color: var(--text); border: 1px solid rgba(255,255,255,.12); border-radius: var(--radius); padding: .5rem .6rem; font: inherit; }
    input.bad { border-color: var(--danger); }
    .error { color: var(--danger); font-size: .85rem; }
  `,
})
export class ProfileFormComponent {
  protected readonly profiles = inject(ProfileService);
  protected readonly p = this.profiles.profile;
  protected readonly dateBad = computed(() => !!this.p().birthDate && !isValidBirthDate(this.p().birthDate));

  protected set(patch: Parameters<ProfileService['update']>[0]): void {
    this.profiles.update(patch);
  }
  protected val(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }
  protected num(e: Event): number | null {
    const raw = (e.target as HTMLInputElement).value;
    const n = Number(raw);
    return raw === '' || !Number.isFinite(n) ? null : n;
  }
}
