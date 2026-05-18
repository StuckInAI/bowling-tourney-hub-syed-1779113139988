export type UserRole = 'super_admin' | 'venue_manager' | 'staff' | 'member';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  gamesPlayed: number;
  averageScore: number;
};

export type Lane = {
  id: string;
  name: string;
  number: number;
  status: 'available' | 'occupied' | 'maintenance';
  type: 'standard' | 'vip' | 'cosmic';
};

export type TimeSlot = {
  id: string;
  laneId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked';
  price: number;
};

export type Booking = {
  id: string;
  memberId: string;
  slotId: string;
  laneId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
};

export type Tournament = {
  id: string;
  name: string;
  date: string;
  maxParticipants: number;
  entryFee: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  participants: string[];
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type AppState = {
  currentUser: User | null;
  members: Member[];
  lanes: Lane[];
  slots: TimeSlot[];
  bookings: Booking[];
  tournaments: Tournament[];
  notifications: Notification[];
};

export type AppActions = {
  login: (email: string) => boolean;
  logout: () => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  updateLaneStatus: (id: string, status: Lane['status']) => void;
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addTournament: (tournament: Tournament) => void;
  joinTournament: (tournamentId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

export type AppContextType = AppState & AppActions & { state: AppState };
