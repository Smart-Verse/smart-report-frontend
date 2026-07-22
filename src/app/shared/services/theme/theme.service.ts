import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly storageKey = 'smart-report-theme';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  setTheme(theme: string): void {
    const normalizedTheme: AppTheme = theme.toLowerCase().includes('dark') ? 'dark' : 'light';
    const root = this.document.documentElement;

    root.classList.toggle('app-dark', normalizedTheme === 'dark');
    root.dataset['theme'] = normalizedTheme;
    root.style.colorScheme = normalizedTheme;

    try {
      localStorage.setItem(this.storageKey, normalizedTheme);
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }

  get currentTheme(): AppTheme {
    return this.document.documentElement.classList.contains('app-dark') ? 'dark' : 'light';
  }

  loadTheme(defaultTheme: AppTheme = 'dark'): void {
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem(this.storageKey);
    } catch {
      // Fall back to the application default.
    }
    this.setTheme(savedTheme ?? defaultTheme);
  }

  onConfigurationTheme(theme: string): void {
    this.setTheme(theme === 'DARK' ? 'dark' : 'light');
  }
}
