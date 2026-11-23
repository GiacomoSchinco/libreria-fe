import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Topbar } from './components/topbar/topbar';
import { Sidebar } from './components/sidebar/sidebar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar, Sidebar, ConfirmDialogComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  protected readonly showSidebar = signal(this.shouldShowSidebar(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.showSidebar.set(this.shouldShowSidebar(event.urlAfterRedirects)));
  }

  private shouldShowSidebar(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path !== '/' && path !== '/login';
  }
}