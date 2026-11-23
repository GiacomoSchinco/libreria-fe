import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CasaEditrice } from '../interfaces/casa-editrice';

const API_URL = `${environment.apiUrl}/case-editrici`;

@Injectable({
  providedIn: 'root',
})
export class CasaEditriceService {
  private readonly http = inject(HttpClient);

  /** GET /api/case-editrici */
  getAll(): Observable<CasaEditrice[]> {
    return this.http.get<CasaEditrice[]>(API_URL);
  }

  /** GET /api/case-editrici/{id} */
  getById(id: number): Observable<CasaEditrice> {
    return this.http.get<CasaEditrice>(`${API_URL}/${id}`);
  }

  /** POST /api/case-editrici */
  create(nome: string): Observable<CasaEditrice> {
    return this.http.post<CasaEditrice>(API_URL, { nome });
  }

  /** PUT /api/case-editrici/{id} */
  update(id: number, nome: string): Observable<CasaEditrice> {
    return this.http.put<CasaEditrice>(`${API_URL}/${id}`, { nome });
  }

  /** DELETE /api/case-editrici/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
