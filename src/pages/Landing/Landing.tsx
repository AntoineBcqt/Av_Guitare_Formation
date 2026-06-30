import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/PublicNavbar/PublicNavbar';
import { PublicFooter } from '../../components/PublicFooter/PublicFooter';
import styles from './Landing.module.css';

const TEACHER_PHOTO =
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&q=80';
const HERO_PHOTO =
  'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=900&q=80';

const PACK_PREVIEWS = [
  {
    title: 'Guitare débutant',
    level: 'Débutant',
    price: 20,
    img: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&q=75',
  },
  {
    title: 'Sons du rythme',
    level: 'Intermédiaire',
    price: 20,
    img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=75',
  },
  {
    title: 'Les arpèges',
    level: 'Intermédiaire',
    price: 20,
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=75',
  },
  {
    title: 'Top Kiko',
    level: 'Avancé',
    price: 20,
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=75',
  },
];

const PILLARS = [
  {
    icon: '🎸',
    title: 'Un vrai professeur',
    text: "Bénéficiez de l'expertise d'un guitariste professionnel avec plus de 20 ans d'expérience. Chaque leçon est conçue et filmée avec soin.",
  },
  {
    icon: '📚',
    title: 'Méthode structurée',
    text: "Une progression pédagogique construite pas à pas. Des exercices pratiques, des tablatures et des backing tracks inclus dans chaque pack.",
  },
  {
    icon: '✅',
    title: 'Paiement unique',
    text: "Payez une fois, accédez à vie. Pas d'abonnement, pas de surprise. Les mises à jour futures sont incluses gratuitement.",
  },
];

const TESTIMONIALS = [
  { name: 'Sophie L.', initials: 'SL', text: "J'ai essayé plusieurs applications avant, mais rien ne vaut la progression structurée des cours d'Alexandre. En 3 mois j'ai joué mes premières chansons !", stars: 5 },
  { name: 'Thomas M.', initials: 'TM', text: "La méthode est vraiment efficace. Le professeur explique clairement chaque technique et les vidéos sont d'excellente qualité.", stars: 5 },
  { name: 'Marie P.', initials: 'MP', text: "Super formation pour débutant ! J'adore le fait de pouvoir y revenir à mon rythme sans pression de temps.", stars: 5 },
  { name: 'Lucas R.', initials: 'LR', text: "Excellent rapport qualité/prix. Les tablatures incluses sont très utiles et le suivi de progression est motivant.", stars: 5 },
  { name: 'Emma D.', initials: 'ED', text: "Alexandre explique avec beaucoup de patience et de clarté. Je recommande vivement pour tous les niveaux !", stars: 5 },
];

const FAQ_ITEMS = [
  { q: 'Faut-il avoir joué de la guitare avant ?', a: "Non, les packs débutants partent de zéro. Aucune connaissance musicale préalable n'est nécessaire." },
  { q: 'Combien de temps faut-il pour apprendre ?', a: "Avec 20 à 30 minutes de pratique quotidienne, les premiers résultats sont visibles dès les premières semaines." },
  { q: 'Quelle méthode est utilisée pour débutant ?', a: "Une progression logique : posture, accords de base, rythme, puis chansons complètes. Chaque leçon s'appuie sur la précédente." },
  { q: "Puis-je accéder aux cours si je n'ai pas internet ?", a: "Les cours sont en streaming. Une connexion internet est nécessaire pour visionner les vidéos." },
  { q: 'Quelle guitare dois-je avoir pour commencer ?', a: "Une guitare acoustique classique ou folk suffit pour démarrer. Nous vous guidons dans le choix lors de la première leçon." },
  { q: 'La formation guitare est-elle remboursable ?', a: "Oui, nous offrons une garantie satisfait ou remboursé de 30 jours sans conditions." },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=75',
  'https://images.unsplash.com/photo-1598387993441-a364f854cafa?w=600&q=75',
  'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&q=75',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=75',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=75',
  'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&q=75',
];

