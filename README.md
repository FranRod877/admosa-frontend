# AdMosa Frontend

Frontend en React + TypeScript para la gestión segura de archivos.

## Tecnologías
- React
- TypeScript
- Vite

## Requisitos
- Node.js 18+
- npm

## Ejecutar localmente
```bash
npm install
cp .env.example .env   # ajustar VITE_API_URL si el backend no corre en localhost:8080
npm run dev
```

## Ramas git
- `main` → versión estable
- `develop` → trabajo activo

## Integración con backend
- Consume la API REST del backend Spring Boot (`admosa-backend`) en `http://localhost:8080/api` por defecto.
- `src/api/http.ts` envuelve `fetch`, agrega el JWT como `Authorization: Bearer` y cierra la sesión ante un 401.
- El login guarda el JWT y los datos del usuario en `localStorage` (`src/auth/AuthContext.tsx`).

## Estructura
- `src/api` — cliente HTTP y llamadas a cada recurso (auth, files, history, users).
- `src/auth` — contexto de autenticación y login.
- `src/app` — layout con navegación condicionada por rol (cambia de vista sin recargar la página).
- `src/files`, `src/history`, `src/admin` — páginas de archivos, historial y administración de usuarios.

## Usuarios de prueba
Mismas credenciales sembradas por el backend (ver su README): `admin@admosa.com`, `gerente@admosa.com`, `jefe@admosa.com`, `usuario@admosa.com`, `usuario2@admosa.com`, contraseña `Password123!` para todos.
