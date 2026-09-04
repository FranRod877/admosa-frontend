import { getJson } from './http'
import type { HistorialResponse } from '../types'

export async function listHistory(): Promise<HistorialResponse[]> {
  return getJson<HistorialResponse[]>('/history')
}
