import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Magazzino, MagazzinoRequest } from '../interfaces/magazzino';
import { Page } from '../interfaces/page';

const API_URL = `${environment.apiUrl}/magazzino`;

@Injectable({
  providedIn: 'root',
})
export class MagazzinoService {
  private readonly http = inject(HttpClient);

  /** GET /api/magazzino?page=0&size=10 */
  getPage(page: number, size: number): Observable<Page<Magazzino>> {
    return this.http.get<Page<Magazzino>>(API_URL, { params: { page, size } });
  }

  /** GET /api/magazzino/{id} */
  getById(id: number): Observable<Magazzino> {
    return this.http.get<Magazzino>(`${API_URL}/${id}`);
  }

  /** POST /api/magazzino */
  create(request: MagazzinoRequest): Observable<Magazzino> {
    return this.http.post<Magazzino>(API_URL, request);
  }

  /** PUT /api/magazzino/{id} */
  update(id: number, request: MagazzinoRequest): Observable<Magazzino> {
    return this.http.put<Magazzino>(`${API_URL}/${id}`, request);
  }

  /** DELETE /api/magazzino/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}