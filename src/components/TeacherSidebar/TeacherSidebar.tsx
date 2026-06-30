import { NavLink } from 'react-router-dom';
import type { User } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import logoUrl from '../../assets/logo.svg';
import styles from './TeacherSidebar.module.css';

interface TeacherSidebarProps {
  teacher: User;
  hasUnread?: boolean;
}

const navItems = [
  { label: 'Dashboard', to: '/professeur/dashboard' },
  { label: 'Mes cours', to: '/professeur/mes-cours' },
  { label: 'Élèves', to: '/professeur/eleves' },
  { label: 'Communauté', to: '/professeur/communaute' },
  { label: 'Messages', to: '/professeur/messages' },
  { label: 'Achats', to: '/professeur/achats' },
];

export function TeacherSidebar({ teacher, hasUnread = false }: TeacherSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBlock}>
        <img src={logoUrl} alt="AV Guitare Formation" className={styles.logoImg} />
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
            {item.label}
            {item.label === 'Messages' && hasUnread && (
              <span className={styles.unreadDot} />
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <Avatar initials={teacher.initials} size={34} />
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
