import { useEffect, useState, type ChangeEvent } from 'react'
import * as filesApi from '../api/filesApi'
import { FileActionsMenu } from './FileActionsMenu'
import { FilterInput } from '../components/FilterInput'
import type { ArchivoResponse } from '../types'

// Debe coincidir con FileService.EXTENSIONES_PERMITIDAS en el backend.
const EXTENSIONES_PERMITIDAS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv',
  'jpg', 'jpeg', 'png', 'gif', 'webp',
]
const TAMANIO_MAXIMO_MB = 25

interface Filtros {
  nombre: string
  propietario: string
  area: string
  fecha: string
  tamanio: string
}

const FILTROS_VACIOS: Filtros = { nombre: '', propietario: '', area: '', fecha: '', tamanio: '' }

function extensionDe(nombreArchivo: string): string {
  const puntoIndex = nombreArchivo.lastIndexOf('.')
  return puntoIndex === -1 ? '' : nombreArchivo.slice(puntoIndex + 1).toLowerCase()
}

function mensajeDeError(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback
}

function coincide(valor: string, filtro: string): boolean {
  return valor.toLowerCase().includes(filtro.toLowerCase())
}

export function FilesPage() {
  const [files, setFiles] = useState<ArchivoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS)

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => setSuccess(null), 4000)
    return () => clearTimeout(timer)
  }, [success])

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

  const actualizarFiltro = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)
    setSuccess(null)

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
      setSuccess(`"${file.name}" se cargó con éxito.`)
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo subir el archivo.'))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm('¿Eliminar este archivo? Esta acción no se puede deshacer.')) return
    setError(null)
    setSuccess(null)
    try {
      await filesApi.deleteFile(id)
      await load()
      setSuccess(`"${nombre}" se eliminó con éxito.`)
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

  const archivosFiltrados = files.filter((file) => {
    const fecha = new Date(file.fechaCarga).toLocaleString()
    const tamanio = formatSize(file.tamanio)
    return (
      coincide(file.nombreOriginal, filtros.nombre) &&
      coincide(file.propietarioNombre, filtros.propietario) &&
      coincide(file.areaNombre ?? '', filtros.area) &&
      coincide(fecha, filtros.fecha) &&
      coincide(tamanio, filtros.tamanio)
    )
  })

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
      {success && <p className="success">{success}</p>}

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
              <tr className="filter-row">
                <th><FilterInput value={filtros.nombre} onChange={(v) => actualizarFiltro('nombre', v)} /></th>
                <th><FilterInput value={filtros.propietario} onChange={(v) => actualizarFiltro('propietario', v)} /></th>
                <th><FilterInput value={filtros.area} onChange={(v) => actualizarFiltro('area', v)} /></th>
                <th><FilterInput value={filtros.fecha} onChange={(v) => actualizarFiltro('fecha', v)} /></th>
                <th><FilterInput value={filtros.tamanio} onChange={(v) => actualizarFiltro('tamanio', v)} /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {archivosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">Sin resultados para el filtro aplicado.</td>
                </tr>
              ) : (
                archivosFiltrados.map((file) => (
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
                        onDelete={() => handleDelete(file.id, file.nombreOriginal)}
                      />
                    </td>
                  </tr>
                ))
              )}
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
