import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RoleSwitcher.module.css';

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname.startsWith('/professeur');

  return (
    <button
      className={styles.btn}
      onClick={() => navigate(isTeacher ? '/mon-espace' : '/professeur')}
      title={isTeacher ? 'Basculer vers la vue élève' : 'Basculer vers la vue professeur'}
    >
      {isTeacher ? '👨‍🎓 Vue élève' : '👨‍🏫 Espace professeur'}
    </button>
  );
}
