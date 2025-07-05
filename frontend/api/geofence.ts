// FRONTEND/api/geofence.ts
import axiosClient from './axiosClient';

export interface GeofencePayload {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  isActive: boolean;
}

export async function createGeofence(data: GeofencePayload) {
  try {
    const response = await axiosClient.post('/geofences', data);
    
    console.log('✅ Geofence creada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🛑 Error al crear geofence:', error.response?.data, error.response?.status);
    throw new Error(error.response?.data?.message || 'No se pudo crear la geofence');
  }
}
