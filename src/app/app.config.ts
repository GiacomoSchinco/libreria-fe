import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import Material from '@primeuix/themes/material';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'it-IT' },
    ConfirmationService,
    MessageService,
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Material,
        options: {
          darkModeSelector: '.p-dark',
        },
      },
    }),
  ],
};
