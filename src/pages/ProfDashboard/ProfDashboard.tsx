import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../hooks/useTeacher';
import { useTeacherCourses } from '../../hooks/useTeacherCourses';
import { useTeacherMessages } from '../../hooks/useTeacherMessages';
import { studentProgress } from '../../mock/teacherStudentProgress';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { Avatar } from '../../components/Avatar/Avatar';
import styles from './ProfDashboard.module.css';

function formatDate(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date());
}

export function ProfDashboard() {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const { courses } = useTeacherCourses();
  const { conversations } = useTeacherMessages();

  const unreadCount = conversations.filter((c) => c.unread).length;
  const recentConversations = conversations.slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.greeting}>
            Bonjour, <strong>{teacher.firstName}</strong>
          </h1>
          <p className={styles.subtitle}>
            {formatDate()}
            {unreadCount > 0 && (
              <> · <span className={styles.unreadBadge}>{unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</span></>
            )}
          </p>
        </div>
        <button className={styles.newCourseBtn} onClick={() => navigate('/professeur/mes-cours')}>
          + Nouveau cours
        </button>
      </div>

      <div className={styles.topRow}>
        {/* Student progress table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Mes élèves</span>
            <button className={styles.cardLink} onClick={() => navigate('/professeur/eleves')}>
              Voir tous →
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Élève</th>
                <th>Cours en cours</th>
                <th>Progression</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map((entry) => (
                <tr key={entry.studentId}>
                  <td>
                    <div className={styles.studentCell}>
                      <Avatar initials={entry.studentInitials} size={34} />
                      <span className={styles.studentName}>{entry.studentName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.courseNameCell}>{entry.currentCourse}</span>
                  </td>
                  <td>
                    <div className={styles.progressCell}>
                      <div className={styles.progressRow}>
                        <ProgressBar value={entry.progress} />
                        <span className={styles.progressPct}>{entry.progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      className={styles.msgActionBtn}
                      onClick={() => navigate('/professeur/messages')}
                    >
                      💬 Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent messages */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Messages récents</span>
            <button className={styles.cardLink} onClick={() => navigate('/professeur/messages')}>
              Voir tous →
            </button>
          </div>
          <div className={styles.msgList}>
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className={styles.msgItem}
                onClick={() => navigate('/professeur/messages')}
              >
                <Avatar initials={conv.studentInitials} size={38} />
                <div className={styles.msgInfo}>
                  <div className={styles.msgName}>
                    {conv.studentName}
                    {conv.unread && <span className={styles.unreadDot} />}
                  </div>
                  <div className={styles.msgPreview}>{conv.lastMessage}</div>
                </div>
                <span className={styles.msgTime}>{conv.lastMessageTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses list */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Mes cours</span>
          <button className={styles.cardLink} onClick={() => navigate('/professeur/mes-cours')}>
            Voir tous →
          </button>
        </div>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseRow}>
            <img src={course.thumbnail} alt={course.title} className={styles.courseThumbnail} />
            <div className={styles.courseInfo}>
              <div className={styles.courseTitle}>{course.title}</div>
              <div className={styles.courseMeta}>
                {course.chaptersCount} chapitres · {course.lessonsCount} leçons · {course.studentsCount} élèves
              </div>
            </div>
            <div className={styles.courseActions}>
              <button className={styles.btnOutline} onClick={() => navigate('/professeur/mes-cours')}>
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
        ))}
      </div>
    </div>
  );
}
