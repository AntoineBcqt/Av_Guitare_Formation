import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { getRecommendedCourse } from '../../utils/courseUtils';
import styles from './Dashboard.module.css';

function formatDate(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export function Dashboard() {
  const { user } = useAuth();
  const { courses, userCourses, getCourseById } = useCourses();
  const navigate = useNavigate();

  const mainUserCourse = userCourses[0];
  const mainCourse = mainUserCourse ? getCourseById(mainUserCourse.courseId) : undefined;

  const otherUserCourses = userCourses
    .filter((uc) => uc.courseId !== mainUserCourse?.courseId)
    .map((uc) => ({ course: getCourseById(uc.courseId), userCourse: uc }))
    .filter((item): item is { course: NonNullable<typeof item.course>; userCourse: typeof item.userCourse } =>
      item.course != null
    );

  const recommended = getRecommendedCourse(courses, userCourses);

  const totalLessons = mainCourse?.lessonsCount ?? 10;

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.greeting}>
            Bonjour, <em>{user.firstName}</em>
          </h1>
          <p className={styles.date}>{formatDate()} · Continuez sur votre lancée !</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftCol}>
          {mainCourse && mainUserCourse && (
            <div className={styles.mainCourseCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.courseLabel}>
                  Cours en cours
                  <span className={styles.coursePct}>· {mainUserCourse.progress}% terminé</span>
                </div>
                <button className={styles.resumeBtn} onClick={() => navigate(`/mon-espace/cours/${mainCourse.id}`)}>
                  Reprendre le cours →
                </button>
              </div>
              <h2 className={styles.courseTitle}>{mainCourse.title}</h2>
              <p className={styles.courseMeta}>
                Vous êtes à la leçon {mainUserCourse.completedLessons + 1} sur {mainCourse.lessonsCount} · Chapitre {mainUserCourse.currentChapter}
              </p>

              <div className={styles.trackerLabel}>Progression des leçons</div>
              <div className={styles.tracker}>
                {Array.from({ length: totalLessons }, (_, i) => {
                  const num = i + 1;
                  const isCompleted = num <= mainUserCourse.completedLessons;
                  const isCurrent = num === mainUserCourse.completedLessons + 1;
                  return (
                    <div key={num} className={styles.trackerStep}>
                      {i > 0 && (
                        <div
                          className={[styles.stepLine, isCompleted ? styles.completed : ''].filter(Boolean).join(' ')}
                        />
                      )}
                      <div
                        className={[
                          styles.stepCircle,
                          isCompleted ? styles.completed : '',
                          isCurrent ? styles.current : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {isCompleted ? '✓' : num}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.otherCoursesCard}>
            <h2 className={styles.sectionTitle}>Mes autres cours</h2>
            <div className={styles.otherCoursesList}>
              {otherUserCourses.map(({ course, userCourse }) => (
                <div key={course.id} className={styles.otherCourseCard}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className={styles.otherCourseThumbnail}
                  />
                  <div className={styles.otherCourseInfo}>
                    <div className={styles.otherCourseTitle}>{course.title}</div>
                    <div className={styles.otherCourseMeta}>
                      Chapitre {userCourse.currentChapter} · Leçon {userCourse.completedLessons + 1}
                    </div>
                    <ProgressBar value={userCourse.progress} />
                    <div className={styles.otherCourseProgress}>{userCourse.progress}% · {userCourse.completedLessons}/{course.lessonsCount}</div>
                  </div>
                  <button
                    className={styles.otherCourseResume}
                    onClick={() => navigate(`/mon-espace/cours/${course.id}`)}
                  >
                    Reprendre le cours →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recommended && (
          <div className={styles.recommendCard}>
            <div className={styles.recommendLabel}>Recommandé</div>
            <div className={styles.recommendTitle}>{recommended.title}</div>
            <div className={styles.recommendSub}>
              Basé sur votre niveau · <strong>{recommended.price} €</strong>
            </div>
            <button className={styles.recommendBtn} onClick={() => navigate(`/cours/${recommended.id}`)}>
              Découvrir le cours →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
