import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  expandedBooks = new Set<string>();
  selectedBook = signal<string | null>(null);
  selectedChapter = signal<number | null>(null);
  scrollTop = 0;

  hasSelection() {
    return this.selectedBook() !== null && this.selectedChapter() !== null;
  }
}
