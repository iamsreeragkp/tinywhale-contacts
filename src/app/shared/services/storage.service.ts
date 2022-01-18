import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getToken() {
    return localStorage.getItem('accessToken') ?? '';
  }

  setAccessToken(token: string) {
    return localStorage.setItem('accessToken', token);
  }

  removeToken() {
    return localStorage.removeItem('accessToken');
  }

  setGoogleAccessToken(token: string) {
    return localStorage.setItem('accessToken', `Bearer ${token}`);
  }

  getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  setCookie(name: string, value: string, expires?: number): string | undefined {
    return Cookies.set(name, value, { expires: expires || 365 });
  }

  removeCookie(name: string): void {
    return Cookies.remove(name);
  }
}
