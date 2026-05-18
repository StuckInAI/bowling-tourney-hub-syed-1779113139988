import { useApp } from '@/hooks/useAppContext';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Users, Columns3, CalendarDays, Trophy } from 'lucide-react';
import type { User, Booking, Lane } from '@/types';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { state } = useApp();

  const totalMembers = state.users.filter((u: User) => u.role === 'member').length;
  const activeLanes = state.lanes.filter((l: Lane) => l.status === 'available').length;
  const todayBookings = state.bookings.filter(
    (b: Booking) => b.date === new Date().toISOString().split('T')[0] && b.status !== 'cancelled'
  ).length;
  const upcomingTournaments = state.tournaments.filter((t) => t.status === 'upcoming').length;

  const recentBookings = state.bookings
    .filter((b: Booking) => b.status !== 'cancelled')
    .sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Dashboard</h1>
      <div className={styles.statsGrid}>
        <StatCard icon={<Users size={24} />} label="Total Members" value={totalMembers} />
        <StatCard icon={<Columns3 size={24} />} label="Available Lanes" value={activeLanes} color="#22c55e" />
        <StatCard icon={<CalendarDays size={24} />} label="Today's Bookings" value={todayBookings} color="#f59e0b" />
        <StatCard icon={<Trophy size={24} />} label="Upcoming Tournaments" value={upcomingTournaments} color="#8b5cf6" />
      </div>

      <div className={styles.sections}>
        <Card>
          <h3 style={{ marginBottom: 12 }}>Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>No bookings yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Lane</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b: Booking) => {
                  const member = state.users.find((u: User) => u.id === b.userId);
                  const lane = state.lanes.find((l: Lane) => l.id === b.laneId);
                  return (
                    <tr key={b.id}>
                      <td>{member?.name || 'Unknown'}</td>
                      <td>{lane?.name || 'Unknown'}</td>
                      <td>{b.date}</td>
                      <td><Badge label={b.status} variant={b.status === 'confirmed' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <h3 style={{ marginBottom: 12 }}>Lane Status</h3>
          <div className={styles.laneList}>
            {state.lanes.map((lane: Lane) => (
              <div key={lane.id} className={styles.laneItem}>
                <span>{lane.name}</span>
                <Badge
                  label={lane.status}
                  variant={lane.status === 'available' ? 'success' : lane.status === 'maintenance' ? 'warning' : 'danger'}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
