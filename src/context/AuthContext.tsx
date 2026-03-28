// Importaciones de React necesarias para crear el contexto de autenticación
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// Servicio de autenticación y tipos para login/registro
import { authService, type LoginPayload, type RegisterPayload } from '../services/authService';

// Interfaz que define la estructura del objeto usuario
interface User {
  id: number;
  name: string;
  email: string;
  salary?: number; // Salario mensual (opcional, se puede configurar en el perfil)
}

// Interfaz que define todas las propiedades y métodos disponibles en el contexto de autenticación
interface AuthContextType {
  user: User | null;           // Datos del usuario actual (null si no está logueado)
  token: string | null;        // Token JWT de autenticación
  isAuthenticated: boolean;    // Indica si el usuario está logueado
  loading: boolean;            // Indica si se está verificando la sesión guardada
  login: (data: LoginPayload) => Promise<void>;      // Función para iniciar sesión
  register: (data: RegisterPayload) => Promise<void>; // Función para registrarse
  logout: () => void;                                  // Función para cerrar sesión
  updateUser: (data: Partial<User>) => void;           // Función para actualizar datos del usuario
}

// Crea el contexto de autenticación con valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación.
 * Envuelve toda la aplicación y proporciona el estado de autenticación
 * (usuario, token, funciones de login/registro/logout) a todos los componentes hijos.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);     // Estado del usuario actual
  const [token, setToken] = useState<string | null>(null);  // Estado del token JWT
  const [loading, setLoading] = useState(true);              // Estado de carga inicial

  // Al montar el componente, intenta restaurar la sesión desde localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');   // Busca el token guardado
    const savedUser = localStorage.getItem('user');     // Busca los datos del usuario guardados
    if (savedToken && savedUser) {
      setToken(savedToken);                              // Restaura el token en el estado
      setUser(JSON.parse(savedUser));                    // Restaura el usuario en el estado
    }
    setLoading(false); // Indica que ya se verificó si hay sesión guardada
  }, []);

  // Función de inicio de sesión: envía credenciales al servidor y guarda la sesión
  const login = async (data: LoginPayload) => {
    const res = await authService.login(data);                    // Llama al endpoint de login
    const { access_token, user: userData } = res.data;            // Extrae token y datos del usuario
    localStorage.setItem('token', access_token);                  // Guarda el token en localStorage
    localStorage.setItem('user', JSON.stringify(userData));       // Guarda el usuario en localStorage
    setToken(access_token);                                        // Actualiza el estado del token
    setUser(userData);                                             // Actualiza el estado del usuario
  };

  // Función de registro: crea una nueva cuenta y guarda la sesión automáticamente
  const register = async (data: RegisterPayload) => {
    const res = await authService.register(data);                 // Llama al endpoint de registro
    const { access_token, user: userData } = res.data;            // Extrae token y datos del usuario
    localStorage.setItem('token', access_token);                  // Guarda el token en localStorage
    localStorage.setItem('user', JSON.stringify(userData));       // Guarda el usuario en localStorage
    setToken(access_token);                                        // Actualiza el estado del token
    setUser(userData);                                             // Actualiza el estado del usuario
  };

  // Función de cierre de sesión: limpia el token y los datos del usuario
  const logout = () => {
    localStorage.removeItem('token');  // Elimina el token de localStorage
    localStorage.removeItem('user');   // Elimina los datos del usuario de localStorage
    setToken(null);                     // Limpia el estado del token
    setUser(null);                      // Limpia el estado del usuario
  };

  // Función para actualizar parcialmente los datos del usuario (ej: nombre, salario)
  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;                                     // Si no hay usuario, no hace nada
      const updated = { ...prev, ...data };                       // Mezcla los datos anteriores con los nuevos
      localStorage.setItem('user', JSON.stringify(updated));     // Actualiza localStorage
      return updated;                                              // Retorna el usuario actualizado
    });
  };

  // Provee el contexto con todos los valores y funciones a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Debe usarse dentro de un componente envuelto por AuthProvider.
 * Retorna: user, token, isAuthenticated, loading, login, register, logout, updateUser
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
