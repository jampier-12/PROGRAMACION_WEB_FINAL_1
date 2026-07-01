import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL que conecta directo con tu servidor Node.js
  private apiUrl = 'http://localhost:3000/api';

  private conectadoSubject = new BehaviorSubject<boolean>(false);
  conectado$ = this.conectadoSubject.asObservable();
  private usuarioActual: any = null;

  constructor(private http: HttpClient) {
    // Si el usuario refresca la página, mantiene la sesión activa si existía un token
    if (localStorage.getItem('token')) {
      this.conectadoSubject.next(true);
      const user = localStorage.getItem('usuario');
      if (user) this.usuarioActual = JSON.parse(user);
    }
  }

  // 1. REGISTRO REAL (Envía los datos a Node.js -> Supabase)
  registrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  // 2. LOGIN REAL (Verifica las credenciales en el backend)
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((respuesta: any) => {
        if (respuesta && respuesta.token) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
          this.usuarioActual = respuesta.usuario;
          this.conectadoSubject.next(true);
        }
      })
    );
  }

  // 3. CERRAR SESIÓN (Limpia la memoria y el almacenamiento)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual = null;
    this.conectadoSubject.next(false);
  }

  estaLogueado(): boolean {
    return this.conectadoSubject.value;
  }

  getUsuario(): any {
    return this.usuarioActual;
  }
}