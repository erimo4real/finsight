export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  profileImage?: string; // ✅ add this
}
