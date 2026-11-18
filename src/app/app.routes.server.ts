import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  // Le pagine che leggono le API le rendiamo lato client: niente fetch durante il build.
  { path: '**', renderMode: RenderMode.Client },
];