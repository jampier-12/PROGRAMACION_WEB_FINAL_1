import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Solicitud {
  id: string;
  direccion: string;
  distrito: string;
  materiales: string | string[]; // Soporta ambos formatos
  cantidad: number;
  notas?: string;
  fecha: string;
  estado: 'disponible' | 'asignada' | 'recolectada';
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/solicitudes';
  
  private solicitudesSubject = new BehaviorSubject<Solicitud[]>([]);
  solicitudes$ = this.solicitudesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarSolicitudes();
  }

  // Trae las solicitudes reales guardadas en Supabase
  cargarSolicitudes() {
    this.http.get<Solicitud[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Formatea los materiales si vienen como string desde la base de datos
        const formateadas = data.map(sol => ({
          ...sol,
          materiales: typeof sol.materiales === 'string' ? sol.materiales.split(', ') : sol.materiales
        }));
        this.solicitudesSubject.next(formateadas);
      },
      error: (err) => {
        console.error('Error al traer datos de Supabase:', err);
      }
    });
  }

  // Envía la nueva solicitud a Node para que la suba a Supabase
  agregarSolicitud(nueva: Omit<Solicitud, 'id' | 'fecha' | 'estado'>) {
    // Convertimos el array de materiales a un texto separado por comas para SQL
    const materialesTexto = Array.isArray(nueva.materiales) 
      ? nueva.materiales.join(', ') 
      : nueva.materiales;

    const solicitudCompleta = {
      ...nueva,
      materiales: materialesTexto,
      id: 'REC-' + Math.floor(1000 + Math.random() * 9000),
      fecha: new Date().toISOString().split('T')[0],
      estado: 'disponible'
    };

    this.http.post(this.apiUrl, solicitudCompleta).subscribe({
      next: (respuesta) => {
        console.log('¡Guardado exitosamente en Supabase a través del backend!', respuesta);
        this.cargarSolicitudes(); // Recarga la lista para ver la nueva solicitud reflejada
      },
      error: (err) => {
        console.error('Error al guardar la solicitud en Supabase:', err);
      }
    });
  }

  obtenerSolicitudes() {
    return this.solicitudesSubject.value;
  }
}