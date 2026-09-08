import { useEffect, useState } from 'react'
import * as historyApi from '../api/historyApi'
import { FilterInput } from '../components/FilterInput'
import type { HistorialResponse } from '../types'

const ACCION_LABELS: Record<HistorialResponse['accion'], string> = {
  CARGA: 'Carga',
  VISUALIZACION: 'Visualización',
  DESCARGA: 'Descarga',
  ELIMINACION: 'Eliminación',
}

interface Filtros {
  fecha: string
  usuario: string
  accion: string
  archivo: string
}

const FILTROS_VACIOS: Filtros = { fecha: '', usuario: '', accion: '', archivo: '' }

function coincide(valor: string, filtro: string): boolean {
  return valor.toLowerCase().includes(filtro.toLowerCase())
}

export function HistoryPage() {
  const [registros, setRegistros] = useState<HistorialResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS)

  useEffect(() => {
    historyApi
      .listHistory()
      .then(setRegistros)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [])

  const actualizarFiltro = (campo: keyof Filtros, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const registrosFiltrados = registros.filter((registro) => {
    const fecha = new Date(registro.fecha).toLocaleString()
    return (
      coincide(fecha, filtros.fecha) &&
      coincide(registro.usuarioNombre, filtros.usuario) &&
      coincide(ACCION_LABELS[registro.accion], filtros.accion) &&
      coincide(registro.archivoNombre ?? '', filtros.archivo)
    )
  })

  return (
    <section>
      <div className="section-header">
        <h1>Historial de acciones</h1>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando…</p>
      ) : registros.length === 0 ? (
        <p className="empty">No hay acciones registradas todavía.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Archivo</th>
              </tr>
              <tr className="filter-row">
                <th><FilterInput value={filtros.fecha} onChange={(v) => actualizarFiltro('fecha', v)} /></th>
                <th><FilterInput value={filtros.usuario} onChange={(v) => actualizarFiltro('usuario', v)} /></th>
                <th><FilterInput value={filtros.accion} onChange={(v) => actualizarFiltro('accion', v)} /></th>
                <th><FilterInput value={filtros.archivo} onChange={(v) => actualizarFiltro('archivo', v)} /></th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty">Sin resultados para el filtro aplicado.</td>
                </tr>
              ) : (
                registrosFiltrados.map((registro) => (
                  <tr key={registro.id}>
                    <td>{new Date(registro.fecha).toLocaleString()}</td>
                    <td>{registro.usuarioNombre}</td>
                    <td>
                      <span className={`badge badge-${registro.accion.toLowerCase()}`}>
                        {ACCION_LABELS[registro.accion]}
                      </span>
                    </td>
                    <td>{registro.archivoNombre ?? '—'}</td>
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
