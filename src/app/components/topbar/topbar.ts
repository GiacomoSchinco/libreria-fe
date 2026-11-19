import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-topbar',
  imports: [ButtonDirective, RouterLink, RouterLinkActive, Toolbar],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly appName = signal('Libreria');
  protected readonly username = this.authService.currentUsername;

  private readonly isBrowser = signal(false);
  /** Lo stato di login esiste solo nel browser: evita mismatch con l'HTML prerenderizzato. */
  protected readonly showSession = computed(
    () => this.isBrowser() && this.authService.isLoggedIn(),
  );

  constructor() {
    afterNextRender(() => this.isBrowser.set(true));
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
