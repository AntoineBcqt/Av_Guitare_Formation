import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mapPack, LEVEL_REVERSE, type ApiPack } from '../lib/mappers';
import type { TeacherCourse } from '../types/teacher';

function packToTeacherCourse(pack: ApiPack): TeacherCourse {
  return { ...mapPack(pack), studentsCount: 0 };
}

export function useTeacherCourses() {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiPack[]>('/packs')
      .then((packs) => setCourses(packs.map(packToTeacherCourse)))
      .catch((err) => console.error('useTeacherCourses load error:', err))
      .finally(() => setLoading(false));
  }, []);

  function getCourseById(id: string): TeacherCourse | undefined {
    return courses.find((c) => c.id === id);
  }

  async function fetchCourseById(id: string): Promise<TeacherCourse | null> {
    try {
      const pack = await api.get<ApiPack>(`/packs/${id}`);
      return packToTeacherCourse(pack);
    } catch (err) {
      console.error('fetchCourseById error:', err);
      return null;
    }
  }

  async function addCourse(course: Omit<TeacherCourse, 'id' | 'studentsCount'>): Promise<string | null> {
    try {
      const body = {
        title: course.title,
        description: course.description,
        level: LEVEL_REVERSE[course.level],
        price: Math.round(course.price ?? 0),
        chapters: course.chapters.map((ch) => ({
          title: ch.title,
          lessons: ch.lessons.map((l) => ({ title: l.title, content: l.title, video: 'https://placeholder' })),
        })),
      };
      const created = await api.post<ApiPack>('/packs', body);
      const mapped = packToTeacherCourse(created);
      setCourses((prev) => [mapped, ...prev]);
      return mapped.id;
    } catch (err) {
      console.error('addCourse error:', err);
      return null;
    }
  }

  async function updateCourse(id: string, updates: Partial<TeacherCourse>) {
    try {
      const body: Record<string, unknown> = {};
      if (updates.title) body.title = updates.title;
      if (updates.description) body.description = updates.description;
      if (updates.level) body.level = LEVEL_REVERSE[updates.level];
      if (updates.price !== undefined) body.price = updates.price;
      if (updates.chapters) {
        body.chapters = updates.chapters.map((ch) => ({
          title: ch.title,
          lessons: ch.lessons.map((l) => ({ title: l.title, content: l.title, video: 'https://placeholder' })),
        }));
      }
      const updated = await api.patch<ApiPack>(`/packs/${id}`, body);
      setCourses((prev) => prev.map((c) => (c.id === id ? packToTeacherCourse(updated) : c)));
    } catch (err) {
      console.error('updateCourse error:', err);
    }
  }

  async function deleteCourse(id: string) {
    try {
      await api.delete(`/packs/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('deleteCourse error:', err);
    }
  }

  return { courses, loading, getCourseById, fetchCourseById, addCourse, updateCourse, deleteCourse };
}
