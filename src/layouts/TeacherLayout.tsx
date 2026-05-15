import { Outlet } from 'react-router-dom';
import { TeacherSidebar } from '../components/TeacherSidebar/TeacherSidebar';
import { useTeacher } from '../hooks/useTeacher';
import { useTeacherMessages } from '../hooks/useTeacherMessages';
import styles from './TeacherLayout.module.css';

export function TeacherLayout() {
  const { teacher } = useTeacher();
  const { conversations } = useTeacherMessages();
  const hasUnread = conversations.some((c) => c.unread);

  return (
    <div className={styles.layout}>
      <TeacherSidebar teacher={teacher} hasUnread={hasUnread} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
