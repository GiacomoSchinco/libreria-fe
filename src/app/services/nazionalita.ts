import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Nazionalita } from '../interfaces/nazionalita';

const API_URL = `${environment.apiUrl}/nazionalita`;

@Injectable({
  providedIn: 'root',
})
export class NazionalitaService {
  private readonly http = inject(HttpClient);

  /** GET /api/nazionalita */
  getAll(): Observable<Nazionalita[]> {
    return this.http.get<Nazionalita[]>(API_URL);
  }

  /** GET /api/nazionalita/{id} */
  getById(id: number): Observable<Nazionalita> {
    return this.http.get<Nazionalita>(`${API_URL}/${id}`);
  }
}