import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Libreria · Home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'libri',
    title: 'Libreria · Libri',
    loadComponent: () => import('./pages/libri/libri').then((m) => m.Libri),
  },
  {
    path: 'libri/:id',
    title: 'Libreria · Dettaglio libro',
    loadComponent: () => import('./pages/libro-detail/libro-detail').then((m) => m.LibroDetail),
  },
  {
    path: 'magazzino',
    title: 'Libreria · Magazzino',
    loadComponent: () => import('./pages/magazzino/magazzino').then((m) => m.Magazzino),
  },
  { 
    path: 'autori',
    title: 'Libreria · Autori',
    loadComponent: () => import('./pages/autori/autori').then((m) => m.Autori),
  },
  { path: '**', redirectTo: '' },
];