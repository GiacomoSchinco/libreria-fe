import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Libro } from '../interfaces/libro';
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
}