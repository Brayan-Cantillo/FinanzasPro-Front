import axios from 'axios';

/**
 * Instancia centralizada de Axios configurada para comunicarse con el backend.
 * Todas las peticiones HTTP de la app usan esta instancia.
 * Base URL apunta al servidor local en el puerto 3000.
 */
const api = axios.create({
  baseURL: 'https://finanzaspro-ci2u.onrender.com', // URL base del servidor backend
});

/**
 * Interceptor de peticiones (request).
 * Antes de enviar cada petición, añade automáticamente el token JWT
 * en el header Authorization si existe uno guardado en localStorage.
 * Esto permite que todas las peticiones a rutas protegidas se autentiquen automáticamente.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Añade el token como Bearer en el header
  }
  return config;
});

/**
 * Interceptor de respuestas (response).
 * Si el servidor responde con un error 401 (no autorizado),
 * limpia la sesión del usuario y redirige a la página de login.
 * Esto maneja automáticamente la expiración del token.
 */
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la pasa sin cambios
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');  // Elimina el token expirado/inválido
      localStorage.removeItem('user');   // Elimina los datos del usuario
      window.location.href = '/';         // Redirige al login
    }
    return Promise.reject(error); // Propaga el error para que lo maneje el código que llamó
  }
);

export default api;
