// Punto de entrada principal de la aplicación React
import { StrictMode } from 'react'           // Modo estricto de React para detectar problemas potenciales
import { createRoot } from 'react-dom/client' // API moderna de React 18 para renderizar en el DOM
import { BrowserRouter } from 'react-router-dom' // Proveedor de enrutamiento basado en el historial del navegador
import './index.css'  // Estilos globales de la aplicación (incluye Tailwind CSS)
import App from './App.tsx' // Componente raíz de la aplicación

// Crea la raíz de React en el elemento #root del HTML y renderiza la aplicación
createRoot(document.getElementById('root')!).render(
  <StrictMode>       {/* Activa verificaciones adicionales en desarrollo */}
    <BrowserRouter>  {/* Habilita la navegación por rutas en toda la app */}
      <App />        {/* Componente principal que contiene todas las rutas y páginas */}
    </BrowserRouter>
  </StrictMode>,
)
