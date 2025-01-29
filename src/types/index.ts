export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}