import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InsightMethod, InsightResult } from '../core/insight';

/** Renders any InsightMethod's result. Knows nothing about specific methods. */
@Component({
  selector: 'si-insight-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <header>
        <span class="icon" aria-hidden="true">{{ method().icon }}</span>
        <div>
          <h2>{{ method().title }}</h2>
          <p class="muted">{{ method().tagline }}</p>
        </div>
        @if (method().refreshable && result()) {
          <button type="button" class="secondary" (click)="refreshRequested.emit()">New cast</button>
        }
      </header>

      @if (needsBirthDate()) {
        <p class="muted">Enter a valid birth date above to unlock this reading.</p>
      } @else if (result(); as r) {
        <div class="headline">
          @if (r.symbol) {
            <span class="symbol" aria-hidden="true">{{ r.symbol }}</span>
          }
          <strong>{{ r.headline }}</strong>
        </div>

        @if (r.hexagramLines; as lines) {
          <div class="hexagram" role="img" [attr.aria-label]="'Hexagram lines from bottom to top: ' + lines.join(', ')">
            @for (line of lines.slice().reverse(); track $index) {
              <div class="line" [class.yin]="line === 6 || line === 8" [class.changing]="line === 6 || line === 9"></div>
            }
          </div>
        }

        @if (r.text) {
          <p>{{ r.text }}</p>
        }

        @for (group of r.groups ?? []; track $index) {
          @if (group.title) {
            <h3>{{ group.title }}</h3>
          }
          <dl class="facts">
            @for (fact of group.facts; track fact.label) {
              <dt [class.long]="fact.value.length > 28">{{ fact.label }}</dt>
              <dd [class.long]="fact.value.length > 28">
                {{ fact.value }}
                @if (fact.hint) {
                  <small class="muted">{{ fact.hint }}</small>
                }
              </dd>
            }
          </dl>
        }

        @for (set of r.numbers ?? []; track set.label) {
          <div class="numbers">
            <span class="muted">{{ set.label }}</span>
            <span class="balls">
              @for (n of set.values; track n) {
                <span class="ball" [class]="set.tone">{{ n }}</span>
              }
            </span>
          </div>
        }

        @if (r.caveat) {
          <p class="caveat muted">{{ r.caveat }}</p>
        }
      }
    </article>
  `,
  styles: `
    .card { background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015)), var(--surface);
      border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius); box-shadow: var(--shadow-soft); padding: 1.25rem; }
    header { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
    header div { flex: 1; }
    h2 { margin: 0; font-size: 1.15rem; }
    h3 { margin: 1rem 0 .25rem; font-size: .95rem; color: var(--accent); }
    p { margin: .25rem 0; }
    .icon { font-size: 1.6rem; }
    .headline { display: flex; align-items: center; gap: .75rem; font-size: 1.2rem; margin: .5rem 0; }
    .symbol { font-size: 2rem; }
    .facts { display: grid; grid-template-columns: auto 1fr; gap: .25rem 1rem; margin: .5rem 0; font-size: .9rem; }
    dt { color: var(--muted); }
    dd { margin: 0; text-align: right; }
    dt.long, dd.long { grid-column: 1 / -1; text-align: left; }
    dt.long { margin-top: .25rem; }
    dd.long { margin-bottom: .25rem; }
    .numbers { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin: .5rem 0; font-size: .85rem; }
    .balls { display: flex; gap: .4rem; }
    .ball { width: 2rem; height: 2rem; border-radius: 50%; display: grid; place-items: center; font-weight: 700; color: #0c0f1a;
      background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.6), transparent 45%), var(--muted); box-shadow: inset 0 -4px 6px rgba(0,0,0,.25); }
    .ball.lucky { background-color: var(--success); }
    .ball.unlucky { background-color: var(--danger); }
    .ball.neutral { background-color: var(--accent); }
    .hexagram { display: grid; gap: .3rem; width: 7rem; margin: .5rem 0; }
    .line { height: .6rem; background: var(--text); border-radius: 2px; }
    .line.yin { background: linear-gradient(90deg, var(--text) 0 42%, transparent 42% 58%, var(--text) 58%); }
    .line.changing { outline: 1px solid var(--accent); outline-offset: 2px; }
    .caveat { font-size: .8rem; margin-top: 1rem; }
  `,
})
export class InsightCardComponent {
  readonly method = input.required<InsightMethod>();
  readonly result = input<InsightResult | null>(null);
  readonly needsBirthDate = input(false);
  readonly refreshRequested = output<void>();
}
