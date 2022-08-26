import {UserInterface} from "../../models/User.interface";
import {makeAutoObservable} from "mobx";
import axios, {AxiosResponse} from "axios";
import AuthService from "../services/AuthService";
import {API_URL} from "../http";
import {AuthResponse} from "../../models/response/AuthResponse";

export default class Store {
  user = {} as UserInterface;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(state: boolean) {
    this.isAuth = state;
  }

  setUser(user: UserInterface) {
    this.user = user;
  }

  setLoading(state: boolean) {
    this.isLoading = state;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.respose?.data?.message || 'Login error')
    }
  }

  async registration(email: string, password: string) {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.respose?.data?.message || 'Registration error')
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as UserInterface);
    } catch (e: any) {
      console.log(e.respose?.data?.message || 'Logout error')
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e: any) {
      console.log(e.respose?.data?.message || 'Check auth error')
    } finally {
      this.setLoading(false);
    }
  }
}
