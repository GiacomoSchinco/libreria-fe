import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Genere } from '../interfaces/genere';

const API_URL = `${environment.apiUrl}/generi`;

@Injectable({
  providedIn: 'root',
})
export class GenereService {
  private readonly http = inject(HttpClient);

  /** GET /api/generi */
  getAll(): Observable<Genere[]> {
    return this.http.get<Genere[]>(API_URL);
  }

  /** GET /api/generi/{id} */
  getById(id: number): Observable<Genere> {
    return this.http.get<Genere>(`${API_URL}/${id}`);
  }

  /** DELETE /api/generi/{id} */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

  /** POST /api/generi */
  create(nome: string): Observable<Genere> {
    return this.http.post<Genere>(API_URL, { nome });
  }

  /** PUT /api/generi/{id} */
  update(id: number, nome: string): Observable<Genere> {
    return this.http.put<Genere>(`${API_URL}/${id}`, { nome });
  }
}