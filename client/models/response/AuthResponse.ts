import {UserInterface} from "../User.interface";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInterface;
}
