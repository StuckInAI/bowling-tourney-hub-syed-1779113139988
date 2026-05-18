import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
};

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={color ? { background: color } : undefined}>{icon}</div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
