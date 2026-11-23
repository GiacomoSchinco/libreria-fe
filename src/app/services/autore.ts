import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Autore, AutoreRequest } from '../interfaces/autore';
import { Page } from '../interfaces/page';

const API_URL = `${environment.apiUrl}/autori`;

@Injectable({
  providedIn: 'root',
})
export class AutoreService {
  private readonly http = inject(HttpClient);

  /** GET /api/autori?page=0&size=10 */
  getPage(page: number, size: number): Observable<Page<Autore>> {
    return this.http.get<Page<Autore>>(API_URL, { params: { page, size } });
  }

  /** GET /api/autori/{id} */
  getById(id: number): Observable<Autore> {
    return this.http.get<Autore>(`${API_URL}/${id}`);
  }

  /** POST /api/autori */
  create(request: AutoreRequest): Observable<Autore> {
    return this.http.post<Autore>(API_URL, request);
  }

  /** PUT /api/autori/{id} */
  update(id: number, request: AutoreRequest): Observable<Autore> {
    return this.http.put<Autore>(`${API_URL}/${id}`, request);
  }

  /** DELETE /api/autori/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}