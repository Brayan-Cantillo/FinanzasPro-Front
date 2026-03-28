// Propiedades opcionales del spinner de carga
interface LoadingSpinnerProps {
  message?: string; // Mensaje que se muestra debajo del spinner (por defecto: 'Cargando...')
}

/**
 * Componente reutilizable que muestra un spinner animado de carga.
 * Se usa mientras se esperan datos del servidor (ej: al cargar transacciones, métricas, etc.).
 */
export default function LoadingSpinner({ message = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12"> {/* Centrado vertical y horizontal */}
      {/* Círculo animado que gira (efecto de carga) */}
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4" />
      {/* Texto descriptivo debajo del spinner */}
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
