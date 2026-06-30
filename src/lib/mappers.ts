import type { Course, Chapter, Lesson, UserCourse, Post, Reply, Level } from '../types';

export type ApiLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ApiLesson {
  title: string;
  content: string;
  video: string;
}

export interface ApiChapter {
  title: string;
  lessons: ApiLesson[];
}

export interface ApiPack {
  id: string;
  title: string;
  description: string;
  level: ApiLevel;
  price: number;
  chapters?: ApiChapter[];
  chaptersCount?: number;
  lessonsCount?: number;
  totalDuration?: string;
  _count?: { chapters?: number };
}

export interface ApiProgressData {
  completedLessons: string[];
  totalLessons: number;
  completedCount: number;
  progressPercent: number;
}

export interface ApiPurchase {
  pack: ApiPack;
  progress: ApiProgressData;
}

export interface ApiAuthor {
  id: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
}

export interface ApiComment {
  id: string;
  content: string;
  author: ApiAuthor;
  createdAt: string;
}

export interface ApiTopic {
  id: string;
  title: string;
  content: string;
  author: ApiAuthor;
  createdAt: string;
  comments?: ApiComment[];
}

const LEVEL_MAP: Record<ApiLevel, Level> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

export const LEVEL_REVERSE: Record<Level, ApiLevel> = {
  'Débutant': 'beginner',
  'Intermédiaire': 'intermediate',
  'Avancé': 'advanced',
};

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80';

export function mapPack(pack: ApiPack, completedLessons: string[] = []): Course {
  const completedSet = new Set(completedLessons);
  let totalLessons = 0;

  const rawChapters = pack.chapters ?? [];
  const chapters: Chapter[] = rawChapters.map((ch, ci) => ({
    id: `${pack.id}-ch${ci}`,
    title: ch.title,
    lessons: ch.lessons.map((l, li): Lesson => {
      totalLessons++;
      return {
        id: `${pack.id}-${ci}-${li}`,
        title: l.title,
        duration: '15 min',
        completed: completedSet.has(`${ci}-${li}`),
        locked: false,
      };
    }),
  }));

  return {
    id: pack.id,
    title: pack.title,
    description: pack.description,
    level: LEVEL_MAP[pack.level] ?? 'Débutant',
    price: pack.price,
    isPremium: (pack.price ?? 0) > 0,
    chaptersCount: rawChapters.length || pack.chaptersCount || pack._count?.chapters || 0,
    lessonsCount: totalLessons || pack.lessonsCount || 0,
    totalDuration: pack.totalDuration ?? `${Math.ceil(((totalLessons || pack.lessonsCount || 0) * 15) / 60)}h`,
    chapters,
    thumbnail: DEFAULT_THUMBNAIL,
    teacherId: '',
  };
}

export function mapPurchase(purchase: ApiPurchase): UserCourse {
  const { completedLessons, progressPercent, completedCount } = purchase.progress ?? { completedLessons: [], progressPercent: 0, completedCount: 0 };
  const completedSet = new Set(completedLessons);

  let currentChapter = 1;
  let currentLesson = 1;
  const purchaseChapters = purchase.pack.chapters ?? [];
  outer: for (let ci = 0; ci < purchaseChapters.length; ci++) {
    for (let li = 0; li < (purchaseChapters[ci].lessons ?? []).length; li++) {
      if (!completedSet.has(`${ci}-${li}`)) {
        currentChapter = ci + 1;
        currentLesson = li + 1;
        break outer;
      }
    }
  }

  return {
    courseId: purchase.pack.id,
    progress: progressPercent,
    completedLessons: completedCount,
    currentChapter,
    currentLesson,
  };
}

function initials(author: ApiAuthor) {
  return `${author.firstName[0] ?? ''}${author.lastName[0] ?? ''}`.toUpperCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  } catch {
    return iso;
  }
}

export function mapComment(comment: ApiComment): Reply {
  return {
    id: comment.id,
    authorId: comment.author.id,
    author: `${comment.author.firstName} ${comment.author.lastName}`,
    authorInitials: initials(comment.author),
    authorRole: comment.author.role === 'admin' ? 'Professeur' : null,
    content: comment.content,
    timestamp: formatDate(comment.createdAt),
  };
}

export function mapTopic(topic: ApiTopic): Post {
  return {
    id: topic.id,
    authorId: topic.author.id,
    author: `${topic.author.firstName} ${topic.author.lastName}`,
    authorInitials: initials(topic.author),
    authorRole: topic.author.role === 'admin' ? 'Professeur' : null,
    category: 'Débutant',
    title: topic.title,
    content: topic.content,
    timestamp: formatDate(topic.createdAt),
    replies: (topic.comments ?? []).map(mapComment),
  };
}
