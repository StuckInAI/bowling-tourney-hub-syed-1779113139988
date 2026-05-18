import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from '@/hooks/useAppState';
import { AppContext } from '@/hooks/useAppContext';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import MembersPage from '@/pages/MembersPage';
import LanesPage from '@/pages/LanesPage';
import BookingsPage from '@/pages/BookingsPage';
import TournamentsPage from '@/pages/TournamentsPage';
import TournamentDetailPage from '@/pages/TournamentDetailPage';
import PublicSlotsPage from '@/pages/PublicSlotsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SlotGridPage from '@/pages/SlotGridPage';
import Layout from '@/components/layout/Layout';

export default function App() {
  const appState = useAppState();

  return (
    <AppContext.Provider value={appState}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public-slots" element={<PublicSlotsPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/lanes" element={<LanesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/slot-grid" element={<SlotGridPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppContext.Provider>
  );
}
