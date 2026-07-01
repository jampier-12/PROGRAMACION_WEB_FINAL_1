const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE CONEXIÓN WEB A SUPABASE
// ==========================================
const SUPABASE_URL = 'https://sremwrvwmqtoxgxympzj.supabase.co/rest/v1';

// 🔑 REEMPLAZA ESTA CADENA POR TU CLAVE REAL "anon public" DE SUPABASE
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY_AQUÍ'; 

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

console.log("¡Conexión HTTP Nativa con Supabase lista!");

// ==========================================
// RUTA 1: REGISTRO DE USUARIOS
// ==========================================
app.post('/api/registro', async (req, res) => {
  console.log('Recibiendo solicitud de registro:', req.body);
  try {
    const response = await fetch(`${SUPABASE_URL}/usuarios`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en Supabase: ${errorText}`);
    }
    
    const data = await response.json();
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: data[0] });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
});

// ==========================================
// RUTA 2: INICIO DE SESIÓN (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
  console.log('Recibiendo solicitud de login:', req.body);
  const { correo, contrasena } = req.body;

  try {
    const response = await fetch(`${SUPABASE_URL}/usuarios?correo=eq.${correo}&contrasena=eq.${contrasena}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) throw new Error('Error al consultar usuarios en Supabase');
    
    const usuarios = await response.json();

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    res.status(200).json({
      mensaje: 'Login exitoso',
      token: 'token-simulado-reciclaje-' + usuarios[0].id,
      usuario: usuarios[0]
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).json({ error: 'Error interno del servidor en el login' });
  }
});

// ==========================================
// RUTA 3: CREAR NUEVA SOLICITUD DE RECICLAJE
// ==========================================
app.post('/api/solicitudes', async (req, res) => {
  console.log('Recibiendo nueva solicitud de reciclaje:', req.body);
  try {
    const response = await fetch(`${SUPABASE_URL}/solicitudes`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en Supabase: ${errorText}`);
    }
    
    const data = await response.json();
    res.status(201).json({ mensaje: 'Solicitud guardada con éxito', solicitud: data[0] });
  } catch (error) {
    console.error('Error al guardar solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al guardar la solicitud' });
  }
});

// ==========================================
// RUTA 4: OBTENER TODAS LAS SOLICITUDES
// ==========================================
app.get('/api/solicitudes', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/solicitudes`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) throw new Error('Error al traer solicitudes de Supabase');
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al traer solicitudes:', error.message);
    res.status(500).json({ error: 'Error interno al obtener solicitudes' });
  }
});

// ==========================================
// INICIAR EL SERVIDOR LOCAL
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});