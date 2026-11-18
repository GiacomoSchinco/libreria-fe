import { Nazionalita } from './nazionalita';

export interface Autore {
  id: number;
  nome: string;
  cognome: string;
  /** Data ISO nel formato `yyyy-MM-dd`. */
  dataNascita: string;
  nazionalita: Nazionalita;
}
