import { useNavigate } from 'react-router-dom';
import type { Course, UserCourse } from '../../types';
import styles from './CourseCard.module.css';

interface CourseCardProps {
  course: Course;
  userCourse?: UserCourse;
  isOwned: boolean;
  onPremiumClick: (course: Course) => void;
}

export function CourseCard({ course, userCourse, isOwned, onPremiumClick }: CourseCardProps) {
  const navigate = useNavigate();
  const isPremiumLocked = course.isPremium && !isOwned;

  function handleActionClick() {
    if (isPremiumLocked) {
      onPremiumClick(course);
    } else {
      navigate(`/cours/${course.id}`);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={course.thumbnail} alt={course.title} className={styles.image} />
        {isPremiumLocked && (
          <div className={styles.overlay}>
            <span className={styles.lockIcon}>🔒</span>
          </div>
        )}
        <span className={styles.levelBadge}>{course.level}</span>
        {course.isPremium && course.price && (
          <span className={styles.priceBadge}>{course.price} €</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.lessonsCount}>{course.lessonsCount} leçons</div>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.footer}>
          <span className={styles.meta}>
            {course.lessonsCount} leçons · {course.totalDuration}
          </span>
          {isOwned ? (
            <button className={styles.btnContinue} onClick={handleActionClick}>
              {userCourse ? 'Continuer' : 'Commencer'}
            </button>
          ) : (
            <button className={styles.btnLock} onClick={handleActionClick} title="Cours premium">
              🔒
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
