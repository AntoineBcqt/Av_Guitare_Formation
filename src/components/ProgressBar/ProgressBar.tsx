import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  variant?: 'navy' | 'gold' | 'success';
  showLabel?: boolean;
}

export function ProgressBar({ value, variant = 'navy', showLabel = false }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const fillClass = [
    styles.fill,
    variant === 'gold' ? styles.gold : '',
    variant === 'success' ? styles.success : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div className={fillClass} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <div className={styles.label}>{pct}% terminé</div>}
    </div>
  );
}
