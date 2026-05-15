import { useState } from 'react';
import { posts as initialPosts } from '../mock/posts';
import type { Post, Reply } from '../types';

let postCounter = initialPosts.length + 1;
let replyCounter = 100;

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  function addPost(post: Omit<Post, 'id' | 'replies' | 'timestamp'>) {
    const newPost: Post = {
      ...post,
      id: `p${postCounter++}`,
      timestamp: 'À l\'instant',
      replies: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  }

  function addReply(postId: string, reply: Omit<Reply, 'id' | 'timestamp'>) {
    const newReply: Reply = {
      ...reply,
      id: `r${replyCounter++}`,
      timestamp: 'À l\'instant',
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
      )
    );
  }

  return { posts, addPost, addReply };
}
