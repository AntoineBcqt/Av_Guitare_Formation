import { useState } from 'react';
import type { PostCategory } from '../../types';
import { useTeacherCommunity } from '../../hooks/useTeacherCommunity';
import { useTeacher } from '../../hooks/useTeacher';
import { ProfPostCard } from '../../components/ProfPostCard/ProfPostCard';
import { Modal } from '../../components/Modal/Modal';
import styles from './ProfCommunity.module.css';

type CategoryWithAll = PostCategory;

const categories: { label: CategoryWithAll; count: number }[] = [
  { label: 'Tous les posts', count: 156 },
  { label: 'Débutant', count: 64 },
  { label: 'Technique', count: 42 },
  { label: 'Matériel', count: 28 },
  { label: 'Théorie', count: 22 },
];

const postCategories = ['Débutant', 'Technique', 'Matériel', 'Théorie'] as const;

export function ProfCommunity() {
  const { teacher } = useTeacher();
  const { posts, addPost, deletePost, addReply, deleteReply } = useTeacherCommunity();
  const [activeCategory, setActiveCategory] = useState<CategoryWithAll>('Tous les posts');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<(typeof postCategories)[number]>('Débutant');

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === 'Tous les posts' || p.category === activeCategory;
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handlePublish() {
    if (!newTitle.trim() || !newContent.trim()) return;
    addPost({
      authorId: teacher.id,
      author: `${teacher.firstName} ${teacher.lastName}`,
      authorInitials: teacher.initials,
      authorRole: 'Professeur',
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    setNewTitle('');
    setNewContent('');
    setNewCategory('Débutant');
    setModalOpen(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          La <em>communauté</em>
        </h1>
        <p className={styles.pageSub}>Modérez les échanges et répondez aux élèves.</p>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Catégories</div>
          <div className={styles.categoryList}>
            {categories.map(({ label, count }) => (
              <button
                key={label}
                className={[styles.categoryBtn, activeCategory === label ? styles.active : ''].filter(Boolean).join(' ')}
                onClick={() => setActiveCategory(label)}
              >
                <span>{label}</span>
                <span className={styles.categoryCount}>{count}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.main}>
          <div className={styles.topBar}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Rechercher un post..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className={styles.newPostBtn} onClick={() => setModalOpen(true)}>
              + Nouveau post
            </button>
          </div>

          <div className={styles.postList}>
            {filtered.map((post) => (
              <ProfPostCard
                key={post.id}
                post={post}
                teacherInitials={teacher.initials}
                onReply={addReply}
                onDeletePost={deletePost}
                onDeleteReply={deleteReply}
              />
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <Modal title="Nouveau post" onClose={() => setModalOpen(false)}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Titre</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Titre de votre annonce ou discussion..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Contenu</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Rédigez votre message..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Catégorie</label>
            <div className={styles.pills}>
              {postCategories.map((cat) => (
                <button
                  key={cat}
                  className={[styles.pill, newCategory === cat ? styles.selected : ''].filter(Boolean).join(' ')}
                  onClick={() => setNewCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Annuler</button>
            <button className={styles.publishBtn} onClick={handlePublish}>Publier</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
