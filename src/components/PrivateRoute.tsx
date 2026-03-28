import { Navigate } from 'react-router-dom';       // Componente para redirigir a otra ruta
import { useAuth } from '../context/AuthContext';   // Hook para acceder al estado de autenticación

/**
 * Componente que protege rutas privadas.
 * Si el usuario está autenticado, renderiza los componentes hijos.
 * Si no está autenticado, redirige automáticamente a la página de login ("/").
 * Mientras se verifica el estado de autenticación, muestra un spinner de carga.
 */
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth(); // Obtiene el estado de autenticación y carga

  // Mientras se verifica si hay un token guardado, muestra un spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Si está autenticado renderiza los hijos, si no redirige al login
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}
