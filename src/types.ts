export type AppTab = "dashboard" | "learn" | "pet" | "shop" | "media";
export type CourseCategory = "economics" | "finance";
export type LearnSubTab = "video" | "summary" | "quiz";
export type QuizStatus = "correct" | "incorrect";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

export interface VideoScriptLine {
  role: "Youtuber" | "Meme" | "Học sinh" | "Thầy giáo";
  text: string;
  action?: string;
}

export interface Lesson {
  id: string;
  title: string;
  shortDescription: string;
  duration: string;
  youtubeId: string; // Simulated youtube placeholder or embed
  videoScript: VideoScriptLine[];
  summary: {
    title: string;
    points: string[];
    infographicUrl?: string; // or an SVG diagram details
  };
  quiz: Question[];
  pointsReward: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: CourseCategory;
  duration: string;
  lessons: Lesson[];
  icon: string; // lucide icon name
  accentColor: string; // tailwind color class
}

export interface PetAccessory {
  id: string;
  name: string;
  category: "glasses" | "hat" | "clothing" | "background";
  price: number;
  unlocked: boolean;
  svgItem: string; // Custom renderable ID or style
  description: string;
  cssStyle?: string;
}

export interface PetState {
  name: string;
  points: number;
  level: number;
  species: "gấu" | "mèo" | "khủng long";
  equipped: {
    glasses: string | null;
    hat: string | null;
    clothing: string | null;
    background: string | null;
  };
  ownedAccessories: string[]; // List of purchase accessory IDs
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "facebook";
  type: "meme" | "infographic" | "depth" | "bts";
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares?: number;
  date: string;
  tags: string[];
}
