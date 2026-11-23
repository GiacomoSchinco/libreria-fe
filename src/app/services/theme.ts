import { DOCUMENT, Injectable, inject } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'libreria-theme';

/**
 * Tema chiaro/scuro. La classe `.p-dark` sull'elemento <html> pilota sia il
 * preset PrimeNG sia i token dell'app; il tema iniziale è applicato da uno
 * script inline in index.html per evitare il flash al primo caricamento.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  toggle(): void {
    const root = this.document.documentElement;
    const next: ThemeMode = root.classList.contains('p-dark') ? 'light' : 'dark';
    root.classList.toggle('p-dark', next === 'dark');

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage non disponibile (Safari privato, SSR): il tema resta solo per la sessione.
    }
  }
}
