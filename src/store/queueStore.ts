import { create } from 'zustand';
import { QueueEntry, Staff, ServiceType, Notification, Patient, Appointment, QueueStatus, Priority, Lane } from '@/types/queue';

// Mock data generators
const generateQueueNumber = () => `Q-${String(Math.floor(Math.random() * 9000) + 1000)}`;

const mockLanes: Lane[] = [
  { id: 'lane-1', name: 'Lane 1', location: 'Building A', status: 'open', assignedStaff: 'Dr. Sarah Chen', serviceTypes: ['General Consultation', 'General Checkup'] },
  { id: 'lane-2', name: 'Lane 2', location: 'Building A', status: 'open', assignedStaff: 'Dr. Michael Roberts', serviceTypes: ['General Consultation', 'Specialist Consultation'] },
  { id: 'lane-3', name: 'Lane 3', location: 'Building A', status: 'open', assignedStaff: 'Nurse Emily Davis', serviceTypes: ['Lab Work', 'Vaccination'] },
  { id: 'lane-4', name: 'Lane 4', location: 'Building B', status: 'open', assignedStaff: 'Dr. James Wilson', serviceTypes: ['Specialist Consultation'] },
  { id: 'lane-5', name: 'Lane 5', location: 'Building B', status: 'break', assignedStaff: 'Nurse David Kim', serviceTypes: ['Lab Work'] },
  { id: 'lane-6', name: 'Lane 6', location: 'Building B', status: 'closed', serviceTypes: ['Vaccination'] },
];

const mockStaff: Staff[] = [
  { id: '1', name: 'Dr. Sarah Chen', role: 'Physician', avatar: '', status: 'available', assignedServices: ['general', 'checkup'], patientsServedToday: 12 },
  { id: '2', name: 'Dr. Michael Roberts', role: 'Physician', avatar: '', status: 'busy', assignedServices: ['general', 'specialist'], patientsServedToday: 8 },
  { id: '3', name: 'Nurse Emily Davis', role: 'Nurse', avatar: '', status: 'available', assignedServices: ['lab', 'vaccination'], patientsServedToday: 24 },
  { id: '4', name: 'Dr. James Wilson', role: 'Specialist', avatar: '', status: 'break', assignedServices: ['specialist'], patientsServedToday: 6 },
];

const mockServices: ServiceType[] = [
  { id: 'general', name: 'General Consultation', icon: 'stethoscope', avgServiceTime: 15, locations: ['Building A, Room 101'], isActive: true, staffCount: 3, todayServed: 24, todayWaiting: 8 },
  { id: 'lab', name: 'Lab Work', icon: 'flask-conical', avgServiceTime: 10, locations: ['Building B, Lab 1'], isActive: true, staffCount: 2, todayServed: 47, todayWaiting: 5 },
  { id: 'vaccination', name: 'Vaccination', icon: 'syringe', avgServiceTime: 5, locations: ['Building A, Room 105'], isActive: true, staffCount: 2, todayServed: 38, todayWaiting: 3 },
  { id: 'specialist', name: 'Specialist Consultation', icon: 'heart-pulse', avgServiceTime: 30, locations: ['Building C, Room 201'], isActive: true, staffCount: 2, todayServed: 12, todayWaiting: 4 },
];

