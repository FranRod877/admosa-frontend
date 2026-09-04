import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginPage } from './auth/LoginPage'
import { AppShell } from './app/AppShell'
import './App.css'

function AppContent() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <AppShell /> : <LoginPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
