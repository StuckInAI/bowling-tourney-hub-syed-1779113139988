import type { ReactNode, MouseEvent } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({ children, variant = 'primary', size = 'md', disabled = false, fullWidth = false, type = 'button', onClick }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.btn, styles[variant], styles[size], fullWidth && styles.fullWidth)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
