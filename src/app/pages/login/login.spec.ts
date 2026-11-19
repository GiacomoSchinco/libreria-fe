import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Mock, vi } from 'vitest';

import { AuthService } from '../../services/auth';
import { LoginPage } from './login';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let authService: { login: Mock };
  let router: { navigateByUrl: Mock };

  beforeEach(async () => {
    authService = { login: vi.fn().mockReturnValue(of({ token: 'fake.jwt.token' })) };
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/libri' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows validation errors and skips the request when the form is empty', () => {
    component.submit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.field__error').length).toBe(2);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('sends the credentials and redirects to the requested page', () => {
    component.form.setValue({ username: 'mario.rossi', password: 'segreta' });
    component.submit();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'mario.rossi',
      password: 'segreta',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/libri');
  });

  it('toggles the password visibility with the eye button', () => {
    const element = fixture.nativeElement as HTMLElement;
    const password = element.querySelector('#password') as HTMLInputElement;
    const toggle = element.querySelector('.field__password-toggle') as HTMLButtonElement;

    expect(password.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Mostra password');

    toggle.click();
    fixture.detectChanges();

    expect(password.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Nascondi password');

    toggle.click();
    fixture.detectChanges();

    expect(password.type).toBe('password');
  });

  it('shows the backend message when the credentials are rejected', () => {
    authService.login.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { status: 401, reason: 'Unauthorized', message: 'Credenziali errate' },
          }),
      ),
    );

    component.form.setValue({ username: 'mario.rossi', password: 'sbagliata' });
    component.submit();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.login__error') as HTMLElement | null;

    expect(error?.textContent).toContain('Credenziali errate');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
