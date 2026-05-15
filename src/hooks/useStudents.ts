import { useState } from 'react';
import { students as initial } from '../mock/students';
import type { Student } from '../types/teacher';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(initial);

  function banStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function searchStudents(query: string): Student[] {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  return { students, banStudent, searchStudents };
}
