import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Autore } from '../interfaces/autore';
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
}