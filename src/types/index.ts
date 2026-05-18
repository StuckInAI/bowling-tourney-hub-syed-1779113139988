export type UserRole = 'super_admin' | 'venue_manager' | 'staff' | 'member';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
};

export type LaneStatus = 'available' | 'occupied' | 'maintenance';

export type Lane = {
  id: string;
  name: string;
  number: number;
  status: LaneStatus;
};

export type TimeSlot = {
  id: string;
  laneId: string;
  date: string;
  startHour: number;
  endHour: number;
  status: 'available' | 'booked' | 'blocked';
  bookingId?: string;
};

export type Booking = {
  id: string;
  userId: string;
  laneId: string;
  date: string;
  startHour: number;
  endHour: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  players: number;
  createdAt: string;
};

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export type Subscription = {
  id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
};

export type Tournament = {
  id: string;
  name: string;
  date: string;
  maxParticipants: number;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed';
  description?: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'info' | 'warning' | 'success';
};

export type AppState = {
  currentUser: User | null;
  users: User[];
  lanes: Lane[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  subscriptions: Subscription[];
  tournaments: Tournament[];
  notifications: Notification[];
};

export type AppContextType = {
  state: AppState;
  login: (email: string, password?: string) => User | null;
  logout: () => void;
  addUser: (user: User) => void;
  updateLane: (lane: Lane) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  joinTournament: (tournamentId: string, userId: string) => void;
  leaveTournament: (tournamentId: string, userId: string) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Notification) => void;
};
