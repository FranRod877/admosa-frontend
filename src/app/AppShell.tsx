import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { roleLabel } from '../utils/roles'
import { FilesPage } from '../files/FilesPage'
import { HistoryPage } from '../history/HistoryPage'
import { UsersPage } from '../admin/UsersPage'

type View = 'files' | 'history' | 'admin'

export function AppShell() {
  const { usuario, logout } = useAuth()
  const [view, setView] = useState<View>('files')
  const isAdmin = usuario?.rol === 'ADMINISTRADOR'
  const canSeeHistory = usuario?.rol === 'GERENTE' || usuario?.rol === 'ADMINISTRADOR'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">AdMosa</div>
        <nav>
          <button className={view === 'files' ? 'active' : ''} onClick={() => setView('files')}>
            Archivos
          </button>
          {canSeeHistory && (
            <button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>
              Historial
            </button>
          )}
          {isAdmin && (
            <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>
              Usuarios
            </button>
          )}
        </nav>
        <div className="user-info">
          <span>
            {usuario?.nombre} <em>· {roleLabel(usuario?.rol)}</em>
          </span>
          <button className="link-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-content">
        {view === 'files' && <FilesPage />}
        {view === 'history' && canSeeHistory && <HistoryPage />}
        {view === 'admin' && isAdmin && <UsersPage />}
      </main>
    </div>
  )
}
