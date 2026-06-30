import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mapTopic, mapComment, type ApiTopic } from '../lib/mappers';
import type { Post, Reply } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api
      .get<ApiTopic[]>('/forum/topics')
      .then((topics) => setPosts(topics.map(mapTopic)))
      .catch((err) => console.error('usePosts load error:', err));
  }, []);

  async function addPost(post: Omit<Post, 'id' | 'replies' | 'timestamp'>) {
    try {
      const created = await api.post<ApiTopic>('/forum/topics', {
        title: post.title,
        content: post.content,
        category: post.category,
      });
      setPosts((prev) => [mapTopic(created), ...prev]);
    } catch (err) {
      console.error('addPost error:', err);
    }
  }

  async function addReply(postId: string, reply: Omit<Reply, 'id' | 'timestamp'>) {
    try {
      const created = await api.post<{ id: string; content: string; author: ApiTopic['author']; createdAt: string }>(
        `/forum/topics/${postId}/comments`,
        { content: reply.content },
      );
      const newReply = mapComment({ ...created, author: created.author });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p)),
      );
    } catch (err) {
      console.error('addReply error:', err);
    }
  }

  async function deletePost(postId: string) {
    try {
      await api.delete(`/forum/topics/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error('deletePost error:', err);
    }
  }

  async function deleteReply(postId: string, replyId: string) {
    try {
      await api.delete(`/forum/comments/${replyId}`);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, replies: p.replies.filter((r) => r.id !== replyId) } : p,
        ),
      );
    } catch (err) {
      console.error('deleteReply error:', err);
    }
  }

  return { posts, addPost, addReply, deletePost, deleteReply };
}
