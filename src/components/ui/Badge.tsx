import clsx from 'clsx';
import styles from './Badge.module.css';

type BadgeProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
};

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[variant])}>{label}</span>;
}
