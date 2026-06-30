import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTeacherCourses } from '../../hooks/useTeacherCourses';
import { Toast } from '../../components/Toast/Toast';
import styles from './ProfMesCours.module.css';

export function ProfMesCours() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, deleteCourse } = useTeacherCourses();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('saved') === '1') {
      setToastMsg('Cours enregistré avec succès');
      setToastType('success');
      setShowToast(true);
      navigate('/professeur/mes-cours', { replace: true });
    }
  }, [location.search]);

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  async function handleDelete() {
    if (!selectedId) return;
    if (!window.confirm('Supprimer ce cours définitivement ?')) return;
    await deleteCourse(selectedId);
    setSelectedId(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mes cours</h1>
        <div className={styles.headerActions}>
          {selectedId && (
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Supprimer
            </button>
          )}
          <button className={styles.newBtn} onClick={() => navigate('/professeur/mes-cours/new/edit')}>
            + Nouveau cours
          </button>
        </div>
      </div>

      <div className={styles.card}>
        {courses.map((course) => {
          const isSelected = selectedId === course.id;
          return (
            <div
              key={course.id}
              className={[styles.courseRow, isSelected ? styles.selected : ''].filter(Boolean).join(' ')}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className={styles.thumbnail}
                onClick={() => handleSelect(course.id)}
              />
              <div className={styles.info} onClick={() => handleSelect(course.id)}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{course.title}</span>
                  {course.isPremium && course.price ? (
                    <span className={styles.price}>{course.price} €</span>
                  ) : (
                    <span className={styles.freeLabel}>Gratuit</span>
                  )}
                </div>
                <div className={styles.meta}>
                  {course.chaptersCount} chapitres · {course.lessonsCount} leçons · {course.studentsCount} élèves
                </div>
              </div>
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.btnOutline}
                  onClick={() => navigate(`/cours/${course.id}`)}
                >
                  Voir
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={() => navigate(`/professeur/mes-cours/${course.id}/edit`)}
                >
                  Éditer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showToast && (
        <Toast message={toastMsg} type={toastType} onDone={() => setShowToast(false)} />
      )}
    </div>
  );
}
