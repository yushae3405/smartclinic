import axios from 'axios';
import type { Doctor, Service, Appointment } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export async function getDoctors(search?: string, specialty?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (specialty) params.append('specialty', specialty);
  
  const response = await api.get<Doctor[]>(`/doctors?${params.toString()}`);
  return response.data;
}

export async function getServices() {
  const response = await api.get<Service[]>('/services');
  return response.data;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
  const response = await api.post<Appointment>('/appointments', appointment);
  return response.data;
}

export async function getAppointments(doctorId?: string, date?: string) {
  const params = new URLSearchParams();
  if (doctorId) params.append('doctorId', doctorId);
  if (date) params.append('date', date);
  
  const response = await api.get<Appointment[]>(`/appointments?${params.toString()}`);
  return response.data;
}

export async function getAppointment(id: string) {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const response = await api.patch<Appointment>(`/appointments/${id}`, { status });
  return response.data;
}