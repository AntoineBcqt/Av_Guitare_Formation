import { useNavigate } from 'react-router-dom';
import type { Course, UserCourse } from '../../types';
import styles from './LessonSidebar.module.css';

interface LessonSidebarProps {
  course: Course;
  userCourse?: UserCourse;
  activeLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  onClose: () => void;
}

export function LessonSidebar({
  course,
  userCourse,
  activeLessonId,
  onLessonSelect,
  onClose,
}: LessonSidebarProps) {
  const navigate = useNavigate();
  const progress = userCourse?.progress ?? 0;
  const completedLessons = userCourse?.completedLessons ?? 0;

  let globalLessonIndex = 0;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/cours')}>
          ← Retour
        </button>
        <div className={styles.courseTitle}>{course.title}</div>
        <div className={styles.progress}>
          {completedLessons} / {course.lessonsCount} leçons · {progress}%
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.chapterList}>
        {course.chapters.map((chapter) => (
          <div key={chapter.id}>
            <div className={styles.chapterTitle}>{chapter.title}</div>
            {chapter.lessons.map((lesson) => {
              globalLessonIndex++;
              const isActive = lesson.id === activeLessonId;
              const itemClass = [
                styles.lessonItem,
                isActive ? styles.active : '',
                lesson.locked ? styles.locked : '',
              ]
                .filter(Boolean)
                .join(' ');

              const iconClass = [
                styles.lessonIcon,
                lesson.completed ? styles.completed : '',
                isActive && !lesson.completed ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={lesson.id}
                  className={itemClass}
                  onClick={() => !lesson.locked && onLessonSelect(lesson.id)}
                >
                  <div className={iconClass}>
                    {lesson.completed ? '✓' : globalLessonIndex}
                  </div>
                  <div className={styles.lessonInfo}>
                    <div className={styles.lessonTitle}>{lesson.title}</div>
                    <div className={styles.lessonDuration}>{lesson.duration}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.closeBtn} onClick={onClose}>
          Fermer le panneau
        </button>
      </div>
    </aside>
  );
}
