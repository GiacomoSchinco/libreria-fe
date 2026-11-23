import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Marchio dell'app: usato in topbar, login e landing page. */
@Component({
  selector: 'app-brand',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="brand" routerLink="/" [class.brand--compact]="compact()">
      <span class="brand__mark" aria-hidden="true">
        <i class="pi pi-book"></i>
      </span>
      @if (!compact()) {
        <span class="brand__text">
          <span class="brand__name">Libreria</span>
          <span class="brand__tag">Catalogo online</span>
        </span>
      }
    </a>
  `,
  styles: `
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      color: inherit;
      text-decoration: none;
    }

    .brand__mark {
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.7rem;
      background: var(--app-gradient-brand);
      box-shadow: var(--app-shadow-brand);
      color: #fff;
      font-size: 1.05rem;
    }

    .brand__text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .brand__name {
      font-size: 0.975rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .brand__tag {
      color: var(--app-text-muted);
      font-size: 0.7rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  `,
})
export class Brand {
  /** Nasconde il testo, lasciando solo il simbolo. */
  readonly compact = input(false);
}
