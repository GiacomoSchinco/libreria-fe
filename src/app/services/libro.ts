import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Libro, LibroRequest, LibroSintesi } from '../interfaces/libro';
import { Page } from '../interfaces/page';

const API_URL = `${environment.apiUrl}/libri`;

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private readonly http = inject(HttpClient);

  /** GET /api/libri?page=0&size=10 */
  getPage(page: number, size: number): Observable<Page<Libro>> {
    return this.http.get<Page<Libro>>(API_URL, { params: { page, size } });
  }

  /** GET /api/libri/{id} */
  getById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${API_URL}/${id}`);
  }

  /** GET /api/libri/ricerca?titolo=... (autocomplete, minimo 3 caratteri, non paginata) */
  searchByTitolo(titolo: string): Observable<LibroSintesi[]> {
    return this.http.get<LibroSintesi[]>(`${API_URL}/ricerca`, { params: { titolo } });
  }

  /** POST /api/libri */
  create(request: LibroRequest): Observable<Libro> {
    return this.http.post<Libro>(API_URL, request);
  }

  /** PUT /api/libri/{id} */
  update(id: number, request: LibroRequest): Observable<Libro> {
    return this.http.put<Libro>(`${API_URL}/${id}`, request);
  }
}