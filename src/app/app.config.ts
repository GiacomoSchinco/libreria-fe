import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

registerLocaleData(localeIt);

/**
 * Tema dell'app: tonalità indaco per le azioni e superfici calde (carta) in
 * light mode, superfici "inchiostro" in dark mode.
 */
const LibreriaPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8f7f4',
          100: '#f3f2ee',
          200: '#eceae4',
          300: '#e0ded7',
          400: '#a8a59c',
          500: '#85827a',
          600: '#5f5d56',
          700: '#45443f',
          800: '#2b2a27',
          900: '#1b1a17',
          950: '#100f0d',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f6f8fb',
          100: '#eef2f7',
          200: '#dde3ec',
          300: '#c4ccd8',
          400: '#9aa5b5',
          500: '#74808f',
          600: '#4d5768',
          700: '#364255',
          800: '#232c3a',
          900: '#171f2b',
          950: '#0f151f',
        },
      },
    },
  },
});

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
        preset: LibreriaPreset,
        options: {
          darkModeSelector: '.p-dark',
          // I CSS layer lasciano che il CSS dell'app vinca sulle regole del tema.
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
