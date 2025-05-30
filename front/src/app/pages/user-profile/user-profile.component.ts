import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="min-h-screen bg-gray-100 py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- En-tête du profil -->
          <div class="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div class="absolute -bottom-16 left-8">
              <div class="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <div class="w-full h-full flex items-center justify-center text-4xl font-bold"
                     [style.background-color]="user?.color || '#E5E7EB'">
                  {{ user && user.username ? user.username.charAt(0).toUpperCase() : '' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Informations du profil -->
          <div class="pt-20 px-8 pb-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ user?.username }}</h1>
                <p class="text-gray-600">{{ user?.email }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 rounded-full" [style.background-color]="user?.color"></div>
                <span class="text-sm text-gray-600">Couleur personnalisée</span>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-3 gap-4 mb-8">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">0</div>
                <div class="text-sm text-gray-600">Messages</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">0</div>
                <div class="text-sm text-gray-600">Conversations</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-gray-900">0</div>
                <div class="text-sm text-gray-600">Jours actif</div>
              </div>
            </div>

            <!-- Bouton de retour -->
            <button 
              (click)="goBack()"
              class="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Retour au chat
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      if (userId) {
        this.userService.getUserProfile(userId).subscribe({
          next: (user) => {
            this.user = user;
            console.log('Profil chargé:', this.user);
          },
          error: (error) => {
            console.error('Erreur lors du chargement du profil:', error);
            this.router.navigate(['/chat']);
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/chat']);
  }
} 