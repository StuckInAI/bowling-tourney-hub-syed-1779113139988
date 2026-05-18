import type { AppState, User, Lane, TimeSlot, Booking, Subscription, Tournament, Notification } from '@/types';

export function seedData(): AppState {
  const users: User[] = [
    { id: 'u1', name: 'Admin User', email: 'admin@bowlbook.com', role: 'super_admin', phone: '555-0100', createdAt: '2024-01-01' },
    { id: 'u2', name: 'Jane Manager', email: 'jane@bowlbook.com', role: 'venue_manager', phone: '555-0101', createdAt: '2024-01-05' },
    { id: 'u3', name: 'Bob Staff', email: 'bob@bowlbook.com', role: 'staff', phone: '555-0102', createdAt: '2024-02-10' },
    { id: 'u4', name: 'Alice Member', email: 'alice@bowlbook.com', role: 'member', phone: '555-0103', createdAt: '2024-03-15' },
    { id: 'u5', name: 'Charlie Member', email: 'charlie@bowlbook.com', role: 'member', phone: '555-0104', createdAt: '2024-03-20' },
  ];

  const lanes: Lane[] = [
    { id: 'l1', name: 'Lane 1', number: 1, status: 'available' },
    { id: 'l2', name: 'Lane 2', number: 2, status: 'occupied' },
    { id: 'l3', name: 'Lane 3', number: 3, status: 'available' },
    { id: 'l4', name: 'Lane 4', number: 4, status: 'maintenance' },
    { id: 'l5', name: 'Lane 5', number: 5, status: 'available' },
    { id: 'l6', name: 'Lane 6', number: 6, status: 'available' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const timeSlots: TimeSlot[] = [
    { id: 'ts1', laneId: 'l1', date: today, startHour: 10, endHour: 11, status: 'available' },
    { id: 'ts2', laneId: 'l1', date: today, startHour: 11, endHour: 12, status: 'booked', bookingId: 'b1' },
    { id: 'ts3', laneId: 'l2', date: today, startHour: 10, endHour: 11, status: 'booked', bookingId: 'b2' },
    { id: 'ts4', laneId: 'l3', date: today, startHour: 14, endHour: 15, status: 'available' },
    { id: 'ts5', laneId: 'l5', date: today, startHour: 16, endHour: 17, status: 'available' },
  ];

  const bookings: Booking[] = [
    { id: 'b1', userId: 'u4', laneId: 'l1', date: today, startHour: 11, endHour: 12, status: 'confirmed', players: 4, createdAt: '2024-06-01' },
    { id: 'b2', userId: 'u5', laneId: 'l2', date: today, startHour: 10, endHour: 11, status: 'confirmed', players: 2, createdAt: '2024-06-02' },
  ];

  const subscriptions: Subscription[] = [
    { id: 's1', userId: 'u4', plan: 'Monthly', status: 'active', startDate: '2024-06-01', endDate: '2024-12-31' },
    { id: 's2', userId: 'u5', plan: 'Annual', status: 'active', startDate: '2024-01-01', endDate: '2025-01-01' },
  ];

  const tournaments: Tournament[] = [
    { id: 't1', name: 'Summer Classic', date: '2024-08-15', maxParticipants: 16, participants: ['u4', 'u5'], status: 'upcoming', description: 'Annual summer bowling tournament.' },
    { id: 't2', name: 'Friday Night Strikes', date: '2024-07-20', maxParticipants: 8, participants: ['u4'], status: 'upcoming', description: 'Casual Friday tournament.' },
  ];

  const notifications: Notification[] = [
    { id: 'n1', userId: 'u4', message: 'Your booking for Lane 1 is confirmed.', read: false, createdAt: '2024-06-01T10:00:00Z', type: 'success' },
    { id: 'n2', userId: 'u1', message: 'Lane 4 is under maintenance.', read: false, createdAt: '2024-06-02T09:00:00Z', type: 'warning' },
  ];

  return {
    currentUser: null,
    users,
    lanes,
    timeSlots,
    bookings,
    subscriptions,
    tournaments,
    notifications,
  };
}
