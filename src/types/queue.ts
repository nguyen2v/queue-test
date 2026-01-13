export type Priority = 'urgent' | 'high' | 'normal';
export type QueueStatus = 'checked-in' | 'waiting' | 'in-service' | 'completed' | 'no-show';
export type StaffStatus = 'available' | 'busy' | 'break' | 'offline';

export interface QueueEntry {
  id: string;
  queueNumber: string;
  patientName: string;
  patientId: string;
  serviceType: string;
  priority: Priority;
  status: QueueStatus;
  checkInTime: Date;
  estimatedWaitMinutes: number;
  assignedStaff?: string;
  location: string;
  notes?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  avgServiceTime: number;
  locations: string[];
  isActive: boolean;
  staffCount: number;
  todayServed: number;
  todayWaiting: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: StaffStatus;
  assignedServices: string[];
  patientsServedToday: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferredLocation: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  serviceType: string;
  dateTime: Date;
  location: string;
  doctorName?: string;
  status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
}
