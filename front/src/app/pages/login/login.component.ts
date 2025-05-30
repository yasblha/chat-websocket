import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormFieldComponent } from '../../components/form-field/form-field.component';

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
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent]
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

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
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