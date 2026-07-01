import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TeacherSidebar } from '../components/TeacherSidebar/TeacherSidebar';
import { useTeacher } from '../hooks/useTeacher';
import { useTeacherMessages } from '../hooks/useTeacherMessages';
import logoUrl from '../assets/logo.svg';
import styles from './TeacherLayout.module.css';

export function TeacherLayout() {
  const { teacher } = useTeacher();
  const { conversations } = useTeacherMessages(teacher.id);
  const hasUnread = conversations.some((c) => c.unread);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={styles.mobileHeader}>
        <button
          className={styles.burgerBtn}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={sidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <img src={logoUrl} alt="AV Guitare Formation" className={styles.mobileLogo} />
      </div>

      <TeacherSidebar
        teacher={teacher}
        hasUnread={hasUnread}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
