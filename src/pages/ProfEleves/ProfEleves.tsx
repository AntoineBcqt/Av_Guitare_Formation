import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../../types/teacher';
import { useStudents } from '../../hooks/useStudents';
import { Avatar } from '../../components/Avatar/Avatar';
import styles from './ProfEleves.module.css';

const PALETTE = [
  '#1B2E3C', '#C8922A', '#2E7D32', '#1565C0',
  '#6A1B9A', '#AD1457', '#00695C', '#E65100',
  '#3E2723', '#880E4F',
];

function avatarColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function ProfEleves() {
  const navigate = useNavigate();
  const { students, banStudent, searchStudents } = useStudents();
  const [query, setQuery] = useState('');

  const displayed: Student[] = searchStudents(query);

  function handleBan(student: Student) {
    if (window.confirm(`Bannir ${student.firstName} ${student.lastName} de la plateforme ?`)) {
      banStudent(student.id);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Élèves</h1>
        <p className={styles.pageCount}>{students.length} élève{students.length !== 1 ? 's' : ''} inscrits</p>
      </div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Rechercher un élève par nom ou email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {displayed.length === 0 ? (
          <div className={styles.emptyState}>Aucun élève ne correspond à votre recherche.</div>
        ) : (
          displayed.map((student) => (
            <div key={student.id} className={styles.card}>
              <div className={styles.cardTop}>
                <Avatar
                  initials={student.initials}
                  size={44}
                  bgColor={avatarColor(student.initials)}
                />
                <div className={styles.nameBlock}>
                  <div className={styles.studentName}>
                    {student.firstName} {student.lastName}
                  </div>
                  <span className={styles.enrolledBadge}>Inscrit le {student.enrolledAt}</span>
                </div>
              </div>
              <div className={styles.email}>{student.email}</div>
              <div className={styles.coursesCount}>
                <strong>{student.coursesCount}</strong> cours inscrit{student.coursesCount !== 1 ? 's' : ''}
              </div>
              <div className={styles.divider} />
              <div className={styles.actions}>
                <button className={styles.banBtn} onClick={() => handleBan(student)}>
                  Bannir
                </button>
                <button className={styles.msgBtn} onClick={() => navigate('/professeur/messages')}>
                  Envoyer un message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
