import type { Course, UserCourse } from '../types';

export function getMainCourse(courses: Course[], userCourses: UserCourse[]): Course | undefined {
  const main = userCourses.find((uc) => uc.courseId === 'c1');
  if (!main) return undefined;
  return courses.find((c) => c.id === main.courseId);
}

export function getOtherUserCourses(
  courses: Course[],
  userCourses: UserCourse[],
  mainCourseId: string
): { course: Course; userCourse: UserCourse }[] {
  return userCourses
    .filter((uc) => uc.courseId !== mainCourseId)
    .map((uc) => ({
      course: courses.find((c) => c.id === uc.courseId)!,
      userCourse: uc,
    }))
    .filter((item) => item.course != null);
}

export function getRecommendedCourse(courses: Course[], userCourses: UserCourse[]): Course | undefined {
  const ownedIds = new Set(userCourses.map((uc) => uc.courseId));
  return courses.find((c) => c.isPremium && !ownedIds.has(c.id) && c.id === 'c5');
}

export function getLessonLabel(course: Course, chapterIndex: number, lessonIndex: number): string {
  const chapter = course.chapters[chapterIndex - 1];
  if (!chapter) return '';
  const lesson = chapter.lessons[lessonIndex - 1];
  if (!lesson) return '';
  return lesson.title;
}
