import { Outlet } from 'react-router-dom'; // Outlet renderiza la ruta hija activa
import Navbar from './Navbar';               // Barra de navegación superior

/**
 * Componente de layout principal para las páginas protegidas.
 * Incluye la barra de navegación (Navbar) en la parte superior
 * y un contenedor central donde se renderiza la página activa mediante <Outlet />.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Fondo gris claro, altura mínima de pantalla completa */}
      <Navbar /> {/* Barra de navegación con links a las secciones y botón de logout */}
      {/* Contenedor principal del contenido con ancho máximo y padding responsivo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> {/* Aquí se renderiza el componente de la ruta hija activa */}
      </main>
    </div>
  );
}