const generateMockQueue = (): QueueEntry[] => {
  const names = ['John Smith', 'Maria Garcia', 'David Lee', 'Emma Wilson', 'James Brown', 'Sofia Martinez', 'William Johnson', 'Olivia Davis', 'Alexander Taylor', 'Isabella Anderson', 'Benjamin Thomas', 'Mia Jackson'];
  const priorities: Priority[] = ['normal', 'normal', 'normal', 'high', 'urgent'];
  const statuses: QueueStatus[] = ['checked-in', 'waiting', 'waiting', 'in-service', 'completed'];
  const lanes = ['Lane 1', 'Lane 2', 'Lane 3', 'Lane 4'];
  const rooms = ['Room 101', 'Room 102', 'Room 103', 'Room 201'];
  
  return names.map((name, index) => ({
    id: `patient-${index + 1}`,
    queueNumber: `Q-${String(1000 + index).padStart(4, '0')}`,
    patientName: name,
    patientId: `P${String(index + 1).padStart(5, '0')}`,
    serviceType: mockServices[index % mockServices.length].name,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.min(index, statuses.length - 1)] as QueueStatus,
    checkInTime: new Date(Date.now() - Math.random() * 3600000),
    estimatedWaitMinutes: Math.floor(Math.random() * 30) + 5,
    assignedStaff: index % 3 === 0 ? mockStaff[index % mockStaff.length].name : undefined,
    location: index % 2 === 0 ? 'Building A' : 'Building B',
    lane: statuses[Math.min(index, statuses.length - 1)] === 'in-service' ? lanes[index % lanes.length] : undefined,
    room: rooms[index % rooms.length],
    notes: index === 0 ? 'Patient requested wheelchair assistance' : undefined,
  }));
};

const mockNotifications: Notification[] = [
  { id: '1', type: 'urgent', title: 'Urgent Patient', message: 'Patient Q-1003 marked as urgent', timestamp: new Date(Date.now() - 300000), read: false },
  { id: '2', type: 'info', title: 'Staff Update', message: 'Dr. Wilson is now on break', timestamp: new Date(Date.now() - 900000), read: false },
  { id: '3', type: 'success', title: 'Queue Cleared', message: 'Lab Work queue is now empty', timestamp: new Date(Date.now() - 1800000), read: true },
];

const mockPatient: Patient = {
  id: 'P00001',
  name: 'Sarah Johnson',
  email: 'sarah@email.com',
  phone: '+1 (555) 123-4567',
  preferredLocation: 'City Medical Center',
};

const mockAppointments: Appointment[] = [
  { id: 'apt-1', patientId: 'P00001', serviceType: 'General Checkup', dateTime: new Date(Date.now() + 86400000), location: 'Building A', doctorName: 'Dr. Smith', status: 'scheduled' },
  { id: 'apt-2', patientId: 'P00001', serviceType: 'Lab Work', dateTime: new Date(Date.now() + 90000000), location: 'Building B', status: 'scheduled' },
];

interface WalkInData {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  service: string;
  notes?: string;
}

interface QueueStore {
  // Admin state
  queue: QueueEntry[];
  staff: Staff[];
  services: ServiceType[];
  notifications: Notification[];
  lanes: Lane[];
  selectedPatient: QueueEntry | null;
  
  // Patient state
  currentPatient: Patient;
  appointments: Appointment[];
  activeQueueEntry: QueueEntry | null;
  
  // Actions
  setSelectedPatient: (patient: QueueEntry | null) => void;
  updatePatientStatus: (id: string, status: QueueStatus) => void;
  callNextPatient: (serviceType?: string) => void;
  movePatient: (id: string, newStatus: QueueStatus) => void;
  checkInPatient: (appointmentId: string) => QueueEntry;
  addWalkInPatient: (data: WalkInData) => QueueEntry;
  leaveQueue: () => void;
  markNotificationRead: (id: string) => void;
  updateStaffStatus: (id: string, status: Staff['status']) => void;
  updateLaneStatus: (id: string, status: Lane['status']) => void;
  assignStaffToService: (serviceId: string, staffIds: string[]) => void;
  getStaffForService: (serviceId: string) => Staff[];
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  queue: generateMockQueue(),
  staff: mockStaff,
  services: mockServices,
  notifications: mockNotifications,
  lanes: mockLanes,
  selectedPatient: null,
  currentPatient: mockPatient,
  appointments: mockAppointments,
  activeQueueEntry: null,

  setSelectedPatient: (patient) => set({ selectedPatient: patient }),

  updatePatientStatus: (id, status) => set((state) => ({
    queue: state.queue.map((entry) =>
      entry.id === id ? { ...entry, status } : entry
    ),
  })),

