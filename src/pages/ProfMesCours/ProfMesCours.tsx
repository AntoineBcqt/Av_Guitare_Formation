import { useNavigate } from 'react-router-dom';
import { useTeacherCourses } from '../../hooks/useTeacherCourses';
import styles from './ProfMesCours.module.css';

export function ProfMesCours() {
  const navigate = useNavigate();
  const { courses } = useTeacherCourses();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mes cours</h1>
        <button className={styles.newBtn}>+ Nouveau cours</button>
      </div>

      <div className={styles.card}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseRow}>
            <img src={course.thumbnail} alt={course.title} className={styles.thumbnail} />
            <div className={styles.info}>
              <div className={styles.title}>{course.title}</div>
              <div className={styles.meta}>
                {course.chaptersCount} chapitres · {course.lessonsCount} leçons · {course.studentsCount} élèves
              </div>
            </div>
            {course.isPremium && course.price ? (
              <span className={styles.price}>{course.price} €</span>
            ) : (
              <span className={styles.freeLabel}>Gratuit</span>
            )}
            <div className={styles.actions}>
              <button className={styles.btnOutline}>Voir</button>
              <button
                className={styles.btnPrimary}
                onClick={() => navigate(`/professeur/mes-cours/${course.id}/edit`)}
              >
                Éditer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
