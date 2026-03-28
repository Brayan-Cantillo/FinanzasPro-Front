// Interfaz que define las propiedades que recibe el componente de alerta de error
interface ErrorAlertProps {
  message: string;      // Mensaje de error a mostrar
  onRetry?: () => void; // Función opcional para reintentar la operación fallida
}

/**
 * Componente reutilizable que muestra una alerta de error con estilo rojo.
 * Opcionalmente incluye un botón "Reintentar" si se proporciona la función onRetry.
 */
export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    // Contenedor de la alerta con fondo rojo claro y borde rojo
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      {/* Texto del mensaje de error */}
      <p className="text-red-700 text-sm">{message}</p>
      {/* Botón de reintento: solo se muestra si se pasa la función onRetry */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-red-600 hover:text-red-800 font-medium underline cursor-pointer"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
