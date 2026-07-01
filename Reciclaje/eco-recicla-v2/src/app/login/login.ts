import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Formulario enlazado a tu login.html
  public formularioLogin: FormGroup = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasenia: new FormControl('', [Validators.required])
  });

  public errorMensaje: string = '';

  ingresar() {
    if (this.formularioLogin.invalid) {
      this.errorMensaje = 'Por favor, rellena los campos correctamente.';
      return;
    }

    // Mapeamos las llaves exactas que espera tu backend (correo y contrasena)
    const datosLogin = {
      correo: this.formularioLogin.value.correo,
      contrasena: this.formularioLogin.value.contrasenia // <-- Cambiado de contrasenia a contrasena para SQLite
    };

    // Petición al endpoint de tu backend
    this.http.post('http://localhost:3000/api/auth/login', datosLogin).subscribe({
      next: (response: any) => {
        alert('¡Inicio de sesión correcto!');
        
        // ¡Importante! Tu backend responde con { mensaje, usuario: {...} }
        // Guardamos 'response.usuario' que contiene el nombre real extraído de SQLite
        this.authService.login(response.usuario);
        
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        if (err.status === 401) {
          alert('Error 401: El correo o la contraseña no coinciden en la base de datos.');
        } else {
          alert(`Error de conexión con el servidor (Status ${err.status})`);
        }
        this.errorMensaje = 'Correo o contraseña incorrectos.';
      }
    });
  }
}