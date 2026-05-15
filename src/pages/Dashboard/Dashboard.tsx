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

  const mainUserCourse = userCourses.find((uc) => uc.courseId === 'c1');
  const mainCourse = mainUserCourse ? getCourseById(mainUserCourse.courseId) : undefined;

  const otherUserCourses = userCourses
    .filter((uc) => uc.courseId !== 'c1')
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
          <div className={styles.date}>{formatDate()}</div>
          <h1 className={styles.greeting}>
            Bonjour, <em>{user.firstName}</em> 👋
          </h1>
          <p className={styles.heroSub}>Continuez sur votre lancée !</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftCol}>
          {mainCourse && mainUserCourse && (
            <div className={styles.mainCourseCard}>
              <div className={styles.courseLabel}>
                Cours en cours
                <span className={styles.coursePct}>· {mainUserCourse.progress}% terminé</span>
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

              <button className={styles.resumeBtn} onClick={() => navigate(`/cours/${mainCourse.id}`)}>
                Reprendre le cours →
              </button>
            </div>
          )}

          <div>
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
                      Ch.{userCourse.currentChapter} · Leçon {userCourse.completedLessons + 1} · {userCourse.progress}%
                    </div>
                    <ProgressBar value={userCourse.progress} />
                  </div>
                  <button
                    className={styles.otherCourseResume}
                    onClick={() => navigate(`/cours/${course.id}`)}
                  >
                    Reprendre
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recommended && (
          <div className={styles.recommendCard}>
            <div className={styles.recommendLabel}>Recommandé</div>
            <img src={recommended.thumbnail} alt={recommended.title} className={styles.recommendImg} />
            <div className={styles.recommendTitle}>{recommended.title}</div>
            <div className={styles.recommendSub}>
              Basé sur votre niveau · {recommended.price} €
            </div>
            <button className={styles.recommendBtn} onClick={() => navigate('/cours')}>
              Découvrir le cours →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
