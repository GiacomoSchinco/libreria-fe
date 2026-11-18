import { CasaEditrice } from './casa-editrice';
import { Libro } from './libro';

export interface Magazzino {
  id: number;
  libro: Libro;
  quantita: number;
  casaEditrice: CasaEditrice;
}
