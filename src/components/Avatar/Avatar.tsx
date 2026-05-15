import styles from './Avatar.module.css';

interface AvatarProps {
  initials: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
}

export function Avatar({ initials, size = 40, bgColor, textColor }: AvatarProps) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {initials}
    </div>
  );
}
