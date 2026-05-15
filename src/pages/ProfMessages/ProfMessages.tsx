import { useState, useRef, useEffect } from 'react';
import { useTeacherMessages } from '../../hooks/useTeacherMessages';
import { useTeacher } from '../../hooks/useTeacher';
import { Avatar } from '../../components/Avatar/Avatar';
import type { TeacherMessage, TeacherConversation } from '../../types/teacher';
import styles from './ProfMessages.module.css';

function getDateLabel(timestamp: string): string {
  if (timestamp.startsWith('Hier')) return 'Hier';
  if (timestamp.startsWith("Aujourd")) return "Aujourd'hui";
  return timestamp.split(',')[0] ?? timestamp;
}

export function ProfMessages() {
  const { teacher } = useTeacher();
  const { conversations, activeConversation, activeConversationId, selectConversation, sendMessage } =
    useTeacherMessages();
  const [inputValue, setInputValue] = useState('');
  const [convSearch, setConvSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages.length]);

  const filteredConvs: TeacherConversation[] = convSearch.trim()
    ? conversations.filter((c) =>
        c.studentName.toLowerCase().includes(convSearch.toLowerCase())
      )
    : conversations;

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || !activeConversationId) return;
    sendMessage(activeConversationId, teacher.id, trimmed);
    setInputValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  function renderMessage(msg: TeacherMessage, conv: TeacherConversation) {
    const isMine = msg.senderId === teacher.id;
    const wrapClass = [styles.msgWrapper, isMine ? styles.mine : styles.theirs].join(' ');

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
        {!isMine && <Avatar initials={conv.studentInitials} size={32} />}
        <div>
          {content}
          <div className={styles.bubbleTime}>{msg.timestamp}</div>
        </div>
      </div>
    );
  }

  let lastDateLabel = '';

  return (
    <div className={styles.wrapper}>
      {/* Conversation list */}
      <div className={styles.convList}>
        <div className={styles.convListHeader}>
          <div className={styles.convListTitle}>Messages</div>
          <input
            className={styles.convSearch}
            type="text"
            placeholder="Rechercher un élève..."
            value={convSearch}
            onChange={(e) => setConvSearch(e.target.value)}
          />
        </div>
        <div className={styles.convItems}>
          {filteredConvs.map((conv) => (
            <div
              key={conv.id}
              className={[styles.convItem, conv.id === activeConversationId ? styles.active : ''].filter(Boolean).join(' ')}
              onClick={() => selectConversation(conv.id)}
            >
              <Avatar initials={conv.studentInitials} size={40} />
              <div className={styles.convInfo}>
                <div className={styles.convName}>
                  {conv.studentName}
                  {conv.unread && <span className={styles.unreadDot} />}
                </div>
                <div className={styles.convPreview}>{conv.lastMessage}</div>
              </div>
              <span className={styles.convTime}>{conv.lastMessageTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div className={styles.thread}>
        {!activeConversation ? (
          <div className={styles.emptyThread}>Sélectionnez une conversation</div>
        ) : (
          <>
            <div className={styles.threadHeader}>
              <Avatar initials={activeConversation.studentInitials} size={42} />
              <div className={styles.headerInfo}>
                <div className={styles.headerName}>{activeConversation.studentName}</div>
                <div className={styles.headerRole}>Élève</div>
              </div>
            </div>

            <div className={styles.messagesArea}>
              {activeConversation.messages.map((msg) => {
                const dateLabel = getDateLabel(msg.timestamp);
                const showSep = dateLabel !== lastDateLabel;
                if (showSep) lastDateLabel = dateLabel;
                return (
                  <div key={msg.id}>
                    {showSep && <div className={styles.dateSeparator}>{dateLabel}</div>}
                    {renderMessage(msg, activeConversation)}
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
                placeholder="Écrivez votre réponse..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.sendBtn} onClick={handleSend}>Envoyer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
