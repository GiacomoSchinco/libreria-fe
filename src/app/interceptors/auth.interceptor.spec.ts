import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let token: string | null;

  beforeEach(() => {
    token = null;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken: () => token } },
      ],
    });

    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('adds the bearer token to API requests', () => {
    token = 'jwt-token';

    client.get(`${environment.apiUrl}/libri`).subscribe();

    const request = http.expectOne(`${environment.apiUrl}/libri`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush({});
  });

  it('adds the bearer token to the auth endpoints too', () => {
    token = 'jwt-token';

    client.get(`${environment.apiBaseUrl}/auth/me`).subscribe();

    const request = http.expectOne(`${environment.apiBaseUrl}/auth/me`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    request.flush({});
  });

  it('leaves the request untouched when there is no token', () => {
    client.get(`${environment.apiUrl}/libri`).subscribe();

    const request = http.expectOne(`${environment.apiUrl}/libri`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  it('does not send the token to URLs outside the API', () => {
    token = 'jwt-token';

    client.get('https://example.com/data').subscribe();

    const request = http.expectOne('https://example.com/data');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
