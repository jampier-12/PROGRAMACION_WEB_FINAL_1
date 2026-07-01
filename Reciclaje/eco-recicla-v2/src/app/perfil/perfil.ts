import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- CORRECCIÓN: Para activar [(ngModel)]
import { AuthService } from '../auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // <-- Agregado FormsModule aquí
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {
  // Datos informativos del usuario logueado
  nombreCompleto: string = 'Usuario Eco-Recicla';
  correoElectronico: string = 'correo@ejemplo.com';
  rolUsuario: string = 'Ciudadano';

  // Campos editables del formulario
  telefono: string = '';
  distrito: string = '';
  direccion: string = '';
  acercaDeMi: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Jalamos los datos reales del usuario logueado en el sistema
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.nombreCompleto = usuario.nombre || usuario.nombreCompleto || this.nombreCompleto;
      this.correoElectronico = usuario.correo || this.correoElectronico;
      this.rolUsuario = usuario.rol || this.rolUsuario;
      this.telefono = usuario.telefono || '';
      this.distrito = usuario.distrito || '';
      this.direccion = usuario.direccion || '';
    }
  }

  guardarCambios() {
    console.log('Guardando datos de perfil locales:', {
      telefono: this.telefono,
      distrito: this.distrito,
      direccion: this.direccion,
      acercaDeMi: this.acercaDeMi
    });
    alert('¡Cambios guardados exitosamente!');
  }
}