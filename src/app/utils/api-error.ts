import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '../interfaces/api-error';

const UNREACHABLE_MESSAGE = 'Impossibile contattare il server. Riprova.';

/**
 * Estrae il motivo dell'errore da un HttpErrorResponse: usa il campo message
 * del body restituito dal backend, con fallback su errori di rete o risposte non JSON.
 */
export function apiErrorMessage(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const body = error.error as Partial<ApiError> | string | null | undefined;

  if (typeof body === 'string') {
    const message = body.trim();
    return message.length > 0 ? message : null;
  }

  const message = body?.message?.trim();
  if (message) {
    return message;
  }

  if (error.status === 0) {
    return UNREACHABLE_MESSAGE;
  }

  return null;
}
