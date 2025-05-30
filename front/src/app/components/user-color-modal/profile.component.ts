import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-4">Profil utilisateur</h1>
      <div *ngIf="currentUser">
        <p><strong>Nom:</strong> {{ currentUser.name }}</p>
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>Nom d'utilisateur:</strong> {{ currentUser.username }}</p>
        
        <div class="mt-4">
          <label for="color" class="block text-sm font-medium text-gray-700">Couleur personnalisée:</label>
          <input
            type="color"
            id="color"
            [(ngModel)]="userColor"
            (change)="updateColor()"
            class="mt-1 p-1 border rounded"
          >
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  userColor: string = '#000000'; // Couleur par défaut

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.color) {
      this.userColor = this.currentUser.color;
    }
  }

  updateColor(): void {
    if (this.currentUser) {
      console.log('Nouvelle couleur sélectionnée:', this.userColor);
      this.authService.updateUser(this.currentUser.id, { color: this.userColor }).subscribe({
        next: (updatedUser) => {
          console.log('Couleur mise à jour avec succès:', updatedUser);
          // La mise à jour du currentUserSubject dans AuthService mettra à jour l'application si elle écoute l'observable
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la couleur:', error);
          // TODO: Afficher un message d'erreur à l'utilisateur
        }
      });
    }
  }
} 