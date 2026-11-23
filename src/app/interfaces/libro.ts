import { Autore, AutoreRequest } from './autore';
import { Genere } from './genere';

export interface Libro {
  id: number;
  titolo: string;
  anno: number;
  genere: Genere | null;
  autori: Autore[];
}

/** Risultato di GET /api/libri/ricerca (autocomplete sul titolo). */
export interface LibroSintesi {
  id: number;
  titolo: string;
}

/**
 * Corpo di POST/PUT /api/libri: genere e autori si indicano per id (esistenti)
 * oppure per nome (riusati se già presenti, creati altrimenti).
 */
export interface LibroRequest {
  titolo: string;
  anno: number | null;
  /** Genere esistente; alternativo a `nomeGenere`. */
  idGenere: number | null;
  /** Genere per nome; alternativo a `idGenere`. */
  nomeGenere: string | null;
  /** Autori esistenti. */
  idAutori: number[];
  /** Autori indicati per nome e cognome. */
  nuoviAutori: AutoreRequest[];
}
