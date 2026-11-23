import { Injectable, signal } from '@angular/core';

const RAIL_STORAGE_KEY = 'libreria-sidebar-rail';

/**
 * Stato della navigazione: su desktop il menu si può comprimere a icona,
 * su mobile diventa un drawer con backdrop.
 */
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly rail = signal(readRailPreference());
  readonly mobileOpen = signal(false);

  toggleRail(): void {
    const next = !this.rail();
    this.rail.set(next);

    try {
      localStorage.setItem(RAIL_STORAGE_KEY, next ? '1' : '0');
    } catch {
      // Storage non disponibile: la preferenza vale per la sessione.
    }
  }

  toggleMobile(): void {
    this.mobileOpen.update((open) => !open);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}

function readRailPreference(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  try {
    return localStorage.getItem(RAIL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
