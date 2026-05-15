import { courses } from '../mock/courses';
import { userCourses } from '../mock/userCourses';
import type { Course, UserCourse } from '../types';

export function useCourses() {
  const purchasedCourseIds = new Set(userCourses.map((uc) => uc.courseId));

  function getCourseById(id: string): Course | undefined {
    return courses.find((c) => c.id === id);
  }

  function getUserCourse(courseId: string): UserCourse | undefined {
    return userCourses.find((uc) => uc.courseId === courseId);
  }

  function isOwned(courseId: string): boolean {
    return purchasedCourseIds.has(courseId);
  }

  return { courses, userCourses, getCourseById, getUserCourse, isOwned };
}
