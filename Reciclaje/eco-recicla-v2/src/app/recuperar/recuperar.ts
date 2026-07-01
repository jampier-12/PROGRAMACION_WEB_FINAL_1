import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class Recuperar {
  private router = inject(Router);

  formularioRecuperar = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email])
  });

  enviarInstrucciones() {
    if (this.formularioRecuperar.valid) {
      const correo = this.formularioRecuperar.value.correo;
      alert(`Se han enviado las instrucciones de restauración al correo: ${correo}`);
      
      // Regresamos al usuario al Login
      this.router.navigate(['/login']);
    } else {
      this.formularioRecuperar.markAllAsTouched();
      alert('Por favor, ingresa un correo electrónico válido.');
    }
  }
}