import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {EnumCookie} from './cookie.enum';

@Injectable({providedIn: 'root'})
export class CookiesService {
  constructor(private readonly cookieService: CookieService) {}

  set(name: EnumCookie, value: string): void {
    this.cookieService.set(name, value);
  }

  setObject(name: EnumCookie, value: string): void {
    this.cookieService.set(name, JSON.stringify(value));
  }

  get(name: EnumCookie): string {
    return this.cookieService.get(name);
  }

  getObject(name: EnumCookie): string {
    return JSON.parse(this.cookieService.get(name));
  }

  delete(name: EnumCookie): void {
    this.cookieService.delete(name);
  }

  check(name: EnumCookie): boolean {
    return this.cookieService.check(name);
  }

  clearClientSession(): void {
    for (const cookie of Object.values(EnumCookie)) {
      this.cookieService.delete(cookie);
      this.cookieService.delete(cookie, '/');
    }

    this.cookieService.deleteAll();
    this.cookieService.deleteAll('/');

    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  }
}
