import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Libreria · Home',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    title: 'Libreria · Accedi',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'libri',
    title: 'Libreria · Libri',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/libri/libri').then((m) => m.Libri),
  },
  {
    path: 'libri/:id',
    title: 'Libreria · Dettaglio libro',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/libro-detail/libro-detail').then((m) => m.LibroDetail),
  },
  {
    path: 'magazzino',
    title: 'Libreria · Magazzino',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/magazzino/magazzino').then((m) => m.Magazzino),
  },
  {
    path: 'autori',
    title: 'Libreria · Autori',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/autori/autori').then((m) => m.Autori),
  },
  { path: '**', redirectTo: '' },
];
