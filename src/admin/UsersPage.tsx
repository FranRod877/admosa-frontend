import { useEffect, useState } from 'react'
import * as usersApi from '../api/usersApi'
import type { AreaResponse, Rol, Usuario } from '../types'
import { ALL_ROLES, roleLabel } from '../utils/roles'

export function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [areas, setAreas] = useState<AreaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [usuariosData, areasData] = await Promise.all([usersApi.listUsers(), usersApi.listAreas()])
      setUsuarios(usuariosData)
      setAreas(areasData)
    } catch {
      setError('No se pudo cargar la lista de usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRolChange = async (usuario: Usuario, rol: Rol) => {
    setSavingId(usuario.id)
    setError(null)
    try {
      const actualizado = await usersApi.updateUser(usuario.id, { rol })
      setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? actualizado : u)))
    } catch {
      setError('No se pudo actualizar el rol.')
    } finally {
      setSavingId(null)
    }
  }

  const handleAreaChange = async (usuario: Usuario, areaId: string) => {
    if (!areaId) return
    setSavingId(usuario.id)
    setError(null)
    try {
      const actualizado = await usersApi.updateUser(usuario.id, { areaId: Number(areaId) })
      setUsuarios((prev) => prev.map((u) => (u.id === usuario.id ? actualizado : u)))
    } catch {
      setError('No se pudo actualizar el área.')
    } finally {
      setSavingId(null)
    }
  }

  const handleGerenteAreaToggle = async (area: AreaResponse, usuario: Usuario, checked: boolean) => {
    setSavingId(usuario.id)
    setError(null)
    try {
      const actualizada = await usersApi.updateAreaGerente(area.id, checked ? usuario.id : null)
      setAreas((prev) => prev.map((a) => (a.id === area.id ? actualizada : a)))
    } catch {
      setError('No se pudo actualizar el área gestionada.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section>
      <div className="section-header">
        <h1>Usuarios</h1>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Área</th>
                <th>Áreas que gestiona</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <select
                      value={usuario.rol}
                      disabled={savingId === usuario.id}
                      onChange={(e) => handleRolChange(usuario, e.target.value as Rol)}
                    >
                      {ALL_ROLES.map((rol) => (
                        <option key={rol} value={rol}>
                          {roleLabel(rol)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={usuario.areaId ?? ''}
                      disabled={savingId === usuario.id}
                      onChange={(e) => handleAreaChange(usuario, e.target.value)}
                    >
                      <option value="">Sin área</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {usuario.rol === 'GERENTE' ? (
                      areas.map((area) => (
                        <label key={area.id} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={area.gerenteId === usuario.id}
                            disabled={savingId === usuario.id}
                            onChange={(e) => handleGerenteAreaToggle(area, usuario, e.target.checked)}
                          />
                          {area.nombre}
                        </label>
                      ))
                    ) : (
                      <span className="empty">—</span>
                    )}
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
