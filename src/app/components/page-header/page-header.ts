import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Intestazione comune delle pagine: titolo, sottotitolo e azioni proiettate. */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="page-header__text">
        <div class="page-header__title-row">
          @if (icon()) {
            <span class="page-header__icon" aria-hidden="true">
              <i class="pi" [class]="icon()"></i>
            </span>
          }
          <h1 class="page-header__title">{{ title() }}</h1>
        </div>
        @if (subtitle()) {
          <p class="page-header__subtitle">{{ subtitle() }}</p>
        }
      </div>

      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem 1.5rem;
      padding-bottom: 0.25rem;
    }

    .page-header__text {
      display: grid;
      gap: 0.3rem;
      min-width: 0;
    }

    .page-header__title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .page-header__icon {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.6rem;
      background: color-mix(in srgb, var(--p-primary-color), transparent 90%);
      color: var(--p-primary-color);
      font-size: 0.95rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.95rem);
      font-weight: 700;
      line-height: 1.15;
      text-wrap: balance;
    }

    .page-header__subtitle {
      margin: 0;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .page-header__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.6rem;
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
}
