import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  // eslint-disable-next-line class-methods-use-this
  getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    return matches ? decodeURIComponent(matches[0]) : null;
  }

  // eslint-disable-next-line class-methods-use-this
  getCookieValue(name: string): string | null {
    const matches = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    const cookieValue = matches?.[0].split('=')[1];

    return cookieValue || null;
  }

  // eslint-disable-next-line class-methods-use-this
  removeCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
