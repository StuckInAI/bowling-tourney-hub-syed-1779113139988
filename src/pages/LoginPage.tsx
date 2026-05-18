import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Button from '@/components/ui/Button';
import ToastContainer, { showToast } from '@/components/ui/Toast';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, state } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (state.currentUser) {
    navigate('/dashboard', { replace: true });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      showToast('Login successful!', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } else {
      showToast('Invalid email or password.', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.logo}>🎳</span>
          <h1 className={styles.title}>BowlBook</h1>
          <p className={styles.subtitle}>Bowling Reservation & Tournament Management</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="admin@bowling.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" fullWidth size="lg">Sign In</Button>
        </form>
        <div className={styles.demo}>
          <p className={styles.demoTitle}>Demo Accounts:</p>
          <div className={styles.demoList}>
            <span>admin@bowling.com / admin123</span>
            <span>manager@bowling.com / manager123</span>
            <span>staff@bowling.com / staff123</span>
            <span>alice@example.com / member123</span>
          </div>
        </div>
        <div className={styles.publicLink}>
          <button className={styles.linkBtn} onClick={() => navigate('/public-slots')}>View Public Slots →</button>
        </div>
      </div>
    </div>
  );
}
