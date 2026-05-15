import { useState } from 'react';
import { teacherCourses as initial } from '../mock/teacherCourses';
import type { TeacherCourse } from '../types/teacher';

let idCounter = 100;

export function useTeacherCourses() {
  const [courses, setCourses] = useState<TeacherCourse[]>(initial);

  function getCourseById(id: string): TeacherCourse | undefined {
    return courses.find((c) => c.id === id);
  }

  function addCourse(course: Omit<TeacherCourse, 'id'>) {
    const newCourse: TeacherCourse = { ...course, id: `tc${idCounter++}` };
    setCourses((prev) => [newCourse, ...prev]);
  }

  function updateCourse(id: string, updates: Partial<TeacherCourse>) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function deleteCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return { courses, getCourseById, addCourse, updateCourse, deleteCourse };
}
