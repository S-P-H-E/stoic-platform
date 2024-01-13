/* export interface User {
  userStripeId: string;
  userRoles: Role[] | "User" | undefined;
  generalLastCourse: string;
  userEmail: string | undefined;
  generalLastLesson: string;
  userName: string | null;
  userStatus: string | undefined;
  userProfileImageUrl: string;
  userProfileBannerUrl: string;
} */

export interface User {
  stripeId: string;
  roles: Role[] | "User" | undefined;
  generalLastCourse: string;
  email: string | undefined;
  generalLastLesson: string;
  name: string | null;
  status: string | undefined;
  profileImageUrl: string;
  profileBannerUrl: string;
  description: string;
}
  
export interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}