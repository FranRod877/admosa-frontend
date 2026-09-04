export const TOKEN_KEY = 'admosa_token'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

interface RequestOptions {
  method?: string
  body?: BodyInit
  headers?: Record<string, string>
}

async function request(path: string, options: RequestOptions = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers: Record<string, string> = { ...options.headers }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${baseURL}${path}`, { ...options, headers })

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY)
    unauthorizedHandler?.()
  }
  if (!response.ok) {
    throw new Error(`Error ${response.status} en ${path}`)
  }
  return response
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await request(path)
  return response.json() as Promise<T>
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json() as Promise<T>
}

export async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const response = await request(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json() as Promise<T>
}

export async function postFormData<T>(path: string, formData: FormData): Promise<T> {
  const response = await request(path, { method: 'POST', body: formData })
  return response.json() as Promise<T>
}

export async function del(path: string): Promise<void> {
  await request(path, { method: 'DELETE' })
}

export async function getBlob(path: string): Promise<Blob> {
  const response = await request(path)
  return response.blob()
}
