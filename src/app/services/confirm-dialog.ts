import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export interface ConfirmOptions {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptSeverity?: 'primary' | 'danger';
}

/**
 * Espone ConfirmationService di PrimeNG con una Promise: si risolve con true
 * solo se l'utente conferma. Il dialog è montato una volta da <app-confirm-dialog />.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly confirmationService = inject(ConfirmationService);

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let settled = false;
      const settle = (value: boolean) => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(value);
      };

      this.confirmationService.confirm({
        header: options.header ?? 'Conferma',
        message: options.message,
        icon: options.icon ?? 'pi pi-question-circle',
        acceptButtonProps: {
          label: options.acceptLabel ?? 'Conferma',
          severity: options.acceptSeverity ?? 'primary',
        },
        rejectButtonProps: {
          label: options.rejectLabel ?? 'Annulla',
          severity: 'secondary',
          text: true,
        },
        accept: () => settle(true),
        reject: () => settle(false),
      });
    });
  }

  /** Conferma di eliminazione: si risolve con true solo se l'utente accetta. */
  confirmDelete(description: string): Promise<boolean> {
    return this.confirm({
      header: 'Conferma eliminazione',
      message: `Vuoi eliminare ${description}? L'operazione non può essere annullata.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Elimina',
      acceptSeverity: 'danger',
    });
  }
}
