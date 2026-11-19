import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthService } from './auth';

const TOKEN_STORAGE_KEY = 'Bearer Token';

function fakeJwt(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('AuthService', () => {
  let http: HttpTestingController;

  function createService(): AuthService {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    return service;
  }

  beforeEach(() => localStorage.clear());

  afterEach(() => http.verify());

  it('stores the token returned by the login and exposes the username', () => {
    const service = createService();
    const token = fakeJwt({ sub: 'mario.rossi', exp: Math.floor(Date.now() / 1000) + 3600 });

    service.login({ username: 'mario.rossi', password: 'segreta' }).subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'mario.rossi', password: 'segreta' });
    request.flush({ token });

    const userRequest = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(userRequest.request.method).toBe('GET');
    userRequest.flush({ username: 'mario.rossi' });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUsername()).toBe('mario.rossi');
    expect(service.getToken()).toBe(token);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(token);
  });

  it('restores a valid token saved in localStorage', () => {
    const token = fakeJwt({ sub: 'mario.rossi', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    const service = createService();

    expect(service.getToken()).toBe(token);
    expect(service.currentUsername()).toBeNull();

    service.me().subscribe();
    http.expectOne(`${environment.apiBaseUrl}/auth/me`).flush({ username: 'mario.rossi' });

    expect(service.currentUsername()).toBe('mario.rossi');
  });

  it('ignores a token already expired', () => {
    const token = fakeJwt({ sub: 'mario.rossi', exp: Math.floor(Date.now() / 1000) - 60 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    const service = createService();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('clears the token on logout', () => {
    const token = fakeJwt({ sub: 'mario.rossi', exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    const service = createService();

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
