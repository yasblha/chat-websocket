import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  template: `
    <div>
      <label *ngIf="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <input
        *ngIf="control"
        [type]="type"
        [formControl]="control"
        [placeholder]="placeholder"
        class="form-control mt-1"
      >
      <div *ngIf="control?.invalid && (control?.dirty || control?.touched)" class="error">
        <div *ngIf="control?.errors?.['required']">Ce champ est requis.</div>
        <div *ngIf="control?.errors?.['email']">Format d'email invalide.</div>
        <div *ngIf="control?.errors?.['minlength']">Doit contenir au moins {{ control?.errors?.['minlength']?.requiredLength }} caractères.</div>
        <!-- Ajoutez d'autres messages d'erreur si nécessaire -->
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormFieldComponent {
  @Input() control: FormControl | null = null;
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
} 