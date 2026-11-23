import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { Tooltip } from 'primeng/tooltip';

import { LayoutService } from '../../services/layout';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Tooltip],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly router = inject(Router);
  protected readonly layout = inject(LayoutService);

  protected readonly rail = this.layout.rail;
  protected readonly mobileOpen = this.layout.mobileOpen;

  protected readonly navigation: NavGroup[] = [
    {
      label: 'Catalogo',
      items: [
        { label: 'Libri', icon: 'pi pi-book', route: '/libri' },
        { label: 'Magazzino', icon: 'pi pi-box', route: '/magazzino' },
      ],
    },
    {
      label: 'Gestione',
      items: [
        { label: 'Autori', icon: 'pi pi-users', route: '/autori' },
        { label: 'Generi', icon: 'pi pi-tags', route: '/generi' },
        { label: 'Nazionalità', icon: 'pi pi-globe', route: '/nazionalita' },
        { label: 'Case editrici', icon: 'pi pi-building', route: '/case-editrici' },
      ],
    },
  ];

  constructor() {
    // Il drawer mobile si chiude da solo dopo ogni navigazione.
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.layout.closeMobile());
  }

  protected toggleRail(): void {
    this.layout.toggleRail();
  }

  protected closeMobile(): void {
    this.layout.closeMobile();
  }
}
