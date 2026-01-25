export type Priority = 'urgent' | 'high' | 'normal';
export type QueueStatus =
  | 'checked-in'
  | 'waiting'
  | 'clinic-suite'
  | 'in-service'
  | 'completed'
  | 'cancelled'
  | 'no-show';
export type StaffStatus = 'available' | 'busy' | 'break' | 'offline';

export type CallStatus = 'idle' | 'calling' | 'called';

// Multi-location queue support
export type QueueLocation = 
  | 'general-waiting'
  | 'clinic-suite'
  | 'radiology'
  | 'laboratory'
  | 'billing'
  | 'pharmacy';

export interface QueueLocationInfo {
  id: QueueLocation;
  name: string;
  building?: string;
  room?: string;
  orderNumber?: number; // Dynamic order number per location
  enteredAt?: Date;
}

export interface QueueHistoryEntry {
  location: QueueLocation;
  locationName: string;
  status: 'completed' | 'current' | 'upcoming';
  enteredAt?: Date;
  completedAt?: Date;
  room?: string;
  building?: string;
}

export interface VitalSigns {
  bloodPressure?: string; // e.g. "120/80"
  respiratoryRate?: number; // breaths/min
  heartRate?: number; // bpm
  spo2?: number; // percent
  temperatureC?: number;
  heightCm?: number;
  weightKg?: number;
}

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
  lane?: string; // Lane/Counter number e.g., "Lane 1", "Counter A"
  room?: string; // Room number e.g., "Room 101"
  building?: string; // Building e.g., "Building A"
  notes?: string;

  // Doctor view
  callStatus?: CallStatus;
  callStartedAt?: number; // epoch ms
  calledAt?: number; // epoch ms
  vitals?: VitalSigns;

  // Multi-location queue tracking
  currentLocation?: QueueLocation;
  currentLocationInfo?: QueueLocationInfo;
  queueHistory?: QueueHistoryEntry[];
  orderNumberInLocation?: number; // Dynamic order number in current location
}

export interface Lane {
  id: string;
  name: string;
  location: string;
  status: 'open' | 'closed' | 'break';
  currentPatient?: string; // patient id
  assignedStaff?: string;
  serviceTypes: string[];
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

// Location metadata for display
export const QUEUE_LOCATIONS: Record<QueueLocation, { name: string; icon: string }> = {
  'general-waiting': { name: 'General Waiting Room', icon: 'users' },
  'clinic-suite': { name: 'Clinic Suite', icon: 'stethoscope' },
  'radiology': { name: 'Radiology', icon: 'scan' },
  'laboratory': { name: 'Laboratory', icon: 'flask-conical' },
  'billing': { name: 'Billing', icon: 'receipt' },
  'pharmacy': { name: 'Pharmacy', icon: 'pill' },
};