export function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const visibleTestimonials = TESTIMONIALS.slice(testimonialIdx, testimonialIdx + 3);

  return (
    <div className={styles.page}>
      <PublicNavbar />

      {/* ─── HERO ─── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>Formation guitare en ligne</div>
            <h1 className={styles.heroTitle}>
              Cours de guitare en ligne pour{' '}
              <em className={styles.heroEm}>débutants et intermédiaires.</em>
            </h1>
            <p className={styles.heroSub}>
              Apprenez la guitare à votre rythme grâce à une méthode structurée et accessible.
              Progressez pas à pas, maîtrisez les accords essentiels et jouez vos premières
              chansons avec le suivi d'un professeur passionné.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.heroCtaPrimary} onClick={() => navigate('/cours')}>
                Commencer mes cours
              </button>
              <span className={styles.heroBadge}>Paiement unique · À vie</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImgWrapper}>
              <img src={HERO_PHOTO} alt="Alexandre guitariste" className={styles.heroImg} />
              <div className={styles.heroCard}>
                <div className={styles.heroCardStars}>★★★★★</div>
                <div className={styles.heroCardName}>Alexandre</div>
                <div className={styles.heroCardRole}>Guitariste · Formateur</div>
              </div>
              <div className={styles.heroStatRow}>
                <div className={styles.heroStat}><strong>+150</strong><span>élèves</span></div>
                <div className={styles.heroStat}><strong>20 ans</strong><span>d'expérience</span></div>
                <div className={styles.heroStat}><strong>5/5</strong><span>note</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORMATIONS ─── */}
      <section className={styles.section} id="packs">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Des formations guitare en ligne à prix unique et{' '}
              <em className={styles.em}>sans abonnement.</em>
            </h2>
            <p className={styles.sectionSub}>
              Choisissez votre programme d'apprentissage guitare une fois et accédez à vie, où que vous soyez.
            </p>
          </div>

          <div className={styles.packGrid}>
            {PACK_PREVIEWS.map((pack) => (
              <div key={pack.title} className={styles.packCard}>
                <div className={styles.packImgWrapper}>
                  <img src={pack.img} alt={pack.title} className={styles.packImg} />
                  <span className={styles.packLevel}>{pack.level}</span>
                </div>
                <div className={styles.packCardBody}>
                  <div className={styles.packCardTitle}>{pack.title}</div>
                  <div className={styles.packCardPrice}>{pack.price} €</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.packCta}>
            <Link to="/cours" className={styles.packCtaLink}>Voir tous les packs →</Link>
          </div>
        </div>
      </section>

      {/* ─── MÉTHODE ─── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitleCenter}>
            Une méthode pour apprendre la guitare seul,{' '}
            <em className={styles.em}>efficacement.</em>
          </h2>

          <div className={styles.pillarsGrid}>
            {PILLARS.map((p) => (
              <div key={p.title} className={styles.pillar}>
                <div className={styles.pillarIcon}>{p.icon}</div>
                <div className={styles.pillarTitle}>{p.title}</div>
                <p className={styles.pillarText}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROFESSEUR ─── */}
      <section className={styles.section} id="professor">
        <div className={styles.profInner}>
          <div className={styles.profImgWrapper}>
            <img src={TEACHER_PHOTO} alt="Alexandre Vanthournout" className={styles.profImg} />
          </div>
          <div className={styles.profContent}>
            <div className={styles.profEyebrow}>Votre formateur</div>
            <h2 className={styles.profTitle}>
              Je suis <em className={styles.em}>Alexandre Vanthournout,</em> guitariste depuis plus de 20 ans.
            </h2>
            <p className={styles.profText}>
              Guitariste passionné depuis l'âge de 16 ans, la musique est au cœur de ma vie.
              Aujourd'hui, je partage cette passion en tant que professeur et formateur en ligne.
            </p>
            <p className={styles.profText}>
              J'ai accompagné des centaines d'élèves, de parfaits débutants à des guitaristes
              confirmés. Ma pédagogie repose sur une progression rigoureuse et le plaisir de
              jouer dès les premières semaines.
            </p>
            <p className={styles.profText}>
              J'interviens également dans plusieurs productions associatives, notamment à l'école
              de musique de Marcq-en-Barœul et au Conservatoire d'Armentières. Je propose aussi
              des cours en présentiel aux alentours de Lille.
            </p>
            <Link to="/cours" className={styles.profCta}>
              Découvrir mes formations →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ─── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitleCenter}>Ce qu'ils disent</h2>

          <div className={styles.testimonialsGrid}>
            {visibleTestimonials.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>{'★'.repeat(t.stars)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.initials}</div>
                  <span className={styles.testimonialName}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.testimonialDots}>
            {Array.from({ length: Math.ceil(TESTIMONIALS.length / 3) }).map((_, i) => (
              <button
                key={i}
                className={[styles.dot, Math.floor(testimonialIdx / 3) === i ? styles.dotActive : ''].filter(Boolean).join(' ')}
                onClick={() => setTestimonialIdx(i * 3)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── COURS PHYSIQUE ─── */}
      <section className={styles.physique} id="physique">
        <div className={styles.physiqueInner}>
          <div className={styles.physiqueContent}>
            <h2 className={styles.physiqueTitle}>Vous préférez apprendre en physique ?</h2>
            <p className={styles.physiqueSub}>
              Contactez-moi pour organiser une première séance aux alentours de Lille.
            </p>
            <div className={styles.physiqueActions}>
              <span className={styles.instagramHandle}>@av_guitare_formation</span>
              <a
                href="https://www.instagram.com/av_guitare_formation"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.physiqueBtn}
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>+150</div>
            <div className={styles.statLabel}>Élèves inscrits en ligne</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNum}>+20</div>
            <div className={styles.statLabel}>Cours disponibles</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNum}>5 / 5</div>
            <div className={styles.statLabel}>Note moyenne</div>
          </div>
        </div>
      </section>

      {/* ─── GALERIE ─── */}
      <section className={styles.gallery}>
        <div className={styles.galleryGrid}>
          {GALLERY.map((src, i) => (
            <div key={i} className={styles.galleryItem}>
              <img src={src} alt="" className={styles.galleryImg} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className={styles.section} id="faq">
        <div className={styles.faqInner}>
          <h2 className={styles.faqTitle}>
            Vos questions fréquentes sur les{' '}
            <em className={styles.em}>cours de guitare en ligne.</em>
          </h2>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className={[styles.faqChevron, openFaq === i ? styles.open : ''].filter(Boolean).join(' ')}>
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>
            Commencez votre parcours{' '}
            <em className={styles.ctaEm}>guitare</em> dès aujourd'hui.
          </h2>
          <button className={styles.ctaFinalBtn} onClick={() => navigate('/cours')}>
            Voir les formations
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
