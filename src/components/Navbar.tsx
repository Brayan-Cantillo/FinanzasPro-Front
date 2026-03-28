import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Hook para acceder al estado de autenticación

// Definición de los ítems del menú de navegación con su ruta y etiqueta visible
const navItems = [
  { path: '/dashboard', label: 'Dashboard' },       // Panel de métricas
  { path: '/transactions', label: 'Transacciones' }, // Gestión de transacciones
  { path: '/credit', label: 'Crédito' },              // Simulador de crédito
  { path: '/profile', label: 'Perfil' },             // Perfil del usuario
];

/**
 * Barra de navegación superior de la aplicación.
 * Muestra el logo, los enlaces de navegación, el nombre del usuario,
 * su salario (si lo tiene registrado) y el botón para cerrar sesión.
 */
export default function Navbar() {
  const { logout, user } = useAuth();   // Obtiene la función de logout y datos del usuario
  const location = useLocation();        // Obtiene la ruta actual para resaltar el enlace activo
  const navigate = useNavigate();        // Función para navegar programáticamente

  // Cierra la sesión del usuario y redirige a la página de login
  const handleLogout = () => {
    logout();       // Limpia el token y los datos del usuario del estado y localStorage
    navigate('/');  // Redirige a la página de inicio de sesión
  };

  return (
    // Barra de navegación con fondo blanco y sombra sutil
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Sección izquierda: Logo y enlaces de navegación */}
          <div className="flex items-center gap-8">
            {/* Logo de la aplicación que enlaza al dashboard */}
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
              💰 Finanzas
            </Link>
            {/* Menú de navegación (oculto en móvil, visible en desktop) */}
            <div className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    // Resalta el enlace activo con fondo indigo
                    location.pathname === item.path
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Sección derecha: información del usuario y botón de logout */}
          <div className="flex items-center gap-4">
            {/* Saludo con el nombre del usuario (oculto en móvil) */}
            <span className="text-sm text-gray-500 hidden sm:block">
              Hola, {user?.name}
            </span>
            {/* Muestra el salario formateado si el usuario lo tiene registrado */}
            {(user?.salary ?? 0) > 0 && (
              <span className="text-sm font-semibold text-green-600 hidden sm:block">
                Salario: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(user!.salary!)}
              </span>
            )}
            {/* Botón para cerrar sesión */}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
