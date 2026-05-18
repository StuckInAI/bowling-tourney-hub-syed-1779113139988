import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import { Bell, LogOut } from 'lucide-react';
import styles from './TopBar.module.css';

export default function TopBar() {
  const { state, logout } = useApp();
  const navigate = useNavigate();
  const user = state.currentUser;
  if (!user) return null;

  const unreadCount = state.notifications.filter((n) => n.userId === user.id && !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.topbar}>
      <h2 className={styles.greeting}>Welcome back, {user.name.split(' ')[0]}</h2>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => navigate('/notifications')} title="Notifications">
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </button>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
