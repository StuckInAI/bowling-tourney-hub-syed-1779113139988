export type UserRole = 'super_admin' | 'venue_manager' | 'staff' | 'member';

export type SubscriptionStatus = 'active' | 'expired' | 'suspended';

export type BookingStatus = 'confirmed' | 'pending_payment' | 'cancelled' | 'completed';

export type BookingType = 'member' | 'outsider';

export type PaymentMethod = 'online' | 'at_venue';

export type LaneStatus = 'active' | 'maintenance' | 'disabled';

export type SlotStatus = 'available' | 'booked_member' | 'booked_outsider' | 'reserved_tournament' | 'publicly_available';

export type TournamentStatus = 'draft' | 'invitations_sent' | 'in_progress' | 'completed' | 'cancelled';

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export type InviteMode = 'select' | 'all';

export type NotificationType =
  | 'tournament_invite'
  | 'tournament_reminder'
  | 'booking_confirmation'
  | 'booking_cancellation'
  | 'slot_reminder'
  | 'subscription_expiry'
  | 'outsider_booking_confirmation'
  | 'general';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  activatedBy: string;
  createdAt: string;
}

export interface Lane {
  id: string;
  number: number;
  name: string;
  status: LaneStatus;
}

export interface TimeSlot {
  id: string;
  laneId: string;
  date: string;
  startHour: number;
  endHour: number;
  status: SlotStatus;
  bookingId: string | null;
  tournamentId: string | null;
}

export interface Booking {
  id: string;
  slotId: string;
  laneId: string;
  date: string;
  startHour: number;
  endHour: number;
  type: BookingType;
  status: BookingStatus;
  userId: string | null;
  outsiderName: string | null;
  outsiderEmail: string | null;
  outsiderPhone: string | null;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  startHour: number;
  endHour: number;
  laneIds: string[];
  maxParticipants: number;
  inviteMode: InviteMode;
  status: TournamentStatus;
  createdBy: string;
  createdAt: string;
}

export interface TournamentInvite {
  id: string;
  tournamentId: string;
  userId: string;
  status: InviteStatus;
  respondedAt: string | null;
}

export interface TournamentScore {
  id: string;
  tournamentId: string;
  userId: string;
  game: number;
  score: number;
  enteredBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  subscriptions: Subscription[];
  lanes: Lane[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  tournaments: Tournament[];
  tournamentInvites: TournamentInvite[];
  tournamentScores: TournamentScore[];
  notifications: Notification[];
}
