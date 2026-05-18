import type { ReactNode, MouseEvent, CSSProperties } from 'react';
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
  style?: CSSProperties;
};

export default function Button({ children, variant = 'primary', size = 'md', disabled = false, fullWidth = false, type = 'button', onClick, style }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.btn, styles[variant], styles[size], fullWidth && styles.fullWidth)}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
