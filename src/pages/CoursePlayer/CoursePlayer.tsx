import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { LessonSidebar } from '../../components/LessonSidebar/LessonSidebar';
import type { Lesson } from '../../types';
import styles from './CoursePlayer.module.css';

function findLesson(chapters: { id: string; title: string; lessons: Lesson[] }[], lessonId: string) {
  for (let ci = 0; ci < chapters.length; ci++) {
    const ch = chapters[ci];
    for (let li = 0; li < ch.lessons.length; li++) {
      if (ch.lessons[li].id === lessonId) {
        return { lesson: ch.lessons[li], chapterIndex: ci + 1, lessonIndex: li + 1, chapterTitle: ch.title };
      }
    }
  }
  return null;
}

const lessonTexts = [
  'Dans cette leçon, nous allons explorer les fondements essentiels qui vous permettront de progresser rapidement. Prenez le temps de bien assimiler chaque concept avant de passer à la suite.',
  'La guitare est un instrument qui demande de la régularité. 20 minutes par jour valent mieux que 3 heures le week-end. Cette leçon vous donnera les clés pour structurer votre pratique quotidienne.',
  'Écoutez attentivement les exemples audio et essayez de reproduire ce que vous entendez. L\'oreille musicale se développe progressivement, soyez patient avec vous-même.',
];

const resources = [
  { name: 'Partition de la leçon', size: '1.2 MB', icon: '📄' },
  { name: 'Backing track (MP3)', size: '4.8 MB', icon: '🎵' },
  { name: 'Guide technique PDF', size: '2.1 MB', icon: '📄' },
];

export function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById, getUserCourse } = useCourses();
  const navigate = useNavigate();

  const course = courseId ? getCourseById(courseId) : undefined;
  const userCourse = courseId ? getUserCourse(courseId) : undefined;

  const firstLessonId = course?.chapters[0]?.lessons[0]?.id ?? '';
  const [activeLessonId, setActiveLessonId] = useState(firstLessonId);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Cours introuvable.</p>
        <button onClick={() => navigate('/cours')} style={{ marginTop: 16, color: 'var(--color-gold)' }}>
          ← Retour au catalogue
        </button>
      </div>
    );
  }

  const found = findLesson(course.chapters, activeLessonId);
  const currentLesson = found?.lesson;
  const chapterIndex = found?.chapterIndex ?? 1;
  const lessonIndex = found?.lessonIndex ?? 1;

  return (
    <div className={styles.container}>
      {sidebarOpen && (
        <LessonSidebar
          course={course}
          userCourse={userCourse}
          activeLessonId={activeLessonId}
          onLessonSelect={setActiveLessonId}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div className={styles.mainContent}>
        <div className={styles.videoZone}>
          <div className={styles.videoPlaceholder} />
          {!sidebarOpen && (
            <button className={styles.toggleSidebarBtn} onClick={() => setSidebarOpen(true)}>
              ☰ Leçons
            </button>
          )}
          <button className={styles.playBtn} aria-label="Lancer la vidéo">
            ▶
          </button>
          {currentLesson && (
            <div className={styles.videoTitle}>{currentLesson.title}</div>
          )}
        </div>

        <div className={styles.lessonBody}>
          <div className={styles.breadcrumb}>
            Chapitre {chapterIndex} · Leçon {lessonIndex}
          </div>
          <h1 className={styles.lessonTitle}>
            {currentLesson?.title ?? 'Sélectionnez une leçon'}
          </h1>

          {lessonTexts.map((text, i) => (
            <p key={i} className={styles.lessonText}>{text}</p>
          ))}

          <div className={styles.resourcesBlock}>
            <div className={styles.resourcesTitle}>Ressources de la leçon</div>
            {resources.map((r) => (
              <div key={r.name} className={styles.resourceItem}>
                <div className={styles.resourceIcon}>{r.icon}</div>
                <div className={styles.resourceInfo}>
                  <div className={styles.resourceName}>{r.name}</div>
                  <div className={styles.resourceSize}>{r.size}</div>
                </div>
                <button className={styles.resourceLink}>Voir</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
