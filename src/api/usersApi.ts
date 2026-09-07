import { getJson, patchJson } from './http'
import type { AreaResponse, UpdateUsuarioRequest, Usuario } from '../types'

export async function listUsers(): Promise<Usuario[]> {
  return getJson<Usuario[]>('/users')
}

export async function updateUser(id: number, request: UpdateUsuarioRequest): Promise<Usuario> {
  return patchJson<Usuario>(`/users/${id}`, request)
}

export async function listAreas(): Promise<AreaResponse[]> {
  return getJson<AreaResponse[]>('/areas')
}

export async function updateAreaGerente(areaId: number, gerenteId: number | null): Promise<AreaResponse> {
  return patchJson<AreaResponse>(`/areas/${areaId}`, { gerenteId })
}
