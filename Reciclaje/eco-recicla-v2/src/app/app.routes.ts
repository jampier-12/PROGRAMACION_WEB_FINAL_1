import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Login } from './login/login';
import { Publicar } from './publicar/publicar';
import { Historial } from './historial/historial';
import { Perfil } from './perfil/perfil';
import { Registro } from './registro/registro';
import { Recuperar } from './recuperar/recuperar'; // <-- Importamos

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'publicar', component: Publicar },
  { path: 'historial', component: Historial },
  { path: 'perfil', component: Perfil },
  { path: 'registro', component: Registro },
  { path: 'recuperar', component: Recuperar } // <-- Añadimos la ruta
];