import type { AppState } from '@/types';

export function seedData(): AppState {
  return {
    currentUser: null,
    members: [
      { id: 'm1', name: 'Alice Johnson', email: 'alice@email.com', phone: '555-0101', membershipType: 'premium', status: 'active', joinDate: '2024-01-15', gamesPlayed: 42, averageScore: 165 },
      { id: 'm2', name: 'Bob Williams', email: 'bob@email.com', phone: '555-0102', membershipType: 'basic', status: 'active', joinDate: '2024-02-20', gamesPlayed: 28, averageScore: 142 },
      { id: 'm3', name: 'Carol Davis', email: 'carol@email.com', phone: '555-0103', membershipType: 'vip', status: 'active', joinDate: '2023-11-10', gamesPlayed: 87, averageScore: 189 },
      { id: 'm4', name: 'Dan Brown', email: 'dan@email.com', phone: '555-0104', membershipType: 'basic', status: 'inactive', joinDate: '2024-03-05', gamesPlayed: 12, averageScore: 118 },
      { id: 'm5', name: 'Eve Martinez', email: 'eve@email.com', phone: '555-0105', membershipType: 'premium', status: 'active', joinDate: '2024-01-28', gamesPlayed: 55, averageScore: 172 },
    ],
    lanes: [
      { id: 'l1', name: 'Lane 1', number: 1, status: 'available', type: 'standard' },
      { id: 'l2', name: 'Lane 2', number: 2, status: 'occupied', type: 'standard' },
      { id: 'l3', name: 'Lane 3', number: 3, status: 'available', type: 'vip' },
      { id: 'l4', name: 'Lane 4', number: 4, status: 'maintenance', type: 'standard' },
      { id: 'l5', name: 'Lane 5', number: 5, status: 'available', type: 'cosmic' },
      { id: 'l6', name: 'Lane 6', number: 6, status: 'available', type: 'standard' },
    ],
    slots: [
      { id: 's1', laneId: 'l1', date: '2025-01-20', startTime: '10:00', endTime: '11:00', status: 'available', price: 25 },
      { id: 's2', laneId: 'l1', date: '2025-01-20', startTime: '11:00', endTime: '12:00', status: 'booked', price: 25 },
      { id: 's3', laneId: 'l2', date: '2025-01-20', startTime: '10:00', endTime: '11:00', status: 'available', price: 25 },
      { id: 's4', laneId: 'l3', date: '2025-01-20', startTime: '10:00', endTime: '11:00', status: 'available', price: 40 },
      { id: 's5', laneId: 'l5', date: '2025-01-20', startTime: '14:00', endTime: '15:00', status: 'available', price: 35 },
      { id: 's6', laneId: 'l1', date: '2025-01-21', startTime: '10:00', endTime: '11:00', status: 'available', price: 25 },
      { id: 's7', laneId: 'l2', date: '2025-01-21', startTime: '10:00', endTime: '11:00', status: 'available', price: 25 },
      { id: 's8', laneId: 'l3', date: '2025-01-21', startTime: '15:00', endTime: '16:00', status: 'available', price: 40 },
    ],
    bookings: [
      { id: 'b1', memberId: 'm1', slotId: 's2', laneId: 'l1', date: '2025-01-20', startTime: '11:00', endTime: '12:00', status: 'confirmed', totalAmount: 25, createdAt: '2025-01-18T10:00:00Z' },
      { id: 'b2', memberId: 'm3', slotId: 's4', laneId: 'l3', date: '2025-01-20', startTime: '10:00', endTime: '11:00', status: 'pending', totalAmount: 40, createdAt: '2025-01-18T11:00:00Z' },
    ],
    tournaments: [
      {
        id: 't1',
        name: 'Winter Championship 2025',
        date: '2025-02-15',
        maxParticipants: 32,
        entryFee: 50,
        status: 'upcoming',
        participants: ['m1', 'm3', 'm5'],
        createdAt: '2025-01-10T09:00:00Z',
      },
      {
        id: 't2',
        name: 'Casual Friday League',
        date: '2025-01-24',
        maxParticipants: 16,
        entryFee: 0,
        status: 'upcoming',
        participants: ['m1', 'm2'],
        createdAt: '2025-01-12T14:00:00Z',
      },
    ],
    notifications: [
      { id: 'n1', userId: 'u1', title: 'New Booking', message: 'Alice Johnson booked Lane 1 for Jan 20.', read: false, createdAt: '2025-01-18T10:05:00Z' },
      { id: 'n2', userId: 'u1', title: 'Tournament Signup', message: 'Carol Davis signed up for Winter Championship.', read: true, createdAt: '2025-01-17T15:00:00Z' },
      { id: 'n3', userId: 'u4', title: 'Booking Confirmed', message: 'Your booking for Lane 1 on Jan 20 is confirmed.', read: false, createdAt: '2025-01-18T10:10:00Z' },
    ],
  };
}
