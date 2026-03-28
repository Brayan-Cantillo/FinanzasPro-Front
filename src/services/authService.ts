import api from './api'; // Instancia de Axios configurada con interceptores

// Estructura de datos requerida para iniciar sesión
export interface LoginPayload {
  email: string;     // Correo electrónico del usuario
  password: string;  // Contraseña del usuario
}

// Estructura de datos requerida para registrar un nuevo usuario
export interface RegisterPayload {
  name: string;      // Nombre completo del usuario
  email: string;     // Correo electrónico del usuario
  password: string;  // Contraseña del usuario
}

// Estructura de la respuesta del servidor tras login o registro exitoso
export interface AuthResponse {
  access_token: string; // Token JWT para autenticación en peticiones futuras
  user: { id: number; name: string; email: string }; // Datos básicos del usuario
}

/**
 * Servicio de autenticación.
 * Contiene las funciones para comunicarse con los endpoints de login y registro del backend.
 */
export const authService = {
  // Envía credenciales al servidor para iniciar sesión y recibe un token JWT
  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data),
  // Envía datos del nuevo usuario al servidor para crear la cuenta y recibe un token JWT
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data),
};
