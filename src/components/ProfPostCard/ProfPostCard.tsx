import { useState } from 'react';
import type { Post, Reply } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import styles from './ProfPostCard.module.css';

interface ProfPostCardProps {
  post: Post;
  teacherInitials: string;
  onReply: (postId: string, reply: Omit<Reply, 'id' | 'timestamp'>) => void;
  onDeletePost: (postId: string) => void;
  onDeleteReply: (postId: string, replyId: string) => void;
}

export function ProfPostCard({
  post,
  teacherInitials,
  onReply,
  onDeletePost,
  onDeleteReply,
}: ProfPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');

  function handleDelete() {
    if (window.confirm('Supprimer ce post définitivement ?')) {
      onDeletePost(post.id);
    }
  }

  function handleDeleteReply(replyId: string, replyAuthor: string) {
    if (window.confirm(`Supprimer la réponse de ${replyAuthor} ?`)) {
      onDeleteReply(post.id, replyId);
    }
  }

  function handlePublish() {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onReply(post.id, {
      authorId: 't1',
      author: 'Alexandre Lefèvre',
      authorInitials: teacherInitials,
      authorRole: 'Professeur',
      content: trimmed,
    });
    setReplyText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.ctrlKey) handlePublish();
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.authorBlock}>
          <Avatar initials={post.authorInitials} size={40} />
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{post.author}</div>
            <div className={styles.meta}>
              <span className={styles.categoryBadge}>{post.category}</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className={styles.deletePostBtn} onClick={handleDelete}>
          Supprimer
        </button>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.content}>{post.content}</p>

      <div className={styles.footer}>
        <span className={styles.repliesCount}>
          {post.replies.length} réponse{post.replies.length !== 1 ? 's' : ''}
        </span>
        <button className={styles.replyToggleBtn} onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Masquer ↑' : 'Répondre →'}
        </button>
      </div>

      {expanded && (
        <div className={styles.repliesSection}>
          {post.replies.map((reply) => (
            <div key={reply.id} className={styles.reply}>
              <Avatar initials={reply.authorInitials} size={32} />
              <div className={styles.replyBody}>
                <div className={styles.replyHeader}>
                  <span className={styles.replyAuthor}>{reply.author}</span>
                  {reply.authorRole === 'Professeur' && (
                    <span className={styles.profBadge}>Professeur</span>
                  )}
                  <span className={styles.replyTime}>{reply.timestamp}</span>
                  <button
                    className={styles.deleteReplyBtn}
                    onClick={() => handleDeleteReply(reply.id, reply.author)}
                  >
                    Supprimer
                  </button>
                </div>
                <p className={styles.replyContent}>{reply.content}</p>
              </div>
            </div>
          ))}

          <div className={styles.replyInput}>
            <Avatar initials={teacherInitials} size={32} />
            <textarea
              className={styles.replyTextarea}
              placeholder="Votre réponse en tant que professeur... (Ctrl+Entrée pour publier)"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.publishBtn} onClick={handlePublish}>
              Publier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
