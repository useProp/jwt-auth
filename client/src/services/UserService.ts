import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import $api from "../http";
import {UserInterface} from "../models/User.interface";

export default class UserService {
  static async getAll(): Promise<AxiosResponse<UserInterface[]>> {
    return $api.get<UserInterface[]>('/users');
  }
}
