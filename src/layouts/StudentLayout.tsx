import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar/Navbar';
import { useAuthContext } from '../contexts/AuthContext';
import styles from './StudentLayout.module.css';

export function StudentLayout() {
  const { user } = useAuthContext();

  return (
    <div className={styles.layout}>
      <Navbar user={user} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
