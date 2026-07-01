import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- 1. IMPORTAMOS EL CLIENTE HTTP
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes, 
      withInMemoryScrolling({
        anchorScrolling: 'enabled', // Esto activa los enlaces hacia abajo
        scrollPositionRestoration: 'enabled' // Esto hace que al cambiar de página empiece desde arriba
      })
    ),
    provideHttpClient() // <-- 2. ACTIVAMOS EL CLIENTE HTTP PARA CONECTAR EL BACKEND
  ]
};