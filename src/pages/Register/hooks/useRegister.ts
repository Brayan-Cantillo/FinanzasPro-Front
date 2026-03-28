import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Acceso al contexto de autenticación

/**
 * Hook personalizado que encapsula toda la lógica de la página de registro.
 * Maneja el estado del formulario (nombre, email, contraseña), validaciones,
 * la llamada al servicio de registro y la navegación tras el registro exitoso.
 */
export const useRegister = () => {
  const [name, setName] = useState('');         // Estado del campo nombre
  const [email, setEmail] = useState('');       // Estado del campo email
  const [password, setPassword] = useState(''); // Estado del campo contraseña
  const [error, setError] = useState('');       // Mensaje de error a mostrar
  const [loading, setLoading] = useState(false); // Indica si la petición está en curso
  const { register } = useAuth();                // Función de registro del contexto de autenticación
  const navigate = useNavigate();                 // Función para navegar programáticamente

  /**
   * Manejador del envío del formulario de registro.
   * Valida que todos los campos estén llenos y que la contraseña tenga al menos 6 caracteres.
   * Si el registro es exitoso, redirige al dashboard.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Previene la recarga de la página

    // Validación: todos los campos son obligatorios
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    // Validación: la contraseña debe tener mínimo 6 caracteres
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setError('');       // Limpia errores previos
    setLoading(true);  // Activa el indicador de carga
    try {
      await register({ name, email, password }); // Envía datos al servidor para crear la cuenta
      navigate('/dashboard');                     // Redirige al dashboard tras registro exitoso
    } catch (err: any) {
      // Muestra el mensaje de error del servidor o un mensaje genérico
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  // Retorna todos los estados y funciones necesarios para la vista
  return { name, setName, email, setEmail, password, setPassword, error, loading, handleSubmit };
};
