# AdMosa Frontend

Frontend en React + TypeScript para la gestión segura de archivos.

## Tecnologías
- React
- TypeScript
- Vite
- Axios
- React Router
- CSS modular / simple

## Requisitos
- Node.js 18+
- npm

## Ejecutar localmente
```bash
npm install
npm run dev
```

## Ramas git
- `main` → versión estable
- `develop` → trabajo activo

## Integración con backend
- El frontend consumirá endpoints REST del backend Spring Boot.
- Se recomienda usar Axios con un `baseURL` apuntando al backend en `http://localhost:8080`.
- El login autenticará con JWT y se guardará en localStorage o memoria.

## Siguiente paso
- Crear estructura de módulos: auth, users, files, dashboard
- Implementar login y protección de rutas
- Consumir APIs de archivos por rol y área
- Crear UI para roles: usuario, jefe de área, gerente, administrador
