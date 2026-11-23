import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

import { apiErrorMessage } from '../utils/api-error';

export type NotificationSeverity = 'success' | 'error' | 'info' | 'warn';

const DEFAULT_LIFE = { success: 3000, info: 3000, warn: 4000, error: 6000 } as const;
const DEFAULT_ERROR_DETAIL = 'Riprova più tardi.';

/**
 * Notifiche globali (toast): si appoggia a MessageService di PrimeNG,
 * mostrato una volta sola da <app-toast />. Le pagine non toccano il DOM.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(summary: string, detail?: string): void {
    this.notify('success', summary, detail);
  }

  error(summary: string, detail?: string): void {
    this.notify('error', summary, detail);
  }

  /** Toast d'errore che mostra come detail il motivo restituito dal backend. */
  errorFrom(error: unknown, summary = 'Operazione non riuscita'): void {
    this.error(summary, apiErrorMessage(error) ?? DEFAULT_ERROR_DETAIL);
  }

  info(summary: string, detail?: string): void {
    this.notify('info', summary, detail);
  }

  warn(summary: string, detail?: string): void {
    this.notify('warn', summary, detail);
  }

  private notify(severity: NotificationSeverity, summary: string, detail?: string): void {
    this.messageService.add({ severity, summary, detail, life: DEFAULT_LIFE[severity] });
  }
}
