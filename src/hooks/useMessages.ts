import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';
import type { Conversation, Message } from '../types';

interface RawMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

function rawToMessage(raw: RawMessage): Message {
  return {
    id: raw.id,
    senderId: raw.senderId,
    content: raw.content,
    timestamp: new Date(raw.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    type: 'text',
  };
}

export function useMessages(userId: string, teacherId?: string) {
  const [conversation, setConversation] = useState<Conversation>({
    id: 'main',
    participantId: teacherId ?? '',
    participantName: 'Professeur',
    participantInitials: 'PR',
    lastMessage: '',
    lastMessageTime: '',
    unread: false,
    messages: [],
  });

  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = socketRef.current;
    socket.emit('joinRoom', { userId });

    socket.on('receiveMessage', (raw: RawMessage) => {
      setConversation((prev) => {
        const msg = rawToMessage(raw);
        return {
          ...prev,
          messages: [...prev.messages, msg],
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
        };
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId]);

  function sendMessage(receiverId: string, content: string) {
    const socket = socketRef.current;
    socket.emit('sendMessage', { receiverId, content });
    const optimistic: Message = {
      id: `local-${Date.now()}`,
      senderId: userId,
      content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, optimistic],
      lastMessage: content,
      lastMessageTime: optimistic.timestamp,
    }));
  }

  return { conversation, sendMessage };
}
