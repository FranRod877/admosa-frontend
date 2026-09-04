import { postJson } from './http'
import type { LoginResponse } from '../types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  return postJson<LoginResponse>('/auth/login', { email, password })
}
