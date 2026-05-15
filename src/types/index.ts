export type UserRole = 'student' | 'teacher';
export type Level = 'Débutant' | 'Intermédiaire' | 'Avancé';
export type PostCategory = 'Tous les posts' | 'Débutant' | 'Technique' | 'Matériel' | 'Théorie';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  level?: Level;
  initials: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: Level;
  price?: number;
  isPremium: boolean;
  chaptersCount: number;
  lessonsCount: number;
  totalDuration: string;
  chapters: Chapter[];
  thumbnail: string;
  teacherId: string;
}

export interface UserCourse {
  courseId: string;
  progress: number;
  completedLessons: number;
  currentChapter: number;
  currentLesson: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: string;
  authorInitials: string;
  authorRole?: 'Professeur' | null;
  category: Exclude<PostCategory, 'Tous les posts'>;
  title: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  authorId: string;
  author: string;
  authorInitials: string;
  authorRole?: 'Professeur' | null;
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}
