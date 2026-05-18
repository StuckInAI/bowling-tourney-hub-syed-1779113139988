import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppContext';
import Button from '@/components/ui/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try admin@bowlbook.com');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>🎳</span>
          <h1 className={styles.title}>BowlBook</h1>
          <p className={styles.subtitle}>Bowling Reservation System</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bowlbook.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="any password"
            />
          </div>
          <Button type="submit" fullWidth>
            Sign In
          </Button>
        </form>
        <div className={styles.demo}>
          <p>Demo accounts:</p>
          <ul>
            <li>admin@bowlbook.com (Super Admin)</li>
            <li>jane@bowlbook.com (Manager)</li>
            <li>bob@bowlbook.com (Staff)</li>
            <li>alice@bowlbook.com (Member)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
