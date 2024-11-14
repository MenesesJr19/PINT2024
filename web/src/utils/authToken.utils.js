import { AUTH_KEY } from "data/constants";

export class AuthTokenUtils {
  static set(token) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(token));
  }

  static get() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  }

  static remove() {
    localStorage.removeItem(AUTH_KEY);
  }

  static exists() {
    if (this.getToken()) return true;
    return false;
  }
}
