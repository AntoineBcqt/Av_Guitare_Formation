import { useState, useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';
import type { TeacherConversation, TeacherMessage } from '../types/teacher';

interface RawMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

function rawToTeacherMessage(raw: RawMessage): TeacherMessage {
  return {
    id: raw.id,
    senderId: raw.senderId,
    content: raw.content,
    timestamp: new Date(raw.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    type: 'text',
  };
}

export function useTeacherMessages(teacherId: string) {
  const [conversations, setConversations] = useState<TeacherConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!teacherId) return;
    const socket = socketRef.current;
    socket.emit('joinRoom', { userId: teacherId });

    socket.on('receiveMessage', (raw: RawMessage) => {
      const msg = rawToTeacherMessage(raw);
      setConversations((prev) => {
        const existing = prev.find((c) => c.studentId === raw.senderId);
        if (existing) {
          return prev.map((c) =>
            c.studentId === raw.senderId
              ? { ...c, messages: [...c.messages, msg], lastMessage: msg.content, lastMessageTime: msg.timestamp, unread: c.id !== activeConversationId }
              : c,
          );
        }
        const newConv: TeacherConversation = {
          id: raw.senderId,
          studentId: raw.senderId,
          studentName: 'Élève',
          studentInitials: '??',
          lastMessage: msg.content,
          lastMessageTime: msg.timestamp,
          unread: true,
          messages: [msg],
        };
        return [newConv, ...prev];
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [teacherId, activeConversationId]);

  function selectConversation(id: string) {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  }

  function sendMessage(conversationId: string, senderId: string, content: string) {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;
    const socket = socketRef.current;
    socket.emit('sendMessage', { receiverId: conv.studentId, content });
    const optimistic: TeacherMessage = {
      id: `local-${Date.now()}`,
      senderId,
      content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, optimistic], lastMessage: content, lastMessageTime: optimistic.timestamp }
          : c,
      ),
    );
  }

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return { conversations, activeConversation, activeConversationId, selectConversation, sendMessage };
}
