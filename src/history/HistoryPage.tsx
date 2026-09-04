import { useEffect, useState } from 'react'
import * as historyApi from '../api/historyApi'
import type { HistorialResponse } from '../types'

const ACCION_LABELS: Record<HistorialResponse['accion'], string> = {
  CARGA: 'Carga',
  VISUALIZACION: 'Visualización',
  DESCARGA: 'Descarga',
  ELIMINACION: 'Eliminación',
}

export function HistoryPage() {
  const [registros, setRegistros] = useState<HistorialResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    historyApi
      .listHistory()
      .then(setRegistros)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [])

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
            </thead>
            <tbody>
              {registros.map((registro) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
