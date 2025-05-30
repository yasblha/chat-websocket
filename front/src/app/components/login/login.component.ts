import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Connexion</h2>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control mt-1"
                placeholder="Entrez votre email"
              >
              <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched" class="error">
                L'email est requis
              </div>
              <div *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched" class="error">
                Format d'email invalide
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control mt-1"
                placeholder="Entrez votre mot de passe"
              >
              <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched" class="error">
                Le mot de passe est requis
              </div>
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary w-full">
            Se connecter
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ? 
          <a (click)="navigateToRegister()" class="text-blue-600 hover:text-blue-800 cursor-pointer">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
} 