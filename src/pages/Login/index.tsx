import { Link } from 'react-router-dom'; // Componente para navegación entre páginas
import { useLogin } from './hooks';       // Hook personalizado que maneja la lógica del login

/**
 * Página de inicio de sesión.
 * Muestra un formulario con campos de email y contraseña.
 * Usa el hook useLogin para manejar el estado del formulario,
 * la validación y la comunicación con el servidor.
 */
export default function Login() {
  // Desestructura los valores y funciones del hook de login
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    // Contenedor de página completa con fondo degradado azul/indigo
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      {/* Tarjeta blanca centrada con el formulario de login */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Encabezado con logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">💰 Finanzas</h1>
          <p className="text-gray-500">Inicia sesión en tu cuenta</p>
        </div>

        {/* Alerta de error: se muestra si hay un error de validación o del servidor */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo de email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="tu@email.com"
            />
          </div>
          {/* Campo de contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          {/* Botón de envío: se deshabilita mientras se procesa la petición */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Enlace para ir a la página de registro si no tiene cuenta */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
