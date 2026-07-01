import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private authService = inject(AuthService);
  
  // Variable que el HTML leerá para saber si muestra el menú
  usuarioLogueado = false;

  ngOnInit() {
    // Nos suscribimos para saber en tiempo real si el usuario entra o sale
    this.authService.conectado$.subscribe(estado => {
      this.usuarioLogueado = estado;
    });
  }
}