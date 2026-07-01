import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudService, Solicitud } from '../solicitud.service';
import { AuthService } from '../auth.service'; // <-- Importación corregida aquí
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, OnDestroy {
  private solicitudService = inject(SolicitudService);
  private authService = inject(AuthService); // <-- Inyección limpia del servicio
  private sub?: Subscription;

  // Variables de los contadores de la interfaz
  totalDisponibles: number = 0;
  totalRecolectados: number = 0;
  kilosRecuperados: number = 0;

  // Variable dinámica para el nombre del usuario logueado
  nombreUsuario: string = 'USUARIO';

  // Lista de solicitudes recientes para la sección inferior
  solicitudesRecientes: Solicitud[] = [];

  ngOnInit() {
    const usuarioLogueado = this.authService.getUsuario();
    
    // Imprimimos en la consola del navegador para espiar los datos reales de SQLite
    console.log('Datos del usuario en Inicio:', usuarioLogueado);
    
    if (usuarioLogueado) {
      // Agregamos todas las combinaciones posibles que maneje tu backend
      this.nombreUsuario = (
        usuarioLogueado.nombre || 
        usuarioLogueado.username || 
        usuarioLogueado.name || 
        usuarioLogueado.nombres || 
        usuarioLogueado.correo || 
        'USUARIO'
      ).toUpperCase();
    } else {
      this.nombreUsuario = 'INVITADO';
    }

    // Tu código de las solicitudes se queda exactamente igual abajo...
    this.sub = this.solicitudService.solicitudes$.subscribe(solicitudes => {
      this.totalDisponibles = solicitudes.filter(s => s.estado === 'disponible').length;
      this.totalRecolectados = solicitudes.filter(s => s.estado === 'recolectada').length;
      this.kilosRecuperados = solicitudes.reduce((acc, current) => acc + current.cantidad, 0);
      this.solicitudesRecientes = solicitudes.slice(0, 4);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}