// FRONTEND/api/auth.ts
import axiosClient from './axiosClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
  };
}

// 🔐 Login
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('🛑 Backend error:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || 'Credenciales incorrectas');
    } else if (error.request) {
      console.error('🛑 No response from server:', error.request);
      throw new Error('No se pudo conectar con el servidor');
    } else {
      console.error('🛑 Error interno:', error.message);
      throw new Error('Error interno al iniciar sesión');
    }
  }
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
}

// 📝 Registro
export async function registerUser(data: RegisterRequest) {
  try {
    const reqdata = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.telephone,
    };

    const response = await axiosClient.post('/auth/register', reqdata);
    console.log('✅ Usuario registrado:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('🛑 Error del backend:', error.response.status, error.response.data);
      throw new Error(error.response.data.message || 'Error en el registro');
    } else {
      console.error('🛑 Error de red:', error.message);
      throw new Error('No se pudo conectar con el servidor');
    }
  }
}
