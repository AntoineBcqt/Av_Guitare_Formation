import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Student } from '../types/teacher';

interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'admin';
  createdAt?: string;
}

function apiUserToStudent(u: ApiUser): Student {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    initials: `${u.firstName[0] ?? ''}${u.lastName[0] ?? ''}`.toUpperCase(),
    enrolledAt: u.createdAt ?? new Date().toISOString(),
    coursesCount: 0,
  };
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    api
      .get<ApiUser[]>('/users')
      .then((users) => setStudents(users.filter((u) => u.role === 'student').map(apiUserToStudent)))
      .catch((err) => console.error('useStudents load error:', err));
  }, []);

  function banStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function searchStudents(query: string): Student[] {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }

  return { students, banStudent, searchStudents };
}
