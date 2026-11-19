import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { Auth, AuthMe, LoginResponse } from '../interfaces/auth';

// Il backend espone l'autenticazione su /auth (fuori dal prefisso /api usato dalle API dati).
const API_URL = `${environment.apiBaseUrl}/auth`;
const TOKEN_STORAGE_KEY = 'Bearer Token';

interface JwtPayload {
  sub?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenState = signal<string | null>(readStoredToken());

  /** true se c'è un token non scaduto: lo usano guard e interceptor. */
  readonly isLoggedIn = computed(() => this.tokenState() !== null);

  /** Username estratto dal payload del JWT (null se non autenticato). */
  readonly currentUsername = computed(() => decodePayload(this.tokenState())?.sub ?? null);

  /** Token corrente, da usare nell'header Authorization. */
  getToken(): string | null {
    return this.tokenState();
  }

  /** POST /api/auth/login */
  login(auth: Auth): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/login`, auth)
      .pipe(tap((response) => this.storeToken(response.token)));
  }

  /** POST /api/auth/register */
  register(auth: Auth): Observable<string> {
    // Il backend risponde con un testo semplice ("Utente registrato"), non con JSON.
    return this.http.post(`${API_URL}/register`, auth, { responseType: 'text' });
  }

  /** GET /api/auth/me */
  me(): Observable<AuthMe> {
    return this.http.get<AuthMe>(`${API_URL}/me`);
  }

  logout(): void {
    this.storeToken(null);
  }

  private storeToken(token: string | null): void {
    this.tokenState.set(token);

    // Durante il rendering SSR non esiste localStorage.
    if (typeof localStorage === 'undefined') {
      return;
    }

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }
}

function readStoredToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    return null;
  }

  if (isExpired(token)) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }

  return token;
}

function isExpired(token: string): boolean {
  const exp = decodePayload(token)?.exp;
  return exp !== undefined && exp * 1000 <= Date.now();
}

function decodePayload(token: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as JwtPayload;
  } catch {
    return null;
  }
}
