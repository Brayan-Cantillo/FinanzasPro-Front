// Importa la función para definir la configuración de Vite (bundler de desarrollo)
import { defineConfig } from 'vite'
// Plugin oficial de React para Vite, incluye soporte para JSX y Fast Refresh
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// Plugin de Babel para transformar código con presets adicionales
import babel from '@rolldown/plugin-babel'
// Plugin de Tailwind CSS para integrar estilos utilitarios directamente en Vite
import tailwindcss from '@tailwindcss/vite'

// Configuración principal de Vite para el proyecto
export default defineConfig({
  plugins: [
    tailwindcss(),   // Habilita el procesamiento de clases de Tailwind CSS
    react(),         // Habilita soporte de React (JSX, Fast Refresh en desarrollo)
    babel({ presets: [reactCompilerPreset()] }) // Usa el preset del compilador de React para optimizaciones
  ],
})
