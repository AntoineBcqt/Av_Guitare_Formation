import type { Course } from './index';

export interface TeacherUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'teacher';
  initials: string;
}

export interface TeacherCourse extends Course {
  studentsCount: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  enrolledAt: string;
  coursesCount: number;
}

export interface StudentProgressEntry {
  studentId: string;
  studentName: string;
  studentInitials: string;
  currentCourse: string;
  progress: number;
}

export interface TeacherMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
}

export interface TeacherConversation {
  id: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: TeacherMessage[];
}
