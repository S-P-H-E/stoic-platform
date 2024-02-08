export interface Task {
  id: string;
  name: string;
  description: string | undefined;
  createdAt: string;
  completed: boolean;
}

export interface SocialInfo {
  youtube?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface User {
  id?: string | null
  stripeId?: string;
  roles?: Role[] | "User" | undefined;
  createdAt?: Date,
  emailVerified?: boolean;
  generalLastCourse?: string;
  generalLastLesson?: string;
  email?: string | undefined;
  name?: string | null;
  description?: string | null;
  status?: string | undefined;
  profileImageUrl?: string;
  profileBannerUrl?: string;
  onboarding: boolean;
  social?: SocialInfo;
}
  
export interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface GlobalUser {
  id: string | null;
  status: string | undefined;
  name: string | null;
  stripeId: string | undefined;
  onboarding: boolean;
}

export interface Course {
  description: string;
  image: string;
  name: string;
  id?: string;
  lessons?: Lesson[];
  locked?: boolean; 
}

export interface Lesson {
  description: string;
  order: number;
  thumbnail: string | null | undefined;
  title: string;
  courseId?: string;
  url?: string;
  endText?: string;
  locked?: boolean;
  id?: string;
  type?: "text" | "video";
  content?: string[];
  createdAt?: Date;
}