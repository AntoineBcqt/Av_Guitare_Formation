import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacherCourses } from '../../hooks/useTeacherCourses';
import type { Chapter, Lesson } from '../../types';
import styles from './ProfCourseEditor.module.css';

type BlockType = 'heading' | 'text' | 'image';

let lessonIdCounter = 5000;
let chapterIdCounter = 500;

const DEFAULT_FIRST_LESSON: Lesson = {
  id: 'new-l1',
  title: 'Introduction',
  duration: '15 min',
  completed: false,
  locked: false,
};

const DEFAULT_FIRST_CHAPTER: Chapter = {
  id: 'new-ch1',
  title: 'Chapitre 1',
  lessons: [DEFAULT_FIRST_LESSON],
};

function buildInitialLessonContents(chapters: Chapter[]): Record<string, string> {
  const contents: Record<string, string> = {};
  for (const ch of chapters) {
    for (const lesson of ch.lessons) {
      contents[lesson.id] = '';
    }
  }
  return contents;
}

export function ProfCourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { fetchCourseById, addCourse, updateCourse } = useTeacherCourses();

  const isNew = courseId === 'new';

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>(isNew ? [DEFAULT_FIRST_CHAPTER] : []);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    isNew ? DEFAULT_FIRST_LESSON.id : ''
  );
  const [lessonContents, setLessonContents] = useState<Record<string, string>>(
    isNew ? { [DEFAULT_FIRST_LESSON.id]: '' } : {}
  );
  const [lessonTitles, setLessonTitles] = useState<Record<string, string>>(
    isNew ? { [DEFAULT_FIRST_LESSON.id]: DEFAULT_FIRST_LESSON.title } : {}
  );
  const [showBlockToolbar, setShowBlockToolbar] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(!isNew);

  useEffect(() => {
    if (isNew || !courseId) return;
    setLoadingCourse(true);
    fetchCourseById(courseId).then((fetched) => {
      if (!fetched) { setLoadingCourse(false); return; }
      setCourseTitle(fetched.title);
      setCourseDescription(fetched.description ?? '');
      setIsPaid(!!fetched.price);
      setPrice(fetched.price?.toString() ?? '');
      setChapters(fetched.chapters);
      setSelectedLessonId(fetched.chapters[0]?.lessons[0]?.id ?? '');
      setLessonContents(buildInitialLessonContents(fetched.chapters));
      setLessonTitles(() => {
        const map: Record<string, string> = {};
        for (const ch of fetched.chapters) {
          for (const l of ch.lessons) { map[l.id] = l.title; }
        }
        return map;
      });
      setLoadingCourse(false);
    });
  }, [courseId]);

  if (!isNew && loadingCourse) return null;

  const selectedLesson = chapters
    .flatMap((ch) => ch.lessons)
    .find((l) => l.id === selectedLessonId);

  let globalLessonNum = 0;

  function getChapterAndLessonIndex(lessonId: string) {
    for (let ci = 0; ci < chapters.length; ci++) {
      for (let li = 0; li < chapters[ci].lessons.length; li++) {
        if (chapters[ci].lessons[li].id === lessonId) {
          return { chapterIndex: ci + 1, lessonIndex: li + 1 };
        }
      }
    }
    return { chapterIndex: 1, lessonIndex: 1 };
  }

  function addLesson(chapterId: string) {
    const newLesson: Lesson = {
      id: `new-l${lessonIdCounter++}`,
      title: 'Nouvelle leçon',
      duration: '15 min',
      completed: false,
      locked: false,
    };
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch
      )
    );
    setLessonTitles((prev) => ({ ...prev, [newLesson.id]: newLesson.title }));
    setLessonContents((prev) => ({ ...prev, [newLesson.id]: '' }));
    setSelectedLessonId(newLesson.id);
  }

  function addChapter() {
    const newLesson: Lesson = {
      id: `new-l${lessonIdCounter++}`,
      title: 'Première leçon',
      duration: '15 min',
      completed: false,
      locked: false,
    };
    const newChapter: Chapter = {
      id: `new-ch${chapterIdCounter++}`,
      title: 'Nouveau chapitre',
      lessons: [newLesson],
    };
    setChapters((prev) => [...prev, newChapter]);
    setLessonTitles((prev) => ({ ...prev, [newLesson.id]: newLesson.title }));
    setLessonContents((prev) => ({ ...prev, [newLesson.id]: '' }));
    setSelectedLessonId(newLesson.id);
  }

  function insertBlock(type: BlockType) {
    const current = lessonContents[selectedLessonId] ?? '';
    const additions: Record<BlockType, string> = {
      heading: '\n\n## Nouveau titre de section\n',
      text: '\n\nNouveau paragraphe de contenu pédagogique...\n',
      image: '\n\n[Image : description de l\'image]\n',
    };
    setLessonContents((prev) => ({
      ...prev,
      [selectedLessonId]: current + additions[type],
    }));
    setShowBlockToolbar(false);
  }

  async function handlePublish() {
    if (publishing) return;
    setPublishing(true);
    try {
      const courseData = {
        title: courseTitle || 'Nouveau cours',
        description: courseDescription,
        level: 'Débutant' as const,
        isPremium: isPaid,
        price: isPaid ? Math.round(Number(price) || 0) : 0,
        chaptersCount: chapters.length,
        lessonsCount: chapters.reduce((acc, ch) => acc + ch.lessons.length, 0),
        totalDuration: '0h',
        thumbnail: '',
        teacherId: '',
        chapters: chapters.map((ch) => ({
          ...ch,
          lessons: ch.lessons.map((l) => ({
            ...l,
            title: lessonTitles[l.id] ?? l.title,
          })),
        })),
      };
      if (isNew) {
        const newId = await addCourse(courseData);
        if (newId) navigate('/professeur/mes-cours?saved=1', { replace: true });
      } else if (courseId) {
        await updateCourse(courseId, courseData);
        navigate('/professeur/mes-cours?saved=1', { replace: true });
      }
    } finally {
      setPublishing(false);
    }
  }

  const { chapterIndex, lessonIndex } = getChapterAndLessonIndex(selectedLessonId);

  return (
    <div className={styles.container}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.panelHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/professeur/mes-cours')}>
            ← Retour
          </button>
          <div className={styles.panelLabel}>Paramètres du cours</div>
          <button className={styles.publishBtn} onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Publication…' : (isNew ? 'Créer le cours' : 'Publier')}
          </button>
        </div>

        {/* Title & description */}
        <div className={styles.fieldGroup}>
          <div>
            <div className={styles.fieldLabel}>Titre (cours & catalogue)</div>
            <input
              className={styles.fieldInput}
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Titre du cours..."
            />
          </div>
          <div>
            <div className={styles.fieldLabel}>Description (catalogue)</div>
            <textarea
              className={styles.fieldTextarea}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              placeholder="Description courte pour le catalogue..."
            />
          </div>
        </div>

        {/* Paid toggle */}
        <div className={styles.fieldGroup}>
          <div className={styles.toggleRow}>
            <span className={styles.toggleLabel}>Cours payant</span>
            <label className={styles.switchWrapper}>
              <input
                type="checkbox"
                className={styles.switchInput}
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
              <span className={styles.switchSlider} />
            </label>
          </div>
          <div className={[styles.priceField, isPaid ? styles.visible : ''].filter(Boolean).join(' ')}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.pricePrefix}>€</span>
              <input
                type="number"
                className={styles.priceInput}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Chapters & lessons */}
        <div className={styles.chapterSection}>
          {chapters.map((chapter, ci) => {
            return (
              <div key={chapter.id} className={styles.chapterBlock}>
                <div className={styles.chapterHeader}>
                  <span className={styles.chapterLabel}>Ch.{ci + 1}</span>
                  <span className={styles.chapterTitle}>{chapter.title}</span>
                </div>
                {chapter.lessons.map((lesson) => {
                  globalLessonNum++;
                  const isActive = lesson.id === selectedLessonId;
                  return (
                    <div
                      key={lesson.id}
                      className={[styles.lessonItem, isActive ? styles.active : ''].filter(Boolean).join(' ')}
                      onClick={() => setSelectedLessonId(lesson.id)}
                    >
                      <div className={[styles.lessonNum, isActive ? styles.active : ''].filter(Boolean).join(' ')}>
                        {globalLessonNum}
                      </div>
                      <span className={styles.lessonTitle}>
                        {lessonTitles[lesson.id] ?? lesson.title}
                      </span>
                    </div>
                  );
                })}
                <button className={styles.addLessonBtn} onClick={() => addLesson(chapter.id)}>
                  + Leçon
                </button>
              </div>
            );
          })}
          <button className={styles.addChapterBtn} onClick={addChapter}>
            + Chapitre
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.videoZone}>
          <div className={styles.uploadBtn}>
            <span className={styles.uploadIcon}>↑</span>
            <span>Uploader une vidéo</span>
          </div>
        </div>

        <div className={styles.editorBody}>
          <div className={styles.breadcrumb}>
            Chapitre {chapterIndex} · Leçon {lessonIndex}
          </div>

          <input
            className={styles.lessonTitleInput}
            type="text"
            value={lessonTitles[selectedLessonId] ?? selectedLesson?.title ?? ''}
            onChange={(e) =>
              setLessonTitles((prev) => ({ ...prev, [selectedLessonId]: e.target.value }))
            }
            placeholder="Titre de la leçon..."
          />

          <textarea
            className={styles.contentTextarea}
            value={lessonContents[selectedLessonId] ?? ''}
            onChange={(e) =>
              setLessonContents((prev) => ({ ...prev, [selectedLessonId]: e.target.value }))
            }
            placeholder="Rédigez le contenu de cette leçon..."
          />

          <div className={styles.blockDivider}>
            <button
              className={styles.addBlockBtn}
              onClick={() => setShowBlockToolbar((v) => !v)}
              title="Ajouter un bloc de contenu"
            >
              +
            </button>
          </div>

          {showBlockToolbar && (
            <div className={styles.blockToolbar}>
              <button className={styles.blockOption} onClick={() => insertBlock('heading')}>
                <span className={styles.blockIcon}>H</span> Titre
              </button>
              <button className={styles.blockOption} onClick={() => insertBlock('text')}>
                <span className={styles.blockIcon}>A≡</span> Texte
              </button>
              <button className={styles.blockOption} onClick={() => insertBlock('image')}>
                <span className={styles.blockIcon}>⊞</span> Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
