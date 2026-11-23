import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

import { Brand } from '../brand/brand';
import { AuthService } from '../../services/auth';
import { LayoutService } from '../../services/layout';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-topbar',
  imports: [ButtonDirective, RouterLink, Brand],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly layout = inject(LayoutService);
  protected readonly theme = inject(ThemeService);

  /** Mostra il pulsante del menu: solo quando la pagina ha la sidebar. */
  readonly showMenu = input(false);

  protected readonly username = this.authService.currentUsername;
  protected readonly profileError = signal<string | null>(null);

  private readonly isBrowser = signal(false);
  /** Lo stato di login esiste solo nel browser: evita mismatch con l'HTML prerenderizzato. */
  protected readonly showSession = computed(
    () => this.isBrowser() && this.authService.isLoggedIn(),
  );

  protected readonly initials = computed(() => {
    const name = this.username()?.trim();
    return name ? name.charAt(0).toUpperCase() : '';
  });

  constructor() {
    afterNextRender(() => {
      this.isBrowser.set(true);
      if (this.authService.isLoggedIn()) {
        this.authService.me().subscribe({
          error: (error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              this.authService.logout();
              void this.router.navigate(['/login']);
              return;
            }
            this.profileError.set('Profilo non disponibile');
          },
        });
      }
    });
  }

  protected toggleMenu(): void {
    this.layout.toggleMobile();
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
