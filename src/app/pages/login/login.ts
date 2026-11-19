import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { ApiError } from '../../interfaces/api-error';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, ButtonDirective, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected usernameError(): string | null {
    return this.showError('username') ? 'Inserisci lo username.' : null;
  }

  protected passwordError(): string | null {
    return this.showError('password') ? 'Inserisci la password.' : null;
  }

  submit(): void {
    this.errorMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigateByUrl(this.returnUrl());
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const apiError = error.error as ApiError | null;
        this.errorMessage.set(apiError?.message ?? 'Impossibile contattare il server. Riprova.');
      },
    });
  }

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  /** Torna alla pagina richiesta dal guard, ma solo per URL interni. */
  private returnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl?.startsWith('/') ? returnUrl : '/';
  }

  private showError(controlName: 'username' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }
}
