import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import { LayoutDashboard, Users, Columns3, CalendarDays, Trophy, Bell, Grid3X3, Globe } from 'lucide-react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
};

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['super_admin', 'venue_manager', 'staff', 'member'] },
  { label: 'Members', path: '/members', icon: <Users size={20} />, roles: ['super_admin', 'venue_manager'] },
  { label: 'Lanes', path: '/lanes', icon: <Columns3 size={20} />, roles: ['super_admin', 'venue_manager'] },
  { label: 'Slot Grid', path: '/slot-grid', icon: <Grid3X3 size={20} />, roles: ['super_admin', 'venue_manager', 'staff'] },
  { label: 'Bookings', path: '/bookings', icon: <CalendarDays size={20} />, roles: ['super_admin', 'venue_manager', 'staff', 'member'] },
  { label: 'Tournaments', path: '/tournaments', icon: <Trophy size={20} />, roles: ['super_admin', 'venue_manager', 'staff', 'member'] },
  { label: 'Notifications', path: '/notifications', icon: <Bell size={20} />, roles: ['super_admin', 'venue_manager', 'staff', 'member'] },
  { label: 'Public Slots', path: '/public-slots', icon: <Globe size={20} />, roles: ['super_admin', 'venue_manager', 'staff'] },
];

export default function Sidebar() {
  const { state } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const user = state.currentUser;
  if (!user) return null;

  const filtered = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🎳</span>
        <span className={styles.logoText}>BowlBook</span>
      </div>
      <nav className={styles.nav}>
        {filtered.map((item) => (
          <button
            key={item.path}
            className={clsx(styles.navItem, location.pathname === item.path && styles.active)}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{user.name.charAt(0)}</div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userRole}>{user.role.replace('_', ' ')}</div>
        </div>
      </div>
    </aside>
  );
}
