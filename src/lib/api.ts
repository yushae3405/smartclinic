import axios from 'axios';
import type { Doctor, Service, Appointment, Post, Comment, CreateAppointmentData } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getDoctors(search?: string, specialty?: string): Promise<Doctor[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (specialty) params.append('specialty', specialty);
    
    const response = await api.get<Doctor[]>('/doctors', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function createAppointment(data: CreateAppointmentData): Promise<Appointment> {
  const response = await api.post<Appointment>('/appointments', data);
  return response.data;
}

export async function getPosts(category?: string): Promise<Post[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    
    const response = await api.get<Post[]>('/posts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post> {
  const response = await api.get<Post>(`/posts/${slug}`);
  return response.data;
}

export async function createComment(postId: string, data: Omit<Comment, 'id' | 'postId'>): Promise<Comment> {
  const response = await api.post<Comment>(`/posts/${postId}/comments`, data);
  return response.data;
}

export async function seedDoctors(): Promise<Doctor[]> {
  try {
    const response = await api.post<Doctor[]>('/seed/doctors');
    return response.data;
  } catch (error) {
    console.error('Error seeding doctors:', error);
    return [];
  }
}

export async function seedServices(): Promise<Service[]> {
  try {
    const response = await api.post<Service[]>('/seed/services');
    return response.data;
  } catch (error) {
    console.error('Error seeding services:', error);
    return [];
  }
}

export async function seedPosts(): Promise<Post[]> {
  try {
    const response = await api.post<Post[]>('/seed/posts');
    return response.data;
  } catch (error) {
    console.error('Error seeding posts:', error);
    return [];
  }
}