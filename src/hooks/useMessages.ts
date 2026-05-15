import { useState } from 'react';
import { conversations as initialConversations } from '../mock/messages';
import type { Conversation, Message } from '../types';

let msgCounter = 200;

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  function sendMessage(conversationId: string, senderId: string, content: string) {
    const newMessage: Message = {
      id: `m${msgCounter++}`,
      senderId,
      content,
      timestamp: 'À l\'instant',
      type: 'text',
    };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: content,
              lastMessageTime: 'À l\'instant',
            }
          : conv
      )
    );
  }

  function getConversation(id: string): Conversation | undefined {
    return conversations.find((c) => c.id === id);
  }

  return { conversations, sendMessage, getConversation };
}
