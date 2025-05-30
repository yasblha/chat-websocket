import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Inscription</h2>
        </div>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control mt-1"
                placeholder="Entrez votre nom"
              >
              <div *ngIf="registerForm.get('name')?.errors?.['required'] && registerForm.get('name')?.touched" class="error">
                Le nom est requis
              </div>
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                formControlName="username"
                class="form-control mt-1"
                placeholder="Choisissez un nom d'utilisateur"
              >
              <div *ngIf="registerForm.get('username')?.errors?.['required'] && registerForm.get('username')?.touched" class="error">
                Le nom d'utilisateur est requis
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control mt-1"
                placeholder="Entrez votre email"
              >
              <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched" class="error">
                L'email est requis
              </div>
              <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched" class="error">
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
              <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched" class="error">
                Le mot de passe est requis
              </div>
              <div *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched" class="error">
                Le mot de passe doit contenir au moins 6 caractères
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="form-control mt-1"
                placeholder="Confirmez votre mot de passe"
              >
              <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required'] && registerForm.get('confirmPassword')?.touched" class="error">
                La confirmation du mot de passe est requise
              </div>
              <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="error">
                Les mots de passe ne correspondent pas
              </div>
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary w-full">
            S'inscrire
          </button>
        </form>

        <p class="text-center text-sm text-gray-600 mt-4">
          Déjà un compte ? 
          <a (click)="navigateToLogin()" class="text-blue-600 hover:text-blue-800 cursor-pointer">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      status: ['active'] // Valeur par défaut
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
} 