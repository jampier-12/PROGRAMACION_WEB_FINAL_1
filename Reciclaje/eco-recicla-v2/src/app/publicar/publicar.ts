import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitudService } from '../solicitud.service';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publicar.html',
  styleUrl: './publicar.css'
})
export class Publicar {
  private solicitudService = inject(SolicitudService);
  private router = inject(Router);

  formularioSolicitud = new FormGroup({
    direccion: new FormControl('', [Validators.required]),
    distrito: new FormControl('', [Validators.required]),
    plastico: new FormControl(false),
    carton: new FormControl(false),
    vidrio: new FormControl(false),
    metal: new FormControl(false),
    papel: new FormControl(false),
    electronicos: new FormControl(false),
    textiles: new FormControl(false),
    cantidad: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    notas: new FormControl('')
  });

  enviarSolicitud() {
    if (this.formularioSolicitud.invalid) {
      alert('Por favor, completa los campos requeridos (Dirección, Distrito y una Cantidad válida).');
      return;
    }

    // Recolectamos solo los materiales seleccionados en las casillas
    const valores = this.formularioSolicitud.value;
    const materialesSeleccionados: string[] = [];
    
    if (valores.plastico) materialesSeleccionados.push('Plástico');
    if (valores.carton) materialesSeleccionados.push('Cartón');
    if (valores.vidrio) materialesSeleccionados.push('Vidrio');
    if (valores.metal) materialesSeleccionados.push('Metal/Latas');
    if (valores.papel) materialesSeleccionados.push('Papel');
    if (valores.electronicos) materialesSeleccionados.push('Electrónicos');
    if (valores.textiles) materialesSeleccionados.push('Textiles');

    if (materialesSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un tipo de material disponible.');
      return;
    }

    // Enviamos al servicio global
    this.solicitudService.agregarSolicitud({
      direccion: valores.direccion || '',
      distrito: valores.distrito || '',
      materiales: materialesSeleccionados,
      cantidad: valores.cantidad || 0,
      notas: valores.notas || ''
    });

    alert('¡Tu solicitud ha sido publicada de manera exitosa!');
    this.formularioSolicitud.reset();
    
    // Redireccionamos automáticamente al Historial para ver el cambio
    this.router.navigate(['/historial']);
  }
}