import { useState } from 'react';
import { posts as initialPosts } from '../mock/posts';
import type { Post, Reply } from '../types';

let postCounter = 2000;
let replyCounter = 3000;

export function useTeacherCommunity() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  function addPost(post: Omit<Post, 'id' | 'replies' | 'timestamp'>) {
    const newPost: Post = {
      ...post,
      id: `tp${postCounter++}`,
      timestamp: "À l'instant",
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function deletePost(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  function addReply(postId: string, reply: Omit<Reply, 'id' | 'timestamp'>) {
    const newReply: Reply = {
      ...reply,
      id: `tr${replyCounter++}`,
      timestamp: "À l'instant",
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p))
    );
  }

  function deleteReply(postId: string, replyId: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: p.replies.filter((r) => r.id !== replyId) } : p
      )
    );
  }

  return { posts, addPost, deletePost, addReply, deleteReply };
}
