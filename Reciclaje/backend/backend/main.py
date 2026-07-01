from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from typing import Dict, Any

app = FastAPI(title="Backend Reciclaje con Supabase", redirect_slashes=False)

# ==========================================
# CONFIGURACIÓN DE CORS
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# CONFIGURACIÓN DE CONEXIÓN WEB A SUPABASE
# ==========================================
SUPABASE_URL = 'https://sremwrvwmqtoxgxympzj.supabase.co/rest/v1'

# 🔑 TU CLAVE DE SUPABASE
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZW13cnZ3bXF0b3hneHltcHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxODYzNzEsImV4cCI6MjA5Nzc2MjM3MX0.v4evLRVKPfCa1gUPkeaRtfaj5JtrY09sAm45TshUH_U' 

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

print("¡Conexión HTTP Nativa con Supabase lista!")

# ==========================================
# MODELOS DE DATOS
# ==========================================
class LoginSchema(BaseModel):
    correo: str
    contrasena: str

# ==========================================
# RUTA 1: REGISTRO DE USUARIOS
# ==========================================
@app.post('/api/auth/registrar', status_code=status.HTTP_201_CREATED) 
@app.post('/api/auth/registrar/', status_code=status.HTTP_201_CREATED) 
async def registro(usuario_data: Dict[Any, Any]):
    print('Procesando nuevo registro...')
    print('Datos recibidos desde Angular:', usuario_data)
    try:
        # Extraemos de forma segura los campos que Angular envía (soportando variaciones de nombres)
        nombre_ext = usuario_data.get('nombre') or usuario_data.get('nombre_completo') or usuario_data.get('username')
        correo_ext = usuario_data.get('correo') or usuario_data.get('email')
        pass_ext = usuario_data.get('contrasena') or usuario_data.get('password') or usuario_data.get('contraseña')
        rol_ext = usuario_data.get('rol') or 'user'  # Por defecto asignamos el rol 'user' si no viene

        # Construimos el payload exacto estructurado para las columnas de tu Supabase
        payload_supabase = {
            'nombre': str(nombre_ext).strip() if nombre_ext else '',
            'correo': str(correo_ext).strip().lower() if correo_ext else '',
            'contrasena': str(pass_ext).strip() if pass_ext else '',
            'rol': str(rol_ext).strip()
        }
        
        print('Enviando payload limpio a Supabase:', payload_supabase)

        async with httpx.AsyncClient() as client:
            response = await client.post(f"{SUPABASE_URL}/usuarios", headers=headers, json=payload_supabase)
            
            if response.status_code != 201:
                print(f"❌ Error devuelto por Supabase: {response.text}")
                raise HTTPException(status_code=400, detail=f"Error en Supabase: {response.text}")
            
            data = response.json()
            
            # Validamos que Supabase nos devuelva el registro insertado
            if not data or len(data) == 0:
                return {"mensaje": "Usuario registrado con éxito", "usuario": payload_supabase}
                
            return {"mensaje": "Usuario registrado exitosamente", "usuario": data[0]}
            
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print('Error crítico al registrar usuario:', str(e))
        raise HTTPException(status_code=500, detail="Error interno del servidor al registrar usuario")

# ==========================================
# RUTA 2: INICIO DE SESIÓN (LOGIN)
# ==========================================
@app.post('/api/auth/login')
@app.post('/api/auth/login/')
async def login(credentials: LoginSchema):
    print('Procesando login...') 
    try:
        # Limpiamos y aseguramos el formato del texto para evitar errores de codificación
        correo_limpio = str(credentials.correo).strip()
        pass_limpia = str(credentials.contrasena).strip()

        params = {
            'correo': f'eq.{correo_limpio}',
            'contrasena': f'eq.{pass_limpia}'
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SUPABASE_URL}/usuarios", headers=headers, params=params)
            
            if response.status_code != 200:
                print(f"Error de Supabase: {response.text}")
                raise HTTPException(status_code=400, detail="Error al consultar usuarios en Supabase")
            
            usuarios = response.json()
            
            if not usuarios or len(usuarios) == 0:
                raise HTTPException(status_code=401, detail="Credenciales invalidas.")
                
            return {
                "mensaje": "Login exitoso",
                "token": f"token-simulado-reciclaje-{usuarios[0].get('id', 'anon')}",
                "usuario": usuarios[0]
            }
            
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print('Error critico en el login:', str(e))
        raise HTTPException(status_code=500, detail="Error interno del servidor en el login")

# ==========================================
# RUTA 3: CREAR NUEVA SOLICITUD DE RECICLAJE
# ==========================================
@app.post('/api/solicitudes', status_code=status.HTTP_201_CREATED)
async def crear_solicitud(solicitud_data: Dict[Any, Any]):
    print('Recibiendo nueva solicitud de reciclaje:', solicitud_data)
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{SUPABASE_URL}/solicitudes", headers=headers, json=solicitud_data)
            
            if response.status_code != 201:
                raise HTTPException(status_code=400, detail=f"Error en Supabase: {response.text}")
            
            data = response.json()
            return {"mensaje": "Solicitud guardada con éxito", "solicitud": data[0]}
            
    except Exception as e:
        print('Error al guardar solicitud:', str(e))
        raise HTTPException(status_code=500, detail="Error interno del servidor al guardar la solicitud")

# ==========================================
# RUTA 4: OBTENER TODAS LAS SOLICITUDES
# ==========================================
@app.get('/api/solicitudes')
async def obtener_solicitudes():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{SUPABASE_URL}/solicitudes", headers=headers)
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Error al traer solicitudes de Supabase")
                
            return response.json()
            
    except Exception as e:
        print('Error al traer solicitudes:', str(e))
        raise HTTPException(status_code=500, detail="Error interno al obtener solicitudes")