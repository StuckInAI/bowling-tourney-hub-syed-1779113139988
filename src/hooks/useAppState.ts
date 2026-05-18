import { useState, useCallback } from 'react';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seedData';
import type { AppState, Member, Lane, Booking, Tournament, Notification, AppContextType } from '@/types';

const initialState: AppState = loadState() || seedData();

export function useAppState(): AppContextType {
  const [state, setState] = useState<AppState>(initialState);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState);
  }, []);

  const login = useCallback((email: string): boolean => {
    const users = [
      { id: 'u1', name: 'Admin User', email: 'admin@bowlbook.com', role: 'super_admin' as const },
      { id: 'u2', name: 'Manager Smith', email: 'manager@bowlbook.com', role: 'venue_manager' as const },
      { id: 'u3', name: 'Staff Jones', email: 'staff@bowlbook.com', role: 'staff' as const },
      { id: 'u4', name: 'John Member', email: 'member@bowlbook.com', role: 'member' as const },
    ];
    const user = users.find((u) => u.email === email);
    if (user) {
      const newState = { ...state, currentUser: user };
      persist(newState);
      return true;
    }
    return false;
  }, [state, persist]);

  const logout = useCallback(() => {
    const newState = { ...state, currentUser: null };
    persist(newState);
  }, [state, persist]);

  const addMember = useCallback((member: Member) => {
    const newState = { ...state, members: [...state.members, member] };
    persist(newState);
  }, [state, persist]);

  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    const newState = {
      ...state,
      members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    };
    persist(newState);
  }, [state, persist]);

  const deleteMember = useCallback((id: string) => {
    const newState = { ...state, members: state.members.filter((m) => m.id !== id) };
    persist(newState);
  }, [state, persist]);

  const updateLaneStatus = useCallback((id: string, status: Lane['status']) => {
    const newState = {
      ...state,
      lanes: state.lanes.map((l) => (l.id === id ? { ...l, status } : l)),
    };
    persist(newState);
  }, [state, persist]);

  const addBooking = useCallback((booking: Booking) => {
    const newState = {
      ...state,
      bookings: [...state.bookings, booking],
      slots: state.slots.map((s) => (s.id === booking.slotId ? { ...s, status: 'booked' as const } : s)),
    };
    persist(newState);
  }, [state, persist]);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    const booking = state.bookings.find((b) => b.id === id);
    let newSlots = state.slots;
    if (booking && status === 'cancelled') {
      newSlots = state.slots.map((s) => (s.id === booking.slotId ? { ...s, status: 'available' as const } : s));
    }
    const newState = {
      ...state,
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
      slots: newSlots,
    };
    persist(newState);
  }, [state, persist]);

  const addTournament = useCallback((tournament: Tournament) => {
    const newState = { ...state, tournaments: [...state.tournaments, tournament] };
    persist(newState);
  }, [state, persist]);

  const joinTournament = useCallback((tournamentId: string) => {
    if (!state.currentUser) return;
    const newState = {
      ...state,
      tournaments: state.tournaments.map((t) => {
        if (t.id === tournamentId && !t.participants.includes(state.currentUser!.id)) {
          return { ...t, participants: [...t.participants, state.currentUser!.id] };
        }
        return t;
      }),
    };
    persist(newState);
  }, [state, persist]);

  const markNotificationRead = useCallback((id: string) => {
    const newState = {
      ...state,
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    };
    persist(newState);
  }, [state, persist]);

  const markAllNotificationsRead = useCallback(() => {
    if (!state.currentUser) return;
    const newState = {
      ...state,
      notifications: state.notifications.map((n) =>
        n.userId === state.currentUser!.id ? { ...n, read: true } : n
      ),
    };
    persist(newState);
  }, [state, persist]);

  return {
    ...state,
    state,
    login,
    logout,
    addMember,
    updateMember,
    deleteMember,
    updateLaneStatus,
    addBooking,
    updateBookingStatus,
    addTournament,
    joinTournament,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
