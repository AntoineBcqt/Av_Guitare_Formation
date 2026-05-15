import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/useCourses';
import { Avatar } from '../../components/Avatar/Avatar';
import type { Message } from '../../types';
import styles from './Messages.module.css';

function getDateLabel(timestamp: string): string {
  if (timestamp.startsWith('Hier')) return 'Hier';
  if (timestamp.startsWith('Aujourd')) return "Aujourd'hui";
  return timestamp;
}

export function Messages() {
  const { user } = useAuth();
  const { userCourses } = useCourses();
  const { conversations, sendMessage } = useMessages();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasPurchasedCourse = userCourses.length > 0;
  const conversation = conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  if (!hasPurchasedCourse) {
    return (
      <div className={styles.locked}>
        <div className={styles.lockedIcon}>🔒</div>
        <h2 className={styles.lockedTitle}>Messagerie non disponible</h2>
        <p className={styles.lockedText}>
          Achetez un cours pour accéder à la messagerie de votre professeur.
        </p>
        <button className={styles.lockedBtn} onClick={() => navigate('/cours')}>
          Voir les cours
        </button>
      </div>
    );
  }

  if (!conversation) return null;

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessage(conversation.id, user.id, trimmed);
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  let lastDateLabel = '';

  function renderMessage(msg: Message) {
    const isMine = msg.senderId === user.id;
    const wrapClass = [styles.messageBubbleWrapper, isMine ? styles.mine : styles.theirs].join(' ');

    let content: React.ReactNode;

    if (msg.type === 'file') {
      content = (
        <div className={[styles.fileCard, isMine ? styles.mine : ''].filter(Boolean).join(' ')}>
          <span className={styles.fileIcon}>📄</span>
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{msg.fileName}</div>
            <div className={styles.fileSize}>{msg.fileSize}</div>
          </div>
        </div>
      );
    } else if (msg.type === 'image') {
      content = (
        <div className={styles.imageMsg}>
          <img src={msg.content} alt="Image partagée" />
        </div>
      );
    } else {
      content = (
        <div className={[styles.bubble, isMine ? styles.mine : styles.theirs].join(' ')}>
          {msg.content}
        </div>
      );
    }

    return (
      <div key={msg.id} className={wrapClass}>
        {!isMine && <Avatar initials={conversation.participantInitials} size={32} />}
        <div>
          {content}
          <div className={styles.bubbleTime}>{msg.timestamp}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.msgHeader}>
        <Avatar initials={conversation.participantInitials} size={42} />
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{conversation.participantName}</div>
          <div className={styles.headerRole}>Professeur · Guitare Formation</div>
        </div>
      </div>

      <div className={styles.messagesArea}>
        {conversation.messages.map((msg) => {
          const dateLabel = getDateLabel(msg.timestamp);
          const showSeparator = dateLabel !== lastDateLabel;
          if (showSeparator) lastDateLabel = dateLabel;

          return (
            <div key={msg.id}>
              {showSeparator && (
                <div className={styles.dateSeparator}>{dateLabel}</div>
              )}
              {renderMessage(msg)}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <button className={styles.attachBtn} aria-label="Joindre un fichier">📎</button>
        <input
          className={styles.messageInput}
          type="text"
          placeholder="Écrivez un message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.sendBtn} onClick={handleSend}>
          Envoyer
        </button>
      </div>
    </div>
  );
}
