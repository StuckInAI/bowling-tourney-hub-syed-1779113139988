import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { state, markNotificationRead, markAllNotificationsRead } = useApp();
  const user = state.currentUser;
  if (!user) return null;

  const userNotifications = state.notifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Notifications</h1>
          {unreadCount > 0 && <Badge label={`${unreadCount} unread`} variant="danger" />}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
            <CheckCheck size={16} /> Mark All Read
          </Button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-light)' }}>
            <Bell size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>No notifications yet</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {userNotifications.map((n) => (
            <Card key={n.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 15 }}>{n.title}</h3>
                    {!n.read && <Badge label="New" variant="info" />}
                  </div>
                  <p style={{ color: 'var(--color-text-light)', fontSize: 14, marginBottom: 4 }}>{n.message}</p>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                {!n.read && (
                  <Button variant="ghost" size="sm" onClick={() => markNotificationRead(n.id)}>
                    <Check size={16} />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
