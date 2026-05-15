import { useState } from 'react';
import type { Course, Level } from '../../types';
import { useCourses } from '../../hooks/useCourses';
import { CourseCard } from '../../components/CourseCard/CourseCard';
import { Modal } from '../../components/Modal/Modal';
import styles from './Catalogue.module.css';

type Filter = 'Tous' | Level;
const filters: Filter[] = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

const benefits = [
  'Accès illimité aux vidéos HD',
  'Exercices téléchargeables (PDF, GPX)',
  'Suivi de progression détaillé',
  'Accès à la communauté privée',
  'Mises à jour gratuites à vie',
];

export function Catalogue() {
  const { courses, userCourses, isOwned } = useCourses();
  const [filter, setFilter] = useState<Filter>('Tous');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filtered = filter === 'Tous' ? courses : courses.filter((c) => c.level === filter);

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCount}>{courses.length} formations disponibles</div>
          <h1 className={styles.heroTitle}>
            Catalogue de <em>cours</em>
          </h1>
          <p className={styles.heroSub}>
            Des formations structurées pour tous les niveaux, du débutant au guitariste confirmé.
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersInner}>
          {filters.map((f) => (
            <button
              key={f}
              className={[styles.filterBtn, filter === f ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          {filtered.map((course) => {
            const userCourse = userCourses.find((uc) => uc.courseId === course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                userCourse={userCourse}
                isOwned={isOwned(course.id)}
                onPremiumClick={setSelectedCourse}
              />
            );
          })}
        </div>
      </div>

      {selectedCourse && (
        <Modal title={selectedCourse.title} onClose={() => setSelectedCourse(null)}>
          <div className={styles.priceBlock}>
            <div className={styles.premiumLabel}>Accès Premium</div>
            <div className={styles.priceAmount}>{selectedCourse.price} €</div>
            <div className={styles.accessInfo}>Paiement unique · Accès à vie</div>
          </div>

          <div className={styles.benefitsList}>
            {benefits.map((b) => (
              <div key={b} className={styles.benefitItem}>
                <span className={styles.benefitCheck}>✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <button className={styles.buyBtn}>Accéder à ce cours →</button>
          <div className={styles.stripeNote}>🔒 Paiement sécurisé · STRIPE</div>
        </Modal>
      )}
    </div>
  );
}
