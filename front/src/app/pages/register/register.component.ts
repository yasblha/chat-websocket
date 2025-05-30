import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

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
            <app-form-field
              [control]="nameControl"
              label="Nom"
              type="text"
              placeholder="Entrez votre nom"
            ></app-form-field>

            <app-form-field
              [control]="usernameControl"
              label="Nom d'utilisateur"
              type="text"
              placeholder="Choisissez un nom d'utilisateur"
            ></app-form-field>

            <app-form-field
              [control]="emailControl"
              label="Email"
              type="email"
              placeholder="Entrez votre email"
            ></app-form-field>

            <app-form-field
              [control]="passwordControl"
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
            ></app-form-field>

            <app-form-field
              [control]="confirmPasswordControl"
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Confirmez votre mot de passe"
            ></app-form-field>
            
            <!-- Gestion de l'erreur de correspondance de mot de passe -->
            <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched" class="error">
              Les mots de passe ne correspondent pas
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
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent]
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

  get nameControl() {
    return this.registerForm.get('name') as FormControl;
  }

  get usernameControl() {
    return this.registerForm.get('username') as FormControl;
  }

  get emailControl() {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword') as FormControl;
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