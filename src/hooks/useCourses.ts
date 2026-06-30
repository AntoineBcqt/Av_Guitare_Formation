import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mapPack, mapPurchase, type ApiPack, type ApiPurchase } from '../lib/mappers';
import type { Course, UserCourse } from '../types';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [packs, purchases] = await Promise.all([
          api.get<ApiPack[]>('/packs', false),
          api.get<ApiPurchase[]>('/purchases/my-packs').catch(() => [] as ApiPurchase[]),
        ]);

        const purchaseMap = new Map(purchases.map((p) => [p.pack.id, p]));

        setCourses(
          packs.map((pack) => {
            const purchase = purchaseMap.get(pack.id);
            return mapPack(pack, purchase?.progress?.completedLessons ?? []);
          }),
        );

        setUserCourses(purchases.map(mapPurchase));
      } catch (err) {
        console.error('useCourses load error:', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  function getCourseById(id: string): Course | undefined {
    return courses.find((c) => c.id === id);
  }

  async function fetchCourseById(id: string): Promise<Course | null> {
    try {
      const pack = await api.get<ApiPack>(`/packs/${id}`);
      const purchase = userCourses.find((uc) => uc.courseId === id);
      return mapPack(pack, purchase ? [] : []);
    } catch {
      return null;
    }
  }

  function getUserCourse(courseId: string): UserCourse | undefined {
    return userCourses.find((uc) => uc.courseId === courseId);
  }

  function isOwned(courseId: string): boolean {
    return userCourses.some((uc) => uc.courseId === courseId);
  }

  async function purchaseCourse(packId: string): Promise<boolean> {
    try {
      await api.post(`/purchases/packs/${packId}`);
      const purchases = await api.get<ApiPurchase[]>('/purchases/my-packs');
      setUserCourses(purchases.map(mapPurchase));
      return true;
    } catch {
      return false;
    }
  }

  async function markLessonComplete(
    packId: string,
    chapterIndex: number,
    lessonIndex: number,
  ): Promise<void> {
    try {
      const updated = await api.patch<ApiPurchase['progress']>(
        `/purchases/my-packs/${packId}/lessons/progress`,
        { chapterIndex, lessonIndex, completed: true },
      );
      setUserCourses((prev) =>
        prev.map((uc) => {
          if (uc.courseId !== packId) return uc;
          return {
            ...uc,
            progress: updated.progressPercent,
            completedLessons: updated.completedCount,
          };
        }),
      );
    } catch (err) {
      console.error('markLessonComplete error:', err);
    }
  }

  return { courses, userCourses, loading, getCourseById, fetchCourseById, getUserCourse, isOwned, purchaseCourse, markLessonComplete };
}
