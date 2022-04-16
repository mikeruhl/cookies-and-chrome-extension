import { User } from "./User";

export type UserResponse = {
  user: User | null;
  success: boolean;
  errorMsg: string;
};
