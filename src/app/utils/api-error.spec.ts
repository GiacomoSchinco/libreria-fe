import { HttpErrorResponse } from '@angular/common/http';

import { apiErrorMessage } from './api-error';

describe('apiErrorMessage', () => {
  const apiError = {
    timestamp: '2026-11-23T11:30:46',
    status: 409,
    error: 'Conflict',
    message: 'Genere con id 1 è usata da almeno un libro: cancellazione non consentita',
    path: '/api/generi/1',
  };

  it('should return the backend message for an HttpErrorResponse', () => {
    const error = new HttpErrorResponse({ status: 409, error: apiError });

    expect(apiErrorMessage(error)).toBe(apiError.message);
  });

  it('should return the body when it is plain text', () => {
    const error = new HttpErrorResponse({ status: 400, error: '  Dati non validi  ' });

    expect(apiErrorMessage(error)).toBe('Dati non validi');
  });

  it('should fall back to a network message when the server is unreachable', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(apiErrorMessage(error)).toContain('Impossibile contattare il server');
  });

  it('should return null for non HTTP errors', () => {
    expect(apiErrorMessage(new Error('boom'))).toBeNull();
  });
});
