import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Stato vuoto riutilizzabile per tabelle e liste. */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">
        <i class="pi" [class]="icon()"></i>
      </span>
      <p class="empty-state__title">{{ title() }}</p>
      @if (message()) {
        <p class="empty-state__message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .empty-state {
      display: grid;
      justify-items: center;
      gap: 0.35rem;
      padding: 2.25rem 1rem;
      text-align: center;
    }

    .empty-state__icon {
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      margin-bottom: 0.35rem;
      border-radius: 50%;
      background: var(--app-panel-muted);
      color: var(--app-text-muted);
      font-size: 1.15rem;
    }

    .empty-state__title {
      margin: 0;
      font-weight: 600;
    }

    .empty-state__message {
      margin: 0;
      max-width: 26rem;
      color: var(--app-text-muted);
      font-size: 0.85rem;
    }
  `,
})
export class EmptyState {
  readonly icon = input('pi pi-inbox');
  readonly title = input.required<string>();
  readonly message = input<string>();
}
