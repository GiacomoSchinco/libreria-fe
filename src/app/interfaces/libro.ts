import { Autore } from './autore';
import { Genere } from './genere';

export interface Libro {
  id: number;
  titolo: string;
  anno: number;
  genere: Genere;
  autori: Autore[];
}