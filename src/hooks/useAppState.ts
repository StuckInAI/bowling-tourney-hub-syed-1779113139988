import { useState, useEffect, useCallback } from 'react';
import type { AppState, User, Subscription, Lane, TimeSlot, Booking, Tournament, TournamentInvite, TournamentScore, Notification } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import {
  createSeedUsers,
  createSeedSubscriptions,
  createSeedLanes,
  createSeedTimeSlots,
  createSeedBookings,
  createSeedTournaments,
  createSeedInvites,
  createSeedScores,
  createSeedNotifications,
} from '@/lib/seedData';

function getInitialState(): AppState {
  const saved = loadState();
  if (saved) return saved;

  const lanes = createSeedLanes();
  const timeSlots = createSeedTimeSlots(lanes);
  const bookings = createSeedBookings();

  // Link bookings to slots
  for (const booking of bookings) {
    const matchSlot = timeSlots.find(
      (s) => s.laneId === booking.laneId && s.date === booking.date && s.startHour === booking.startHour
    );
    if (matchSlot) {
      booking.slotId = matchSlot.id;
      matchSlot.bookingId = booking.id;
      matchSlot.status = booking.type === 'member' ? 'booked_member' : 'booked_outsider';
    }
  }

  // Reserve tournament slots
  const tournaments = createSeedTournaments();
  for (const t of tournaments) {
    for (const laneId of t.laneIds) {
      for (let h = t.startHour; h < t.endHour; h++) {
        const slot = timeSlots.find((s) => s.laneId === laneId && s.date === t.date && s.startHour === h);
        if (slot && slot.status === 'available') {
          slot.status = 'reserved_tournament';
          slot.tournamentId = t.id;
        }
      }
    }
  }

  return {
    currentUser: null,
    users: createSeedUsers(),
    subscriptions: createSeedSubscriptions(),
    lanes,
    timeSlots,
    bookings,
    tournaments,
    tournamentInvites: createSeedInvites(),
    tournamentScores: createSeedScores(),
    notifications: createSeedNotifications(),
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = useCallback((email: string, password: string): User | null => {
    const user = state.users.find((u) => u.email === email && u.password === password);
    if (user) {
      setState((prev) => ({ ...prev, currentUser: user }));
      return user;
    }
    return null;
  }, [state.users]);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, currentUser: null }));
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState(updater);
  }, []);

  const addUser = useCallback((user: User) => {
    setState((prev) => ({ ...prev, users: [...prev.users, user] }));
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
    }));
  }, []);

  const addSubscription = useCallback((sub: Subscription) => {
    setState((prev) => ({ ...prev, subscriptions: [...prev.subscriptions, sub] }));
  }, []);

  const updateSubscription = useCallback((subId: string, updates: Partial<Subscription>) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) => (s.id === subId ? { ...s, ...updates } : s)),
    }));
  }, []);

  const updateLane = useCallback((laneId: string, updates: Partial<Lane>) => {
    setState((prev) => ({
      ...prev,
      lanes: prev.lanes.map((l) => (l.id === laneId ? { ...l, ...updates } : l)),
    }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => {
      const newSlots = prev.timeSlots.map((s) => {
        if (s.id === booking.slotId) {
          return { ...s, bookingId: booking.id, status: (booking.type === 'member' ? 'booked_member' : 'booked_outsider') as TimeSlot['status'] };
        }
        return s;
      });
      return { ...prev, bookings: [...prev.bookings, booking], timeSlots: newSlots };
    });
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setState((prev) => {
      const booking = prev.bookings.find((b) => b.id === bookingId);
      if (!booking) return prev;
      const newBookings = prev.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as Booking['status'] } : b));
      const newSlots = prev.timeSlots.map((s) => {
        if (s.bookingId === bookingId) {
          return { ...s, bookingId: null, status: 'available' as TimeSlot['status'] };
        }
        return s;
      });
      return { ...prev, bookings: newBookings, timeSlots: newSlots };
    });
  }, []);

  const addTournament = useCallback((tournament: Tournament) => {
    setState((prev) => {
      const newSlots = prev.timeSlots.map((s) => {
        if (
          tournament.laneIds.includes(s.laneId) &&
          s.date === tournament.date &&
          s.startHour >= tournament.startHour &&
          s.startHour < tournament.endHour &&
          s.status === 'available'
        ) {
          return { ...s, status: 'reserved_tournament' as TimeSlot['status'], tournamentId: tournament.id };
        }
        return s;
      });
      return { ...prev, tournaments: [...prev.tournaments, tournament], timeSlots: newSlots };
    });
  }, []);

  const updateTournament = useCallback((tournamentId: string, updates: Partial<Tournament>) => {
    setState((prev) => ({
      ...prev,
      tournaments: prev.tournaments.map((t) => (t.id === tournamentId ? { ...t, ...updates } : t)),
    }));
  }, []);

  const addTournamentInvites = useCallback((invites: TournamentInvite[]) => {
    setState((prev) => ({ ...prev, tournamentInvites: [...prev.tournamentInvites, ...invites] }));
  }, []);

  const respondToInvite = useCallback((inviteId: string, response: 'accepted' | 'declined') => {
    setState((prev) => ({
      ...prev,
      tournamentInvites: prev.tournamentInvites.map((inv) =>
        inv.id === inviteId ? { ...inv, status: response, respondedAt: new Date().toISOString() } : inv
      ),
    }));
  }, []);

  const addScore = useCallback((score: TournamentScore) => {
    setState((prev) => ({ ...prev, tournamentScores: [...prev.tournamentScores, score] }));
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setState((prev) => ({ ...prev, notifications: [...prev.notifications, notification] }));
  }, []);

  const markNotificationRead = useCallback((notifId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
    }));
  }, []);

  const resetState = useCallback(() => {
    const lanes = createSeedLanes();
    const timeSlots = createSeedTimeSlots(lanes);
    const bookings = createSeedBookings();
    for (const booking of bookings) {
      const matchSlot = timeSlots.find(
        (s) => s.laneId === booking.laneId && s.date === booking.date && s.startHour === booking.startHour
      );
      if (matchSlot) {
        booking.slotId = matchSlot.id;
        matchSlot.bookingId = booking.id;
        matchSlot.status = booking.type === 'member' ? 'booked_member' : 'booked_outsider';
      }
    }
    const tournaments = createSeedTournaments();
    for (const t of tournaments) {
      for (const laneId of t.laneIds) {
        for (let h = t.startHour; h < t.endHour; h++) {
          const slot = timeSlots.find((s) => s.laneId === laneId && s.date === t.date && s.startHour === h);
          if (slot && slot.status === 'available') {
            slot.status = 'reserved_tournament';
            slot.tournamentId = t.id;
          }
        }
      }
    }
    setState({
      currentUser: null,
      users: createSeedUsers(),
      subscriptions: createSeedSubscriptions(),
      lanes,
      timeSlots,
      bookings,
      tournaments,
      tournamentInvites: createSeedInvites(),
      tournamentScores: createSeedScores(),
      notifications: createSeedNotifications(),
    });
  }, []);

  return {
    state,
    login,
    logout,
    updateState,
    addUser,
    updateUser,
    addSubscription,
    updateSubscription,
    updateLane,
    addBooking,
    cancelBooking,
    addTournament,
    updateTournament,
    addTournamentInvites,
    respondToInvite,
    addScore,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    resetState,
  };
}
