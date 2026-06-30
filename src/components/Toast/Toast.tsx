import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onDone: () => void;
}

export function Toast({ message, type = 'success', onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(onDone, 3100);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, []);

  return (
    <div className={[styles.toast, styles[type], visible ? styles.show : ''].join(' ')}>
      <span className={styles.dot} />
      {message}
    </div>
  );
}
