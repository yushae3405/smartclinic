export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: number;
  bio?: string;
  posts?: Post[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  authorId: string;
  author?: Doctor;
  category: string;
  image: string;
  published: boolean;
  views: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}