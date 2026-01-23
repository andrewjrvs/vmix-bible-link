import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { SessionService } from '../../services/session';
import { BookInfo, VerseInfo, SelectedVerseData } from '../../../electron/api';

interface ExpandedBook extends BookInfo {
  expanded: boolean;
  chapterNumbers: number[];
  selectedChapter: number | null;
  verses: VerseInfo[];
  selectedVerses: Set<number>;
  showVerseModal: boolean;
}

@Component({
  selector: 'jar-home',
  imports: [CommonModule, RouterModule],
  template: `
        <div class="books-section">
          <div class="testament-section">
            <div class="testament-header">Old Testament</div>
            <div class="books-list">
              @for (book of oldTestamentExpanded(); track book.name) {
                <div class="book-accordion" [id]="'book-' + book.name">
                  <button
                    class="book-header beos-btn"
                    (click)="toggleBook(book)"
                    [class.expanded]="book.expanded"
                  >
                    <span class="book-name">{{ book.name }}</span>
                    <span class="chapter-count">{{ book.chapters }} chapters</span>
                    <span class="expand-icon">{{ book.expanded ? '▼' : '▶' }}</span>
                  </button>
                  @if (book.expanded) {
                    <div class="chapters-panel">
                      @for (chapter of book.chapterNumbers; track chapter) {
                        <button
                          class="chapter-btn beos-btn"
                          [class.selected]="book.selectedChapter === chapter"
                          (click)="onSelectChapter(book, chapter)"
                        >
                          Ch {{ chapter }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div class="testament-section">
            <div class="testament-header">New Testament</div>
            <div class="books-list">
              @for (book of newTestamentExpanded(); track book.name) {
                <div class="book-accordion" [id]="'book-' + book.name">
                  <button
                    class="book-header beos-btn"
                    (click)="toggleBook(book)"
                    [class.expanded]="book.expanded"
                  >
                    <span class="book-name">{{ book.name }}</span>
                    <span class="chapter-count">{{ book.chapters }} chapters</span>
                    <span class="expand-icon">{{ book.expanded ? '▼' : '▶' }}</span>
                  </button>
                  @if (book.expanded) {
                    <div class="chapters-panel">
                      @for (chapter of book.chapterNumbers; track chapter) {
                        <button
                          class="chapter-btn beos-btn"
                          [class.selected]="book.selectedChapter === chapter"
                          (click)="onSelectChapter(book, chapter)"
                        >
                          Ch {{ chapter }}
                        </button>
                      }
                    </div>

                    
                  }
                </div>
              }
            </div>
          </div>
        </div>

  `,
  styles: `
    :host {
      display: block;
    }


    /* BeOS Button Style */
    .beos-btn {
      padding: 6px 12px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      color: #000;
      font-size: 0.9rem;
      cursor: pointer;
      font-weight: 500;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.6);
      box-shadow: 1px 1px 2px rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%);
      }

      &:active {
        background: linear-gradient(to bottom, #c0c0c0 0%, #d8d8d8 100%);
        border-color: #606060 #ffffff #ffffff #606060;
        box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
      }
    }


    /* Books Section */
    .books-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .testament-section {

    }

    .testament-header {
      padding: 8px 12px;
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      font-weight: bold;
      font-size: 1.1rem;
      border: 2px solid;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.4);
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
      margin-bottom: 5px;
    }

    .books-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    /* Accordion Styles */
    .book-accordion {
      background: #d9d9d9;
    }

    .book-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      text-align: left;
      gap: 10px;

      &.expanded {
        background: linear-gradient(to bottom, #ffd700 0%, #ffc700 100%);
        border-color: #ffe44d #cc9900 #cc9900 #ffe44d;
      }
    }

    .book-name {
      flex: 1;
      font-weight: 600;
    }

    .chapter-count {
      font-size: 0.85rem;
      color: #444;
    }

    .expand-icon {
      font-size: 0.75rem;
      color: #000;
    }

    /* Chapters Panel */
    .chapters-panel {
      padding: 8px;
      background: #f0f0f0;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 4px;
      margin: 2px 0;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.2);
    }

    .chapter-btn {
      padding: 6px 8px;
      font-size: 0.85rem;
      white-space: nowrap;

      &.selected {
        background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
        color: white;
        border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
      }
    }

    

    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnDestroy {
  private api = inject(Api);
  private router = inject(Router);
  private session = inject(SessionService);

  protected bibleLoaded = signal(false);
  protected uploading = signal(false);
  protected uploadError = signal('');
  protected oldTestamentExpanded = signal<ExpandedBook[]>([]);
  protected newTestamentExpanded = signal<ExpandedBook[]>([]);
  protected selectedVerseData = signal<SelectedVerseData | null>(null);

  async ngOnInit() {
    // Check if Bible is already loaded
    const loaded = await this.api.actions.isBibleLoaded();
    this.bibleLoaded.set(loaded);

    if (loaded) {
      await this.loadBooks();
      await this.restoreSessionState();
    }

    // Listen for verse selections from verse reader window
    this.api.actions.onVerseSelection((data: SelectedVerseData) => {
      this.selectedVerseData.set(data);
    });
  }

  ngOnDestroy() {
    // Save scroll position before leaving
    const main = document.querySelector('main');
    if (main) {
      this.session.scrollTop = main.scrollTop;
    }

    // Save expanded book names
    this.session.expandedBooks.clear();
    const allBooks = [...this.oldTestamentExpanded(), ...this.newTestamentExpanded()];
    for (const book of allBooks) {
      if (book.expanded) {
        this.session.expandedBooks.add(book.name);
      }
    }
  }

  private async restoreSessionState() {
    const allBooks = [...this.oldTestamentExpanded(), ...this.newTestamentExpanded()];

    // Restore expanded accordions and load their chapter numbers
    for (const book of allBooks) {
      if (this.session.expandedBooks.has(book.name)) {
        book.expanded = true;
        if (book.chapterNumbers.length === 0) {
          const chapterCount = await this.api.actions.getChapterCount(book.name);
          book.chapterNumbers = Array.from({ length: chapterCount }, (_, i) => i + 1);
        }
        // Restore selected chapter highlight
        if (book.name === this.session.selectedBook()) {
          book.selectedChapter = this.session.selectedChapter();
        }
      }
    }

    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);

    // Wait for Angular to render, then scroll to the selected book
    requestAnimationFrame(() => {
      const selectedBook = this.session.selectedBook();
      if (selectedBook) {
        const el = document.getElementById('book-' + selectedBook);
        if (el) {
          el.scrollIntoView({ block: 'center' });
          return;
        }
      }
      // Fallback: restore raw scroll position
      if (this.session.scrollTop > 0) {
        const main = document.querySelector('main');
        if (main) {
          main.scrollTop = this.session.scrollTop;
        }
      }
    });
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.uploading.set(true);
    this.uploadError.set('');

    try {
      const text = await file.text();
      const bibleJson = JSON.parse(text);

      const result = await this.api.actions.uploadBible(bibleJson);

      if (result.success) {
        this.bibleLoaded.set(true);
        await this.loadBooks();
      } else {
        this.uploadError.set(result.error || 'Failed to upload Bible');
      }
    } catch (error) {
      this.uploadError.set('Invalid JSON file: ' + (error as Error).message);
    } finally {
      this.uploading.set(false);
    }
  }

  private async loadBooks() {
    const books = await this.api.actions.getBooks();

    // Convert to ExpandedBook format
    const oldTestamentExpanded: ExpandedBook[] = books.oldTestament.map(book => ({
      ...book,
      expanded: false,
      chapterNumbers: [],
      selectedChapter: null,
      verses: [],
      selectedVerses: new Set<number>(),
      showVerseModal: false
    }));

    const newTestamentExpanded: ExpandedBook[] = books.newTestament.map(book => ({
      ...book,
      expanded: false,
      chapterNumbers: [],
      selectedChapter: null,
      verses: [],
      selectedVerses: new Set<number>(),
      showVerseModal: false
    }));

    this.oldTestamentExpanded.set(oldTestamentExpanded);
    this.newTestamentExpanded.set(newTestamentExpanded);
  }

  async toggleBook(book: ExpandedBook) {
    book.expanded = !book.expanded;

    // Load chapter numbers if not already loaded
    if (book.expanded && book.chapterNumbers.length === 0) {
      const chapterCount = await this.api.actions.getChapterCount(book.name);
      book.chapterNumbers = Array.from({ length: chapterCount }, (_, i) => i + 1);
    }

    // Update session
    if (book.expanded) {
      this.session.expandedBooks.add(book.name);
    } else {
      this.session.expandedBooks.delete(book.name);
    }

    // Trigger change detection
    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);
  }

  async onSelectChapter(book: ExpandedBook, chapter: number) {
    // If clicking same chapter, close modal
    if (book.selectedChapter === chapter && book.showVerseModal) {
      book.showVerseModal = false;
    } else {
      book.selectedChapter = chapter;
      // Load verses for this chapter
      book.verses = await this.api.actions.getChapterVerses(book.name, chapter);
      book.selectedVerses.clear();
      book.showVerseModal = true;
    }

    // Update session
    this.session.selectedBook.set(book.name);
    this.session.selectedChapter.set(chapter);

    // Trigger change detection
    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);

    this.router.navigate(['/verses'], {
      queryParams: {
        book: book.name,
        chapter: chapter
      }
    });
  }

  onCloseVerseModal(book: ExpandedBook) {
    book.showVerseModal = false;
    book.selectedChapter = null;
    book.verses = [];
    book.selectedVerses.clear();

    // Trigger change detection
    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);
  }

  onToggleVerse(book: ExpandedBook, verseNumber: number) {
    if (book.selectedVerses.has(verseNumber)) {
      book.selectedVerses.delete(verseNumber);
    } else {
      book.selectedVerses.add(verseNumber);
    }

    // Trigger change detection
    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);
  }

  async onClearBible() {
    if (!confirm('Are you sure you want to clear the Bible data? This will remove all stored data.')) {
      return;
    }

    const result = await this.api.actions.clearBible();
    if (result.success) {
      this.bibleLoaded.set(false);
      this.oldTestamentExpanded.set([]);
      this.newTestamentExpanded.set([]);
    } else {
      alert('Failed to clear Bible: ' + (result.error || 'Unknown error'));
    }
  }

  async onShowVerses(book: ExpandedBook) {
    if (book.selectedChapter === null || book.selectedVerses.size === 0) {
      return;
    }

    const selectedVersesArray = Array.from(book.selectedVerses);
    await this.api.actions.openVerseWindow(
      book.name,
      book.selectedChapter,
      selectedVersesArray
    );

    // Close the modal
    this.onCloseVerseModal(book);
  }

  clearSelection() {
    this.selectedVerseData.set(null);
  }
}
