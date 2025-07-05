// FRONTEND/api/location.ts
import axiosClient from './axiosClient';

export interface DeviceInfo {
  model: string;
  os: string;
}

export interface LocationPayload {
  latitude: number;
  longitude: number;
  accuracy: number;
  deviceInfo: DeviceInfo;
}

export async function sendLocation(data: LocationPayload) {
  try {
    const response = await axiosClient.post('/locations', data);
    console.log('✅ Ubicación enviada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🛑 Error al enviar ubicación:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'No se pudo enviar la ubicación');
  }
}
