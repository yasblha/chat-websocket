import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-color-modal',
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="close()">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Personnaliser votre profil</h3>
          <button (click)="close()" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <!-- Aperçu -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Aperçu</h4>
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                   [style.background-color]="userColor">
                {{ currentUser && currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '' }}
              </div>
              <div>
                <div class="font-medium">{{ currentUser?.username }}</div>
                <div class="text-sm text-gray-500">Votre couleur personnalisée</div>
              </div>
            </div>
          </div>

          <!-- Sélecteur de couleur -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-2">Choisir une couleur</label>
            <div class="flex items-center space-x-3">
              <input
                type="color"
                id="color"
                [(ngModel)]="userColor"
                class="h-10 w-20 rounded cursor-pointer"
              >
              <div class="flex-1">
                <input
                  type="text"
                  [(ngModel)]="userColor"
                  class="w-full px-3 py-2 border rounded-md"
                  placeholder="#000000"
                >
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              (click)="close()"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              (click)="saveColor()"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserColorModalComponent implements OnInit {
  @Input() currentUser: User | null = null;
  userColor: string = '#000000';
  isOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.currentUser?.color) {
      this.userColor = this.currentUser.color;
    }
  }

  open(): void {
    this.isOpen = true;
    if (this.currentUser?.color) {
      this.userColor = this.currentUser.color;
    }
  }

  close(): void {
    this.isOpen = false;
  }

  saveColor(): void {
    if (this.currentUser) {
      this.authService.updateUser(this.currentUser.id, { color: this.userColor }).subscribe({
        next: (updatedUser) => {
          console.log('Couleur mise à jour avec succès:', updatedUser);
          this.close();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la couleur:', error);
        }
      });
    }
  }
} 