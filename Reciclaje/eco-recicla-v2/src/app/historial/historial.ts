import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudService, Solicitud } from '../solicitud.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit, OnDestroy {
  private solicitudService = inject(SolicitudService);
  private sub?: Subscription;

  solicitudesCompletas: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  filtroActivo: string = 'todas';

  ngOnInit() {
    // Escuchamos activamente los cambios del servicio
    this.sub = this.solicitudService.solicitudes$.subscribe(datos => {
      this.solicitudesCompletas = datos;
      this.aplicarFiltro();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // 🛠️ FUNCIÓN AGREGADA: Maneja de forma segura si los materiales vienen como arreglo o texto plano
  formatearMateriales(materiales: any): string {
    if (!materiales) return '';
    return Array.isArray(materiales) ? materiales.join(', ') : materiales;
  }

  cambiarFiltro(nuevoFiltro: string) {
    this.filtroActivo = nuevoFiltro;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.filtroActivo === 'todas') {
      this.solicitudesFiltradas = this.solicitudesCompletas;
    } else if (this.filtroActivo === 'disponibles') {
      // Si la pestaña es 'disponibles' (plural), buscamos las de estado 'disponible' (singular)
      this.solicitudesFiltradas = this.solicitudesCompletas.filter(
        s => s.estado === 'disponible'
      );
    } else if (this.filtroActivo === 'asignadas') {
      this.solicitudesFiltradas = this.solicitudesCompletas.filter(
        s => s.estado === 'asignada'
      );
    } else if (this.filtroActivo === 'recolectadas') {
      this.solicitudesFiltradas = this.solicitudesCompletas.filter(
        s => s.estado === 'recolectada'
      );
    }
  }
}