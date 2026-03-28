import { Link } from 'react-router-dom'; // Componente para navegación entre páginas
import { useRegister } from './hooks';    // Hook personalizado que maneja la lógica del registro

/**
 * Página de registro de nuevo usuario.
 * Muestra un formulario con campos de nombre, email y contraseña.
 * Al registrarse exitosamente, el usuario queda automáticamente logueado y es redirigido al dashboard.
 */
export default function Register() {
  // Desestructura los valores y funciones del hook de registro
  const { name, setName, email, setEmail, password, setPassword, error, loading, handleSubmit } = useRegister();

  return (
    // Contenedor de página completa con fondo degradado azul/indigo
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      {/* Tarjeta blanca centrada con el formulario de registro */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Encabezado con logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">💰 Finanzas</h1>
          <p className="text-gray-500">Crea tu cuenta</p>
        </div>

        {/* Alerta de error: se muestra si hay un error de validación o del servidor */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo de nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Tu nombre"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {/* Botón de envío: se deshabilita mientras se procesa la petición */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Enlace para ir a la página de login si ya tiene cuenta */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
