import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
  })
export class Registro {
  private router = inject(Router);
  private http = inject(HttpClient);

  public formularioRegistro: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasenia: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  public errorMensaje: string = '';

  registrarUsuario() {
    if (this.formularioRegistro.invalid) {
      alert('Por favor, rellena todos los campos correctamente.');
      return;
    }

    // Traducimos los datos a las llaves exactas que tu SQLite pide en req.body
    const datosRegistro = {
      nombre: this.formularioRegistro.value.nombre,
      correo: this.formularioRegistro.value.correo,
      contrasena: this.formularioRegistro.value.contrasenia, // <-- Cambiado aquí para el backend
      rol: 'ciudadano'
    };

    this.http.post('http://localhost:3000/api/auth/registrar', datosRegistro).subscribe({
      next: (res: any) => {
        alert('¡Usuario registrado con éxito en SQLite!');
        // Redireccionamos al login para estrenar la cuenta limpia
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert(`Error al registrar: ${err.error?.error || 'Servidor desconectado'}`);
      }
    });
  }
}