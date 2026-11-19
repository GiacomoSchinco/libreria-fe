const apiBaseUrl = 'http://localhost:8080';

export const environment = {
  production: false,
  /** Base URL del backend. In produzione sostituire con l'URL reale (vedi fileReplacements in angular.json). */
  apiBaseUrl,
  /**
   * Base URL delle API dati (libri, autori, magazzino...), esposte dal backend sotto /api.
   * L'autenticazione fa eccezione: è mappata su /auth, quindi usa apiBaseUrl.
   */
  apiUrl: `${apiBaseUrl}/api`,
};
