export type Rol = 'USUARIO_ESTANDAR' | 'JEFE_AREA' | 'GERENTE' | 'ADMINISTRADOR'

export type AccionHistorial = 'CARGA' | 'VISUALIZACION' | 'DESCARGA' | 'ELIMINACION'

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
  areaId: number | null
  areaNombre: string | null
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export interface ArchivoResponse {
  id: string
  nombreOriginal: string
  contentType: string | null
  tamanio: number
  propietarioId: number
  propietarioNombre: string
  areaNombre: string | null
  fechaCarga: string
  puedeDescargar: boolean
  puedeEliminar: boolean
}

export interface HistorialResponse {
  id: number
  usuarioId: number
  usuarioNombre: string
  archivoId: string | null
  archivoNombre: string | null
  accion: AccionHistorial
  fecha: string
}

export interface AreaResponse {
  id: number
  nombre: string
  gerenteId: number | null
  gerenteNombre: string | null
}

export interface UpdateUsuarioRequest {
  rol?: Rol
  areaId?: number
}
