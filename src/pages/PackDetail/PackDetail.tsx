import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/PublicNavbar/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter/PublicFooter';
import { api } from '../../lib/api';
import { mapPack, type ApiPack } from '../../lib/mappers';
import { logPurchase } from '../../lib/purchaseLog';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Course } from '../../types';
import styles from './PackDetail.module.css';

const SKILLS = [
  'Lire et jouer une tablature dès la 1re semaine',
  'Maîtriser 8 accords fondamentaux',
  'Jouer votre 1re chanson complète',
  'Comprendre les rythmes et les temps',
];

const DURATIONS = ['4:32', '6:15', '8:10', '5:45', '7:20', '9:00', '3:55', '11:00'];

function getDuration(i: number) {
  return DURATIONS[i % DURATIONS.length];
}

export function PackDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  const [course, setCourse] = useState<Course | null>(null);
  const [rawPrice, setRawPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    api
      .get<ApiPack>(`/packs/${courseId}`, false)
      .then((pack) => {
        setRawPrice(pack.price ?? 0);
        setCourse(mapPack(pack));
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [courseId]);

  const isPaid = rawPrice > 0;

  async function handleBuy() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!courseId || !course) return;
    if (isPaid) {
      navigate(`/paiement/${courseId}`);
      return;
    }
    setBuying(true);
    try {
      await api.post(`/purchases/packs/${courseId}`);
      if (user) {
        logPurchase({
          studentName: `${user.firstName} ${user.lastName}`,
          studentEmail: user.email,
          packId: courseId,
          packTitle: course.title,
          price: 0,
        });
      }
      navigate(`/mon-espace/cours/${courseId}`);
    } catch {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <PublicNavbar />
        <div className={styles.loading}>Chargement…</div>
        <PublicFooter />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.page}>
        <PublicNavbar />
        <div className={styles.notFound}>
          <p>Formation introuvable.</p>
          <Link to="/cours" className={styles.backLink}>← Voir tous les packs</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  let globalLessonIdx = 0;

  return (
    <div className={styles.page}>
      <PublicNavbar />

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <Link to="/cours" className={styles.breadcrumb}>← Tous les packs</Link>
            <div className={styles.levelBadge}>{course.level}</div>
            <h1 className={styles.heroTitle}>{course.title}</h1>
            <p className={styles.heroDesc}>{course.description}</p>
            <div className={styles.heroMeta}>
              <div className={styles.metaItem}>
                <strong>{course.lessonsCount}</strong>
                <span>leçons</span>
              </div>
              <div className={styles.metaItem}>
                <strong>{course.totalDuration}</strong>
                <span>de contenu</span>
              </div>
              <div className={styles.metaItem}>
                <strong>À vie</strong>
                <span>accès garanti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY ─── */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {/* Main column */}
          <div className={styles.mainCol}>
            {/* Compétences */}
            <section className={styles.block}>
              <div className={styles.blockEyebrow}>Ce que vous apprenez</div>
              <h2 className={styles.blockTitle}>Les compétences du pack</h2>
              <div className={styles.skillsGrid}>
                {SKILLS.map((s) => (
                  <div key={s} className={styles.skillItem}>
                    <span className={styles.skillCheck}>✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Programme */}
            <section className={styles.block}>
              <div className={styles.blockEyebrow}>Le programme</div>
              <h2 className={styles.blockTitle}>
                {course.chaptersCount} chapitres · {course.lessonsCount} leçons
              </h2>

              <div className={styles.chapterList}>
                {course.chapters.map((ch, ci) => (
                  <div key={ch.id} className={styles.chapter}>
                    <div className={styles.chapterHeader}>
                      <span className={styles.chapterNum}>0{ci + 1}</span>
                      <span className={styles.chapterTitle}>{ch.title}</span>
                      <span className={styles.chapterCount}>{ch.lessons.length} leçons</span>
                    </div>

                    <div className={styles.lessonList}>
                      {ch.lessons.map((lesson, li) => {
                        const idx = globalLessonIdx++;
                        const isLocked = idx >= 3;
                        return (
                          <div key={lesson.id} className={[styles.lessonRow, isLocked ? styles.locked : ''].filter(Boolean).join(' ')}>
                            {isLocked ? (
                              <span className={styles.lessonLock}>—</span>
                            ) : (
                              <span className={styles.lessonPlay}>▷</span>
                            )}
                            <span className={styles.lessonTitle}>{isLocked ? '•••••••••••••' : lesson.title}</span>
                            <span className={styles.lessonDuration}>{getDuration(li)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <img
                src={course.thumbnail}
                alt={course.title}
                className={styles.sidebarImg}
              />
              <div className={styles.sidebarBody}>
                <div className={styles.sidebarTitle}>{course.title}</div>
                <div className={styles.sidebarPrice}>
                  {isPaid ? `${rawPrice} €` : 'Gratuit'}
                </div>

                <button className={styles.buyBtn} onClick={handleBuy} disabled={buying}>
                  {buying ? 'Traitement…' : isPaid ? `Acheter · ${rawPrice} €` : 'Commencer gratuitement'}
                </button>

                <div className={styles.sidebarMeta}>
                  <div className={styles.sidebarMetaRow}>
                    <span>{course.lessonsCount}</span>
                    <span>leçons</span>
                  </div>
                  <div className={styles.sidebarMetaRow}>
                    <span>{course.totalDuration}</span>
                    <span>durée</span>
                  </div>
                  <div className={styles.sidebarMetaRow}>
                    <span>{course.level.slice(0, 3)}.</span>
                    <span>niveau</span>
                  </div>
                </div>

                <div className={styles.sidebarOther}>
                  <p>Vous cherchez autre chose ?</p>
                  <Link to="/cours" className={styles.sidebarOtherLink}>Voir tous les packs →</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
