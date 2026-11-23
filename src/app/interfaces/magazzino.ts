import { CasaEditrice } from './casa-editrice';
import { Libro } from './libro';

export interface Magazzino {
  id: number;
  libro: Libro;
  quantita: number;
  casaEditrice: CasaEditrice | null;
}

/** Corpo di POST/PUT /api/magazzino. */
export interface MagazzinoRequest {
  idLibro: number;
  /** null = lascia il valore attuale (alla creazione il backend usa 1). */
  quantita: number | null;
  idCasaEditrice: number | null;
}
