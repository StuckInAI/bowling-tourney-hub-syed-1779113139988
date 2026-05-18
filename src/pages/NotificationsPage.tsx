import { useApp } from '@/hooks/useAppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Notification as AppNotification } from '@/types';

export default function NotificationsPage() {
  const { state, markNotificationRead } = useApp();
  const user = state.currentUser;
  if (!user) return null;

  const notifications = state.notifications
    .filter((n: AppNotification) => n.userId === user.id)
    .sort((a: AppNotification, b: AppNotification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Notifications</h1>
      {notifications.length === 0 ? (
        <p style={{ color: 'var(--color-text-light)' }}>No notifications.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map((n: AppNotification) => (
            <Card key={n.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p>{n.message}</p>
                  <small style={{ color: 'var(--color-text-light)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge label={n.type} variant={n.type === 'success' ? 'success' : n.type === 'warning' ? 'warning' : 'info'} />
                  {!n.read && (
                    <Button size="sm" variant="secondary" onClick={() => markNotificationRead(n.id)}>
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
