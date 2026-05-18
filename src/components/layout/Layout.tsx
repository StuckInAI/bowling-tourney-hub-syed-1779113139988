import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import styles from './Layout.module.css';

export default function Layout() {
  const { state } = useApp();
  if (!state.currentUser) return <Navigate to="/login" replace />;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
