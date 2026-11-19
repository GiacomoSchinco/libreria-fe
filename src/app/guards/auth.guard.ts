import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

/** Blocca le pagine protette e rimanda al login ricordando l'URL richiesto. */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) {
    return true;
  }

  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/** Reindirizza gli utenti autenticati alle pagine operative invece che a home/login. */
export const guestGuard: CanActivateFn = () => {
  if (!inject(AuthService).isLoggedIn()) {
    return true;
  }

  return inject(Router).createUrlTree(['/magazzino']);
};
