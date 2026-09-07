import { del, getBlob, getJson, postFormData } from './http'
import type { ArchivoResponse } from '../types'

export async function listFiles(): Promise<ArchivoResponse[]> {
  return getJson<ArchivoResponse[]>('/files')
}

export async function uploadFile(file: File): Promise<ArchivoResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return postFormData<ArchivoResponse>('/files', formData)
}

export async function deleteFile(id: string): Promise<void> {
  await del(`/files/${id}`)
}

export async function downloadFile(id: string, filename: string): Promise<void> {
  const blob = await getBlob(`/files/${id}/download`)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function viewFile(id: string): Promise<void> {
  // Se abre la pestaña ANTES del fetch: si se abre después de un await, el
  // navegador ya no lo considera un gesto directo del usuario y bloquea el popup.
  const newTab = window.open('', '_blank')
  try {
    const blob = await getBlob(`/files/${id}/view`)
    const url = URL.createObjectURL(blob)
    if (newTab) {
      newTab.location.href = url
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (err) {
    newTab?.close()
    throw err
  }
}
