import { useState, useCallback } from 'react';
import type { AppState, AppContextType, User, Lane, Booking, Subscription, Notification } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { seedData } from '@/lib/seedData';

function getInitialState(): AppState {
  const saved = loadState();
  if (saved) return saved;
  return seedData();
}

export function useAppState(): AppContextType {
  const [state, setState] = useState<AppState>(getInitialState);

  const persist = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  const login = useCallback((email: string, _password?: string): User | null => {
    const user = state.users.find((u) => u.email === email);
    if (user) {
      const newState = { ...state, currentUser: user };
      persist(newState);
      return user;
    }
    return null;
  }, [state]);

  const logout = useCallback(() => {
    persist({ ...state, currentUser: null });
  }, [state]);

  const addUser = useCallback((user: User) => {
    persist({ ...state, users: [...state.users, user] });
  }, [state]);

  const updateLane = useCallback((lane: Lane) => {
    persist({ ...state, lanes: state.lanes.map((l) => l.id === lane.id ? lane : l) });
  }, [state]);

  const addBooking = useCallback((booking: Booking) => {
    persist({ ...state, bookings: [...state.bookings, booking] });
  }, [state]);

  const cancelBooking = useCallback((id: string) => {
    persist({
      ...state,
      bookings: state.bookings.map((b) => b.id === id ? { ...b, status: 'cancelled' as const } : b),
    });
  }, [state]);

  const addSubscription = useCallback((sub: Subscription) => {
    persist({ ...state, subscriptions: [...state.subscriptions, sub] });
  }, [state]);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    persist({
      ...state,
      subscriptions: state.subscriptions.map((s) => s.id === id ? { ...s, ...updates } : s),
    });
  }, [state]);

  const joinTournament = useCallback((tournamentId: string, userId: string) => {
    persist({
      ...state,
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId && !t.participants.includes(userId) && t.participants.length < t.maxParticipants
          ? { ...t, participants: [...t.participants, userId] }
          : t
      ),
    });
  }, [state]);

  const leaveTournament = useCallback((tournamentId: string, userId: string) => {
    persist({
      ...state,
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId
          ? { ...t, participants: t.participants.filter((p) => p !== userId) }
          : t
      ),
    });
  }, [state]);

  const markNotificationRead = useCallback((id: string) => {
    persist({
      ...state,
      notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    });
  }, [state]);

  const addNotification = useCallback((notification: Notification) => {
    persist({ ...state, notifications: [...state.notifications, notification] });
  }, [state]);

  return {
    state,
    login,
    logout,
    addUser,
    updateLane,
    addBooking,
    cancelBooking,
    addSubscription,
    updateSubscription,
    joinTournament,
    leaveTournament,
    markNotificationRead,
    addNotification,
  };
}
