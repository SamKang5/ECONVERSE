import { INITIAL_COURSES } from "./data";
import type { CourseCategoryCard, CourseModule, Lesson } from "./types";

const CATEGORY_META: Record<
  CourseCategoryCard["category"],
  Pick<CourseCategoryCard, "accentColor" | "description" | "icon" | "title">
> = {
  economics: {
    accentColor: "lime",
    description:
      "Đi từ các quy luật nền tảng đến cách thị trường phản ứng trong đời sống hằng ngày.",
    icon: "TrendingUp",
    title: "Kinh tế cơ bản",
  },
  finance: {
    accentColor: "purple",
    description:
      "Học cách quản lý tiền, tích lũy thông minh và đặt mục tiêu tài chính rõ ràng hơn.",
    icon: "PiggyBank",
    title: "Tài chính cá nhân",
  },
};

function enrichLesson(lesson: Lesson, order: number): Lesson {
  return {
    ...lesson,
    objectives: lesson.summary?.points.slice(0, 3) ?? [],
    order,
    overview: lesson.mainContent?.[0] ?? lesson.shortDescription,
    videoUrl: "placeholder",
  };
}

export const COURSE_CATEGORY_CARDS: CourseCategoryCard[] = INITIAL_COURSES.map(
  (course) => ({
    category: course.category,
    ...CATEGORY_META[course.category],
  }),
);

export const COURSE_MODULES: CourseModule[] = INITIAL_COURSES.map((course) => ({
  category: course.category,
  description: course.description,
  icon: course.icon,
  id: `module-${course.id}`,
  lessons: course.lessons.map((lesson, index) => enrichLesson(lesson, index + 1)),
  title: course.title,
}));
