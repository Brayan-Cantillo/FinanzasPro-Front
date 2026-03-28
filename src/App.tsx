// Importaciones de React Router para definir las rutas de la aplicación
import { Routes, Route } from 'react-router-dom';
// Proveedor del contexto de autenticación que envuelve toda la app
import { AuthProvider } from './context/AuthContext';
// Componente que protege rutas: redirige al login si no está autenticado
import PrivateRoute from './components/PrivateRoute';
// Layout principal con barra de navegación y contenedor de contenido
import Layout from './components/Layout';
// Páginas de la aplicación
import Login from './pages/Login';                   // Página de inicio de sesión
import Register from './pages/Register';             // Página de registro de usuario
import Dashboard from './pages/Dashboard';           // Panel principal con métricas financieras
import Transactions from './pages/Transactions';     // Gestión de transacciones (ingresos/gastos)
import CreditSimulator from './pages/CreditSimulator'; // Simulador de créditos
import Profile from './pages/Profile';               // Perfil del usuario

/**
 * Componente raíz de la aplicación.
 * Define la estructura de rutas y envuelve todo con el proveedor de autenticación.
 */
function App() {
  return (
    // AuthProvider hace disponible el estado de autenticación en toda la app
    <AuthProvider>
      <Routes>
        {/* Rutas públicas: accesibles sin autenticación */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas: requieren autenticación para acceder */}
        {/* PrivateRoute verifica si el usuario está logueado */}
        {/* Layout añade la barra de navegación y el contenedor principal */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />           {/* Panel de métricas */}
          <Route path="/transactions" element={<Transactions />} />     {/* Transacciones */}
          <Route path="/credit" element={<CreditSimulator />} />        {/* Simulador de crédito */}
          <Route path="/profile" element={<Profile />} />               {/* Perfil del usuario */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App