  callNextPatient: (serviceType) => {
    const { queue } = get();
    const waitingPatients = queue
      .filter((p) => p.status === 'waiting' && (!serviceType || p.serviceType === serviceType))
      .sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        if (a.priority === 'high' && b.priority === 'normal') return -1;
        if (b.priority === 'high' && a.priority === 'normal') return 1;
        return a.checkInTime.getTime() - b.checkInTime.getTime();
      });

    if (waitingPatients.length > 0) {
      set((state) => ({
        queue: state.queue.map((entry) =>
          entry.id === waitingPatients[0].id ? { ...entry, status: 'in-service' } : entry
        ),
        selectedPatient: waitingPatients[0],
      }));
    }
  },

  movePatient: (id, newStatus) => set((state) => ({
    queue: state.queue.map((entry) =>
      entry.id === id ? { ...entry, status: newStatus } : entry
    ),
  })),

  checkInPatient: (appointmentId) => {
    const { currentPatient, appointments } = get();
    const appointment = appointments.find((a) => a.id === appointmentId);
    
    const newEntry: QueueEntry = {
      id: `entry-${Date.now()}`,
      queueNumber: generateQueueNumber(),
      patientName: currentPatient.name,
      patientId: currentPatient.id,
      serviceType: appointment?.serviceType || 'General Consultation',
      priority: 'normal',
      status: 'waiting',
      checkInTime: new Date(),
      estimatedWaitMinutes: 15,
      location: appointment?.location || 'Building A, Room 101',
    };

    set((state) => ({
      queue: [...state.queue, newEntry],
      activeQueueEntry: newEntry,
      appointments: state.appointments.map((a) =>
        a.id === appointmentId ? { ...a, status: 'checked-in' } : a
      ),
    }));

    return newEntry;
  },

  leaveQueue: () => set((state) => ({
    queue: state.queue.filter((entry) => entry.id !== state.activeQueueEntry?.id),
    activeQueueEntry: null,
  })),

  addWalkInPatient: (data) => {
    const { services } = get();
    const service = services.find(s => s.id === data.service);
    const patientName = data.lastName 
      ? `${data.firstName} ${data.lastName}` 
      : data.firstName;
    
    const newEntry: QueueEntry = {
      id: `walkin-${Date.now()}`,
      queueNumber: generateQueueNumber(),
      patientName,
      patientId: `W${Date.now()}`,
      serviceType: service?.name || 'General Consultation',
      priority: 'normal',
      status: 'waiting',
      checkInTime: new Date(),
      estimatedWaitMinutes: service?.avgServiceTime || 15,
      location: service?.locations[0] || 'Building A',
      notes: data.notes,
    };

    set((state) => ({
      queue: [...state.queue, newEntry],
      activeQueueEntry: newEntry,
      // Update service waiting count
      services: state.services.map((s) =>
        s.id === data.service ? { ...s, todayWaiting: s.todayWaiting + 1 } : s
      ),
    }));

    return newEntry;
  },

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  updateStaffStatus: (id, status) => set((state) => ({
    staff: state.staff.map((s) =>
      s.id === id ? { ...s, status } : s
    ),
  })),

  updateLaneStatus: (id, status) => set((state) => ({
    lanes: state.lanes.map((l) =>
      l.id === id ? { ...l, status } : l
    ),
  })),

  assignStaffToService: (serviceId, staffIds) => set((state) => {
    const service = state.services.find(s => s.id === serviceId);
    if (!service) return state;

    // Update staff assignments
    const updatedStaff = state.staff.map((s) => {
      const isAssigned = staffIds.includes(s.id);
      const hasService = s.assignedServices.includes(serviceId);
      
      if (isAssigned && !hasService) {
        return { ...s, assignedServices: [...s.assignedServices, serviceId] };
      } else if (!isAssigned && hasService) {
        return { ...s, assignedServices: s.assignedServices.filter(sid => sid !== serviceId) };
      }
      return s;
    });

    // Update service staff count
    const updatedServices = state.services.map((s) =>
      s.id === serviceId ? { ...s, staffCount: staffIds.length } : s
    );

    return { staff: updatedStaff, services: updatedServices };
  }),

  getStaffForService: (serviceId) => {
    const { staff } = get();
    return staff.filter(s => s.assignedServices.includes(serviceId));
  },
}));
