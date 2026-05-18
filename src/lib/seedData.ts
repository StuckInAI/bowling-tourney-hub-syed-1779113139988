import type { User, Subscription, Lane, TimeSlot, Booking, Tournament, TournamentInvite, TournamentScore, Notification } from '@/types';
import { generateId, getToday, getTomorrow } from '@/lib/utils';

export function createSeedUsers(): User[] {
  return [
    { id: 'u1', name: 'Admin Supreme', email: 'admin@bowling.com', password: 'admin123', role: 'super_admin', phone: '555-0001', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'u2', name: 'Venue Manager', email: 'manager@bowling.com', password: 'manager123', role: 'venue_manager', phone: '555-0002', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'u3', name: 'Staff Johnson', email: 'staff@bowling.com', password: 'staff123', role: 'staff', phone: '555-0003', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'u4', name: 'Alice Member', email: 'alice@example.com', password: 'member123', role: 'member', phone: '555-0101', createdAt: '2024-02-01T00:00:00Z' },
    { id: 'u5', name: 'Bob Member', email: 'bob@example.com', password: 'member123', role: 'member', phone: '555-0102', createdAt: '2024-02-15T00:00:00Z' },
    { id: 'u6', name: 'Carol Member', email: 'carol@example.com', password: 'member123', role: 'member', phone: '555-0103', createdAt: '2024-03-01T00:00:00Z' },
    { id: 'u7', name: 'Dave Member', email: 'dave@example.com', password: 'member123', role: 'member', phone: '555-0104', createdAt: '2024-03-15T00:00:00Z' },
    { id: 'u8', name: 'Eve Member', email: 'eve@example.com', password: 'member123', role: 'member', phone: '555-0105', createdAt: '2024-04-01T00:00:00Z' },
  ];
}

export function createSeedSubscriptions(): Subscription[] {
  return [
    { id: 's1', userId: 'u4', status: 'active', startDate: '2024-01-01', endDate: '2025-12-31', activatedBy: 'u1', createdAt: '2024-01-01T00:00:00Z' },
    { id: 's2', userId: 'u5', status: 'active', startDate: '2024-02-01', endDate: '2025-12-31', activatedBy: 'u1', createdAt: '2024-02-15T00:00:00Z' },
    { id: 's3', userId: 'u6', status: 'active', startDate: '2024-03-01', endDate: '2025-12-31', activatedBy: 'u2', createdAt: '2024-03-01T00:00:00Z' },
    { id: 's4', userId: 'u7', status: 'expired', startDate: '2023-01-01', endDate: '2024-01-01', activatedBy: 'u1', createdAt: '2023-01-01T00:00:00Z' },
    { id: 's5', userId: 'u8', status: 'active', startDate: '2024-04-01', endDate: '2025-12-31', activatedBy: 'u2', createdAt: '2024-04-01T00:00:00Z' },
  ];
}

export function createSeedLanes(): Lane[] {
  const lanes: Lane[] = [];
  for (let i = 1; i <= 16; i++) {
    lanes.push({
      id: `lane${i}`,
      number: i,
      name: `Lane ${i}`,
      status: i === 16 ? 'maintenance' : 'active',
    });
  }
  return lanes;
}

export function createSeedTimeSlots(lanes: Lane[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = getToday();
  const tomorrow = getTomorrow();
  const dates = [today, tomorrow];

  for (const date of dates) {
    for (const lane of lanes) {
      for (let hour = 9; hour < 22; hour++) {
        slots.push({
          id: generateId(),
          laneId: lane.id,
          date,
          startHour: hour,
          endHour: hour + 1,
          status: 'available',
          bookingId: null,
          tournamentId: null,
        });
      }
    }
  }
  return slots;
}

export function createSeedBookings(): Booking[] {
  return [
    {
      id: 'b1', slotId: '', laneId: 'lane1', date: getToday(), startHour: 10, endHour: 11,
      type: 'member', status: 'confirmed', userId: 'u4',
      outsiderName: null, outsiderEmail: null, outsiderPhone: null,
      paymentMethod: null, createdAt: new Date().toISOString(),
    },
    {
      id: 'b2', slotId: '', laneId: 'lane3', date: getToday(), startHour: 14, endHour: 15,
      type: 'member', status: 'confirmed', userId: 'u5',
      outsiderName: null, outsiderEmail: null, outsiderPhone: null,
      paymentMethod: null, createdAt: new Date().toISOString(),
    },
  ];
}

export function createSeedTournaments(): Tournament[] {
  return [
    {
      id: 't1', name: 'Spring Championship 2025', description: 'Annual spring tournament for all active members.',
      date: getTomorrow(), startHour: 10, endHour: 16,
      laneIds: ['lane1', 'lane2', 'lane3', 'lane4'],
      maxParticipants: 16, inviteMode: 'all', status: 'invitations_sent',
      createdBy: 'u2', createdAt: '2024-12-01T00:00:00Z',
    },
  ];
}

export function createSeedInvites(): TournamentInvite[] {
  return [
    { id: 'ti1', tournamentId: 't1', userId: 'u4', status: 'accepted', respondedAt: '2024-12-05T00:00:00Z' },
    { id: 'ti2', tournamentId: 't1', userId: 'u5', status: 'accepted', respondedAt: '2024-12-06T00:00:00Z' },
    { id: 'ti3', tournamentId: 't1', userId: 'u6', status: 'pending', respondedAt: null },
    { id: 'ti4', tournamentId: 't1', userId: 'u8', status: 'declined', respondedAt: '2024-12-07T00:00:00Z' },
  ];
}

export function createSeedScores(): TournamentScore[] {
  return [
    { id: 'sc1', tournamentId: 't1', userId: 'u4', game: 1, score: 185, enteredBy: 'u3', createdAt: new Date().toISOString() },
    { id: 'sc2', tournamentId: 't1', userId: 'u5', game: 1, score: 210, enteredBy: 'u3', createdAt: new Date().toISOString() },
  ];
}

export function createSeedNotifications(): Notification[] {
  return [
    { id: 'n1', userId: 'u4', type: 'tournament_invite', title: 'Tournament Invite', message: 'You have been invited to Spring Championship 2025!', read: false, link: '/tournaments/t1', createdAt: new Date().toISOString() },
    { id: 'n2', userId: 'u4', type: 'booking_confirmation', title: 'Booking Confirmed', message: 'Your booking for Lane 1 at 10:00 AM today is confirmed.', read: true, link: '/bookings', createdAt: new Date().toISOString() },
    { id: 'n3', userId: 'u5', type: 'tournament_invite', title: 'Tournament Invite', message: 'You have been invited to Spring Championship 2025!', read: false, link: '/tournaments/t1', createdAt: new Date().toISOString() },
    { id: 'n4', userId: 'u6', type: 'tournament_invite', title: 'Tournament Invite', message: 'You have been invited to Spring Championship 2025!', read: false, link: '/tournaments/t1', createdAt: new Date().toISOString() },
  ];
}
