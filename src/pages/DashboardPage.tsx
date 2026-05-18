import { useApp } from '@/hooks/useAppContext';
import { Users, CalendarDays, Trophy, TrendingUp, Clock, CreditCard } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, formatHour, isSubscriptionActive } from '@/lib/utils';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { state } = useApp();
  const user = state.currentUser;
  if (!user) return null;

  const isAdmin = user.role === 'super_admin' || user.role === 'venue_manager';
  const isStaff = user.role === 'staff';
  const isMember = user.role === 'member';

  const activeMembers = state.users.filter((u) => u.role === 'member').filter((u) => {
    const sub = state.subscriptions.find((s) => s.userId === u.id);
    return isSubscriptionActive(sub);
  });

  const totalBookings = state.bookings.filter((b) => b.status !== 'cancelled').length;
  const outsiderBookings = state.bookings.filter((b) => b.type === 'outsider' && b.status !== 'cancelled').length;
  const upcomingTournaments = state.tournaments.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length;

  if (isAdmin) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        <div className={styles.statsGrid}>
          <StatCard icon={<Users size={22} />} label="Active Members" value={activeMembers.length} color="#3b82f6" />
          <StatCard icon={<CalendarDays size={22} />} label="Total Bookings" value={totalBookings} color="#16a34a" />
          <StatCard icon={<Trophy size={22} />} label="Active Tournaments" value={upcomingTournaments} color="#f97316" />
          <StatCard icon={<CreditCard size={22} />} label="Outsider Bookings" value={outsiderBookings} color="#8b5cf6" />
        </div>
        <div className={styles.gridTwo}>
          <Card>
            <h3 className={styles.cardTitle}>Recent Bookings</h3>
            {state.bookings.filter((b) => b.status !== 'cancelled').slice(0, 5).map((b) => (
              <div key={b.id} className={styles.listItem}>
                <div>
                  <strong>{b.type === 'member' ? state.users.find((u) => u.id === b.userId)?.name || 'Member' : b.outsiderName || 'Outsider'}</strong>
                  <div className={styles.listMeta}>
                    Lane {state.lanes.find((l) => l.id === b.laneId)?.number} · {formatDate(b.date)} · {formatHour(b.startHour)}
                  </div>
                </div>
                <Badge label={b.type} variant={b.type === 'member' ? 'info' : 'purple'} />
              </div>
            ))}
          </Card>
          <Card>
            <h3 className={styles.cardTitle}>Upcoming Tournaments</h3>
            {state.tournaments.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').map((t) => {
              const accepted = state.tournamentInvites.filter((i) => i.tournamentId === t.id && i.status === 'accepted').length;
              return (
                <div key={t.id} className={styles.listItem}>
                  <div>
                    <strong>{t.name}</strong>
                    <div className={styles.listMeta}>{formatDate(t.date)} · {accepted}/{t.maxParticipants} participants</div>
                  </div>
                  <Badge label={t.status.replace('_', ' ')} variant="warning" />
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  if (isStaff) {
    const todayBookings = state.bookings.filter((b) => {
      const today = new Date().toISOString().split('T')[0];
      return b.date === today && b.status !== 'cancelled';
    });
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Staff Dashboard</h1>
        <div className={styles.statsGrid}>
          <StatCard icon={<Clock size={22} />} label="Today's Bookings" value={todayBookings.length} color="#3b82f6" />
          <StatCard icon={<Trophy size={22} />} label="Active Tournaments" value={upcomingTournaments} color="#f97316" />
        </div>
        <Card>
          <h3 className={styles.cardTitle}>Today&apos;s Schedule</h3>
          {todayBookings.length === 0 && <p className={styles.empty}>No bookings today.</p>}
          {todayBookings.map((b) => (
            <div key={b.id} className={styles.listItem}>
              <div>
                <strong>{b.type === 'member' ? state.users.find((u) => u.id === b.userId)?.name || 'Member' : b.outsiderName || 'Outsider'}</strong>
                <div className={styles.listMeta}>
                  Lane {state.lanes.find((l) => l.id === b.laneId)?.number} · {formatHour(b.startHour)} - {formatHour(b.endHour)}
                </div>
              </div>
              <Badge label={b.status.replace('_', ' ')} variant={b.status === 'confirmed' ? 'success' : 'warning'} />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (isMember) {
    const mySub = state.subscriptions.find((s) => s.userId === user.id);
    const myBookings = state.bookings.filter((b) => b.userId === user.id && b.status !== 'cancelled');
    const myInvites = state.tournamentInvites.filter((i) => i.userId === user.id);
    const pendingInvites = myInvites.filter((i) => i.status === 'pending');

    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>My Dashboard</h1>
        <div className={styles.statsGrid}>
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Subscription"
            value={isSubscriptionActive(mySub) ? 'Active' : 'Inactive'}
            color={isSubscriptionActive(mySub) ? '#16a34a' : '#dc2626'}
          />
          <StatCard icon={<CalendarDays size={22} />} label="My Bookings" value={myBookings.length} color="#3b82f6" />
          <StatCard icon={<Trophy size={22} />} label="Tournament Invites" value={myInvites.length} color="#f97316" />
          <StatCard icon={<Clock size={22} />} label="Pending Invites" value={pendingInvites.length} color="#8b5cf6" />
        </div>
        <div className={styles.gridTwo}>
          <Card>
            <h3 className={styles.cardTitle}>My Bookings</h3>
            {myBookings.length === 0 && <p className={styles.empty}>No bookings yet.</p>}
            {myBookings.slice(0, 5).map((b) => (
              <div key={b.id} className={styles.listItem}>
                <div>
                  <div className={styles.listMeta}>
                    Lane {state.lanes.find((l) => l.id === b.laneId)?.number} · {formatDate(b.date)} · {formatHour(b.startHour)}
                  </div>
                </div>
                <Badge label={b.status} variant={b.status === 'confirmed' ? 'success' : 'warning'} />
              </div>
            ))}
          </Card>
          <Card>
            <h3 className={styles.cardTitle}>Tournament Invites</h3>
            {myInvites.length === 0 && <p className={styles.empty}>No invites yet.</p>}
            {myInvites.map((inv) => {
              const t = state.tournaments.find((tt) => tt.id === inv.tournamentId);
              return (
                <div key={inv.id} className={styles.listItem}>
                  <div>
                    <strong>{t?.name || 'Tournament'}</strong>
                    <div className={styles.listMeta}>{t ? formatDate(t.date) : ''}</div>
                  </div>
                  <Badge
                    label={inv.status}
                    variant={inv.status === 'accepted' ? 'success' : inv.status === 'declined' ? 'danger' : 'warning'}
                  />
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
