import { useState } from 'react';
import { teacherConversations as initial } from '../mock/teacherMessages';
import type { TeacherConversation, TeacherMessage } from '../types/teacher';

let msgCounter = 500;

export function useTeacherMessages() {
  const [conversations, setConversations] = useState<TeacherConversation[]>(initial);
  const [activeConversationId, setActiveConversationId] = useState<string>(initial[0]?.id ?? '');

  function selectConversation(id: string) {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  }

  function sendMessage(conversationId: string, senderId: string, content: string) {
    const newMessage: TeacherMessage = {
      id: `tc-new-m${msgCounter++}`,
      senderId,
      content,
      timestamp: "À l'instant",
      type: 'text',
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: content,
              lastMessageTime: "À l'instant",
            }
          : c
      )
    );
  }

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return { conversations, activeConversation, activeConversationId, selectConversation, sendMessage };
}
