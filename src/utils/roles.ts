import type { Rol } from '../types'

const LABELS: Record<Rol, string> = {
  USUARIO_ESTANDAR: 'Usuario estándar',
  JEFE_AREA: 'Jefe de área',
  GERENTE: 'Gerente',
  ADMINISTRADOR: 'Administrador',
}

export function roleLabel(rol: Rol | undefined): string {
  return rol ? LABELS[rol] : ''
}

export const ALL_ROLES: Rol[] = ['USUARIO_ESTANDAR', 'JEFE_AREA', 'GERENTE', 'ADMINISTRADOR']
