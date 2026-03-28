import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Acceso al contexto de autenticación

/**
 * Hook personalizado que encapsula toda la lógica de la página de login.
 * Maneja el estado del formulario (email, contraseña), la validación,
 * la llamada al servicio de autenticación y la navegación tras el login exitoso.
 */
export const useLogin = () => {
  const [email, setEmail] = useState('');       // Estado del campo email
  const [password, setPassword] = useState(''); // Estado del campo contraseña
  const [error, setError] = useState('');       // Mensaje de error a mostrar
  const [loading, setLoading] = useState(false); // Indica si la petición está en curso
  const { login } = useAuth();                   // Función de login del contexto de autenticación
  const navigate = useNavigate();                 // Función para navegar programáticamente

  /**
   * Manejador del envío del formulario.
   * Valida que los campos no estén vacíos, llama al servicio de login
   * y redirige al dashboard si es exitoso. Si falla, muestra el error.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario

    // Validación: verificar que ambos campos estén llenos
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setError('');       // Limpia errores previos
    setLoading(true);  // Activa el indicador de carga
    try {
      await login({ email, password }); // Envía credenciales al servidor
      navigate('/dashboard');            // Redirige al dashboard tras login exitoso
    } catch (err: any) {
      // Muestra el mensaje de error del servidor o un mensaje genérico
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false); // Desactiva el indicador de carga sin importar el resultado
    }
  };

  // Retorna todos los estados y funciones necesarios para la vista
  return { email, setEmail, password, setPassword, error, loading, handleSubmit };
};
