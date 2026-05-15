import { NavLink } from 'react-router-dom';
import type { TeacherUser } from '../../types/teacher';
import { Avatar } from '../Avatar/Avatar';
import styles from './TeacherSidebar.module.css';

interface TeacherSidebarProps {
  teacher: TeacherUser;
  hasUnread?: boolean;
}

const navItems = [
  { label: 'Dashboard', to: '/professeur/dashboard', icon: '⊞' },
  { label: 'Mes cours', to: '/professeur/mes-cours', icon: '📚' },
  { label: 'Élèves', to: '/professeur/eleves', icon: '👥' },
  { label: 'Communauté', to: '/professeur/communaute', icon: '💬' },
  { label: 'Messages', to: '/professeur/messages', icon: '✉️' },
];

export function TeacherSidebar({ teacher, hasUnread = false }: TeacherSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <div className={styles.logoRow}>
          <span className={styles.logoIcon}>🎸</span>
          <span className={styles.logoText}>Guitare Formation</span>
        </div>
        <span className={styles.roleLabel}>Espace professeur</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.active : ''].filter(Boolean).join(' ')
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
            {item.label === 'Messages' && hasUnread && (
              <span className={styles.unreadDot} />
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerAvatar}>
          <Avatar initials={teacher.initials} size={34} />
        </div>
        <div className={styles.footerInfo}>
          <div className={styles.footerName}>
            {teacher.firstName} {teacher.lastName}
          </div>
          <div className={styles.footerRole}>Professeur</div>
        </div>
      </div>
    </aside>
  );
}
