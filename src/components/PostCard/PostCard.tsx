import { useState } from 'react';
import type { Post } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  currentUserInitials: string;
  onReply: (postId: string, content: string) => void;
}

export function PostCard({ post, currentUserInitials, onReply }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');

  function handlePublish() {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onReply(post.id, trimmed);
    setReplyText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.ctrlKey) handlePublish();
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar initials={post.authorInitials} size={40} />
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>{post.author}</div>
          <div className={styles.meta}>
            <span className={styles.categoryBadge}>{post.category}</span>
            <span>{post.timestamp}</span>
          </div>
        </div>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.content}>{post.content}</p>

      <div className={styles.footer}>
        <span className={styles.repliesCount}>
          {post.replies.length} réponse{post.replies.length !== 1 ? 's' : ''}
        </span>
        <button className={styles.replyBtn} onClick={() => setExpanded((v) => !v)}>
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
                </div>
                <p className={styles.replyContent}>{reply.content}</p>
              </div>
            </div>
          ))}

          <div className={styles.replyInput}>
            <Avatar initials={currentUserInitials} size={32} />
            <textarea
              className={styles.replyTextarea}
              placeholder="Écrivez votre réponse... (Ctrl+Entrée pour publier)"
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
