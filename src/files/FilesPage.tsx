import { useEffect, useState, type ChangeEvent } from 'react'
import * as filesApi from '../api/filesApi'
import { FileActionsMenu } from './FileActionsMenu'
import type { ArchivoResponse } from '../types'

// Debe coincidir con FileService.EXTENSIONES_PERMITIDAS en el backend.
const EXTENSIONES_PERMITIDAS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv',
  'jpg', 'jpeg', 'png', 'gif', 'webp',
]
const TAMANIO_MAXIMO_MB = 25

function extensionDe(nombreArchivo: string): string {
  const puntoIndex = nombreArchivo.lastIndexOf('.')
  return puntoIndex === -1 ? '' : nombreArchivo.slice(puntoIndex + 1).toLowerCase()
}

function mensajeDeError(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

export function FilesPage() {
  const [files, setFiles] = useState<ArchivoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setFiles(await filesApi.listFiles())
    } catch {
      setError('No se pudieron cargar los archivos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)

    const extension = extensionDe(file.name)
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      setError(
        `Tipo de archivo no permitido (.${extension || '?'}). Formatos aceptados: ${EXTENSIONES_PERMITIDAS.join(', ')}.`,
      )
      return
    }
    if (file.size > TAMANIO_MAXIMO_MB * 1024 * 1024) {
      setError(`El archivo supera el tamaño máximo permitido (${TAMANIO_MAXIMO_MB}MB).`)
      return
    }

    setUploading(true)
    try {
      await filesApi.uploadFile(file)
      await load()
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo subir el archivo.'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este archivo? Esta acción no se puede deshacer.')) return
    setError(null)
    try {
      await filesApi.deleteFile(id)
      await load()
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo eliminar el archivo.'))
    }
  }

  const handleDownload = async (id: string, filename: string) => {
    setError(null)
    try {
      await filesApi.downloadFile(id, filename)
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo descargar el archivo.'))
    }
  }

  const handleView = async (id: string) => {
    setError(null)
    try {
      await filesApi.viewFile(id)
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo abrir la vista previa.'))
    }
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Archivos</h1>
          <p className="hint">
            Formatos permitidos: {EXTENSIONES_PERMITIDAS.join(', ')} · Máximo {TAMANIO_MAXIMO_MB}MB
          </p>
        </div>
        <label className="upload-button">
          {uploading ? 'Subiendo…' : 'Subir archivo'}
          <input type="file" onChange={handleUpload} disabled={uploading} hidden />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando…</p>
      ) : files.length === 0 ? (
        <p className="empty">No hay archivos para mostrar.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Propietario</th>
                <th>Área</th>
                <th>Fecha de carga</th>
                <th>Tamaño</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>{file.nombreOriginal}</td>
                  <td>{file.propietarioNombre}</td>
                  <td>{file.areaNombre ?? '—'}</td>
                  <td>{new Date(file.fechaCarga).toLocaleString()}</td>
                  <td>{formatSize(file.tamanio)}</td>
                  <td className="actions">
                    <FileActionsMenu
                      canDownload={file.puedeDescargar}
                      canDelete={file.puedeEliminar}
                      onView={() => handleView(file.id)}
                      onDownload={() => handleDownload(file.id, file.nombreOriginal)}
                      onDelete={() => handleDelete(file.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
