import api from './api'; // Instancia de Axios configurada

// Estructura del perfil completo del usuario
export interface UserProfile {
  id: number;      // Identificador único del usuario
  name: string;    // Nombre del usuario
  email: string;   // Correo electrónico
  salary: number;  // Salario mensual registrado
}

// Datos que se pueden actualizar en el perfil (nombre y salario)
export interface UpdateProfilePayload {
  name?: string;    // Nuevo nombre (opcional)
  salary?: number;  // Nuevo salario (opcional)
}

/**
 * Servicio de usuario.
 * Proporciona funciones para obtener y actualizar el perfil del usuario.
 */
export const userService = {
  // Obtiene el perfil completo del usuario autenticado
  getProfile: () => api.get<UserProfile>('/users/profile'),
  // Actualiza el perfil del usuario (nombre y/o salario)
  updateProfile: (data: UpdateProfilePayload) => api.patch<UserProfile>('/users/profile', data),
};
