import { useState, type FormEvent } from 'react';
import { authService } from '../../../services/authService';

/**
 * Hook personalizado que encapsula la lógica de restablecimiento de contraseña.
 * Permite al usuario cambiar su contraseña usando solo su email (sin autenticación).
 */
export const useResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authService.resetPassword({ email, newPassword });
      setSuccess('Contraseña restablecida correctamente. Ya puedes iniciar sesión.');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    error, success, loading,
    handleSubmit,
  };
};
