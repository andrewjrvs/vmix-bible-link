import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
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
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h2 class="title">Bible Reader</h2>
        @if (bibleLoaded()) {
          <button class="beos-btn clear-btn" (click)="onClearBible()">Clear Bible</button>
        }
      </div>

      @if (selectedVerseData()) {
        <div class="selected-verses-section">
          <div class="selected-verses-panel beos-panel">
            <div class="selected-verses-header">
              <h3>{{ selectedVerseData()!.book }} {{ selectedVerseData()!.chapter }}</h3>
              <button class="close-selection-btn beos-btn" (click)="clearSelection()">✕</button>
            </div>
            <div class="selected-verses-list">
              @for (verse of selectedVerseData()!.verses; track verse.verse) {
                <div class="selected-verse-item">
                  <span class="verse-ref">{{ verse.verse }}</span>
                  <span class="verse-content">{{ verse.text }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (!bibleLoaded()) {
        <div class="upload-section">
          <div class="beos-panel">
            <p>Upload a Bible JSON file to get started</p>
            <input
              type="file"
              accept=".json"
              (change)="onFileSelected($event)"
              class="file-input"
              #fileInput
            />
            @if (uploading()) {
              <p class="status">Uploading...</p>
            }
            @if (uploadError()) {
              <p class="error">{{ uploadError() }}</p>
            }
          </div>
        </div>
      } @else {
        <div class="books-section">
          <div class="testament-section">
            <div class="testament-header">Old Testament</div>
            <div class="books-list">
              @for (book of oldTestamentExpanded(); track book.name) {
                <div class="book-accordion">
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
                          Chapter {{ chapter }}
                        </button>
                      }
                    </div>

                    @if (book.showVerseModal && book.selectedChapter !== null && book.verses.length > 0) {
                      <div class="modal-overlay" (click)="onCloseVerseModal(book)">
                        <div class="modal-window" (click)="$event.stopPropagation()">
                          <div class="modal-titlebar">
                            <span class="modal-title">{{ book.name }} {{ book.selectedChapter }} - Select Verses</span>
                            <button class="modal-close-btn beos-btn" (click)="onCloseVerseModal(book)">✕</button>
                          </div>
                          <div class="modal-content">
                            <div class="verses-grid">
                              @for (verse of book.verses; track verse.verse) {
                                <button
                                  class="verse-btn beos-btn"
                                  [class.selected]="book.selectedVerses.has(verse.verse)"
                                  (click)="onToggleVerse(book, verse.verse)"
                                >
                                  {{ verse.verse }}
                                </button>
                              }
                            </div>
                            @if (book.selectedVerses.size > 0) {
                              <div class="modal-actions">
                                <button class="show-verses-btn beos-btn" (click)="onShowVerses(book)">
                                  Show Verses ({{ book.selectedVerses.size }} selected)
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </div>
          </div>

          <div class="testament-section">
            <div class="testament-header">New Testament</div>
            <div class="books-list">
              @for (book of newTestamentExpanded(); track book.name) {
                <div class="book-accordion">
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
                          Chapter {{ chapter }}
                        </button>
                      }
                    </div>

                    @if (book.showVerseModal && book.selectedChapter !== null && book.verses.length > 0) {
                      <div class="modal-overlay" (click)="onCloseVerseModal(book)">
                        <div class="modal-window" (click)="$event.stopPropagation()">
                          <div class="modal-titlebar">
                            <span class="modal-title">{{ book.name }} {{ book.selectedChapter }} - Select Verses</span>
                            <button class="modal-close-btn beos-btn" (click)="onCloseVerseModal(book)">✕</button>
                          </div>
                          <div class="modal-content">
                            <div class="verses-grid">
                              @for (verse of book.verses; track verse.verse) {
                                <button
                                  class="verse-btn beos-btn"
                                  [class.selected]="book.selectedVerses.has(verse.verse)"
                                  (click)="onToggleVerse(book, verse.verse)"
                                >
                                  {{ verse.verse }}
                                </button>
                              }
                            </div>
                            @if (book.selectedVerses.size > 0) {
                              <div class="modal-actions">
                                <button class="show-verses-btn beos-btn" (click)="onShowVerses(book)">
                                  Show Verses ({{ book.selectedVerses.size }} selected)
                                </button>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      border: 2px solid red;
      display: block;
    }
    /* BeOS-inspired styling */
    .container {
      padding: 10px;
      background: #d9d9d9;
      font-family: 'Lucida Grande', 'Segoe UI', Tahoma, sans-serif;
      min-height: 100vh;

    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-bottom: 15px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      box-shadow: inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(0,0,0,0.2);
    }

    .title {
      margin: 0;
      font-size: 1.2rem;
      color: #000;
      font-weight: bold;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
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

    .clear-btn {
      background: linear-gradient(to bottom, #ff6b6b 0%, #ee5555 100%);
      color: white;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
      }
    }

    /* Upload Section */
    .upload-section {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
    }

    .beos-panel {
      padding: 20px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      min-width: 400px;
    }

    .beos-panel p {
      margin: 0 0 15px 0;
      color: #000;
      font-weight: 500;
    }

    .file-input {
      width: 100%;
      padding: 6px;
      background: #fff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      margin-bottom: 10px;
    }

    .status {
      color: #0066cc;
      font-weight: bold;
    }

    .error {
      color: #cc0000;
      font-weight: bold;
    }

    /* Books Section */
    .books-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .testament-section {
      background: #d9d9d9;
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
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
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

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    /* Modal Window - BeOS Style */
    .modal-window {
      background: #d9d9d9;
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
      min-width: 500px;
      max-width: 700px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    /* Modal Titlebar */
    .modal-titlebar {
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      padding: 6px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
    }

    .modal-title {
      font-weight: bold;
      font-size: 0.95rem;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
    }

    .modal-close-btn {
      padding: 2px 8px;
      font-size: 1rem;
      line-height: 1;
      min-width: auto;
      background: linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 100%);

      &:hover {
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
        color: white;
      }
    }

    /* Modal Content */
    .modal-content {
      padding: 12px;
      background: #f0f0f0;
      overflow-y: auto;
      flex: 1;
    }

    .verses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
      gap: 4px;
    }

    .verse-btn {
      padding: 6px 8px;
      font-size: 0.85rem;
      white-space: nowrap;
      text-align: center;

      &.selected {
        background: linear-gradient(to bottom, #6bc76b 0%, #4db84d 100%);
        color: white;
        border-color: #8fd98f #3a9a3a #3a9a3a #8fd98f;
      }
    }

    /* Modal Actions */
    .modal-actions {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      display: flex;
      justify-content: center;
    }

    .show-verses-btn {
      padding: 8px 16px;
      font-size: 1rem;
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #5aa0f2 0%, #458bcd 100%);
      }
    }

    /* Selected Verses Display Section */
    .selected-verses-section {
      margin-bottom: 20px;
    }

    .selected-verses-panel {
      padding: 0;
      max-width: 100%;
    }

    .selected-verses-header {
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
    }

    .selected-verses-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: bold;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
    }

    .close-selection-btn {
      padding: 2px 8px;
      font-size: 1rem;
      line-height: 1;
      min-width: auto;
      background: linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 100%);

      &:hover {
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
        color: white;
      }
    }

    .selected-verses-list {
      padding: 12px;
      background: #f0f0f0;
      max-height: 300px;
      overflow-y: auto;
    }

    .selected-verse-item {
      display: flex;
      gap: 12px;
      padding: 8px;
      margin-bottom: 6px;
      background: white;
      border: 1px solid;
      border-color: #c0c0c0 #ffffff #ffffff #c0c0c0;
      box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .verse-ref {
      font-weight: bold;
      color: #4a90e2;
      min-width: 30px;
      flex-shrink: 0;
    }

    .verse-content {
      flex: 1;
      color: #222;
      line-height: 1.5;
      font-family: 'Georgia', 'Times New Roman', serif;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private api = inject(Api);

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
    }

    // Listen for verse selections from verse reader window
    this.api.actions.onVerseSelection((data: SelectedVerseData) => {
      this.selectedVerseData.set(data);
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

    // Trigger change detection
    this.oldTestamentExpanded.set([...this.oldTestamentExpanded()]);
    this.newTestamentExpanded.set([...this.newTestamentExpanded()]);
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
