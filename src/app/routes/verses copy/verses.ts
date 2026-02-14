import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';
import { VerseInfo } from '../../../electron/api';

interface VerseDisplay extends VerseInfo {
  isSelected: boolean;
  isUserSelected: boolean;
}

@Component({
  selector: 'jar-verses',
  imports: [CommonModule],
  template: `
    <div class="window-container">
      <!-- BeOS-style Title Bar -->
      <div class="titlebar">
        <span class="titlebar-text">{{ bookName() }} {{ chapterNumber() }}</span>
        <div class="titlebar-actions">
          @if (userSelectedVerses().size > 0) {
            <button class="confirm-btn beos-btn" (click)="confirmSelection()">
              Confirm Selection ({{ userSelectedVerses().size }})
            </button>
          }
          <button class="close-btn beos-btn" (click)="closeWindow()">✕</button>
        </div>
      </div>

      <!-- Book Content -->
      <div class="book-container">
        @if (loading()) {
          <div class="loading">Loading verses...</div>
        } @else if (error()) {
          <div class="error">{{ error() }}</div>
        } @else {
          <!-- Book Layout: 2 pages side by side, 2 columns each -->
          <div class="book-spread">
            <!-- Left Page -->
            <div class="page left-page">
              <div class="page-columns">
                <div class="column">
                  @for (verse of leftPageColumn1(); track verse.verse) {
                    <div class="verse-item"
                         [class.highlighted]="verse.isSelected"
                         [class.user-selected]="verse.isUserSelected"
                         [id]="'verse-' + verse.verse"
                         (click)="toggleVerseSelection(verse)">
                      <span class="verse-number">{{ verse.verse }}</span>
                      <span class="verse-text">{{ verse.text }}</span>
                    </div>
                  }
                </div>
                <div class="column">
                  @for (verse of leftPageColumn2(); track verse.verse) {
                    <div class="verse-item"
                         [class.highlighted]="verse.isSelected"
                         [class.user-selected]="verse.isUserSelected"
                         [id]="'verse-' + verse.verse"
                         (click)="toggleVerseSelection(verse)">
                      <span class="verse-number">{{ verse.verse }}</span>
                      <span class="verse-text">{{ verse.text }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Spine/Gutter -->
            <div class="spine"></div>

            <!-- Right Page -->
            <div class="page right-page">
              <div class="page-columns">
                <div class="column">
                  @for (verse of rightPageColumn1(); track verse.verse) {
                    <div class="verse-item"
                         [class.highlighted]="verse.isSelected"
                         [class.user-selected]="verse.isUserSelected"
                         [id]="'verse-' + verse.verse"
                         (click)="toggleVerseSelection(verse)">
                      <span class="verse-number">{{ verse.verse }}</span>
                      <span class="verse-text">{{ verse.text }}</span>
                    </div>
                  }
                </div>
                <div class="column">
                  @for (verse of rightPageColumn2(); track verse.verse) {
                    <div class="verse-item"
                         [class.highlighted]="verse.isSelected"
                         [class.user-selected]="verse.isUserSelected"
                         [id]="'verse-' + verse.verse"
                         (click)="toggleVerseSelection(verse)">
                      <span class="verse-number">{{ verse.verse }}</span>
                      <span class="verse-text">{{ verse.text }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
      background: #d9d9d9;
    }

    .window-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #d9d9d9;
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
    }

    /* BeOS Titlebar */
    .titlebar {
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      padding: 6px 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
      flex-shrink: 0;
    }

    .titlebar-text {
      font-weight: bold;
      font-size: 1rem;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
    }

    .titlebar-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .beos-btn {
      padding: 4px 10px;
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
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
        color: white;
      }

      &:active {
        background: linear-gradient(to bottom, #c0c0c0 0%, #d8d8d8 100%);
        border-color: #606060 #ffffff #ffffff #606060;
        box-shadow: inset 1px 1px 2px rgba(0,0,0,0.3);
      }
    }

    .close-btn {
      padding: 2px 8px;
      font-size: 1rem;
      line-height: 1;
      min-width: auto;
    }

    .confirm-btn {
      padding: 4px 12px;
      font-size: 0.9rem;
      background: linear-gradient(to bottom, #6bc76b 0%, #4db84d 100%);
      color: white;
      border-color: #8fd98f #3a9a3a #3a9a3a #8fd98f;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #7bd77b 0%, #5dc85d 100%);
      }
    }

    /* Book Container */
    .book-container {
      flex: 1;
      overflow: auto;
      padding: 20px;
      background: #f5f5dc; /* Aged paper color */
    }

    .loading, .error {
      text-align: center;
      padding: 40px;
      font-size: 1.1rem;
      color: #333;
    }

    .error {
      color: #cc0000;
    }

    /* Book Spread Layout */
    .book-spread {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      gap: 0;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      min-height: 100%;
    }

    .page {
      flex: 1;
      padding: 30px 20px;
      background: linear-gradient(to bottom, #fefefe 0%, #f8f8f0 100%);
    }

    .left-page {
      border-right: none;
    }

    .right-page {
      border-left: none;
    }

    /* Spine between pages */
    .spine {
      width: 4px;
      background: linear-gradient(to right, #ccc 0%, #999 50%, #ccc 100%);
      box-shadow: inset 0 0 3px rgba(0,0,0,0.4);
      flex-shrink: 0;
    }

    /* Page Columns */
    .page-columns {
      display: flex;
      gap: 20px;
      height: 100%;
    }

    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Verse Styles */
    .verse-item {
      display: flex;
      gap: 8px;
      padding: 4px;
      border-radius: 2px;
      transition: background-color 0.2s, transform 0.1s;
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 0.95rem;
      line-height: 1.5;
      color: #222;
      cursor: pointer;

      &:hover {
        background: rgba(74, 144, 226, 0.1);
        transform: translateX(2px);
      }

      &.highlighted {
        background: linear-gradient(to right, #fffacd 0%, #fff4a3 100%);
        border-left: 3px solid #ffd700;
        padding-left: 6px;
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      &.user-selected {
        background: linear-gradient(to right, #b3e5b3 0%, #99db99 100%);
        border-left: 3px solid #4db84d;
        padding-left: 6px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }
    }

    .verse-number {
      font-weight: bold;
      color: #4a90e2;
      min-width: 25px;
      flex-shrink: 0;
      font-size: 0.85rem;
      padding-top: 2px;
    }

    .verse-text {
      flex: 1;
      text-align: justify;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verses {
  private api = inject(Api);
  private route = inject(ActivatedRoute);

  protected bookName = signal('');
  protected chapterNumber = signal(0);
  protected loading = signal(true);
  protected error = signal('');
  protected verses = signal<VerseDisplay[]>([]);

  // 4 columns for book layout
  protected leftPageColumn1 = signal<VerseDisplay[]>([]);
  protected leftPageColumn2 = signal<VerseDisplay[]>([]);
  protected rightPageColumn1 = signal<VerseDisplay[]>([]);
  protected rightPageColumn2 = signal<VerseDisplay[]>([]);
  protected userSelectedVerses = signal<Set<number>>(new Set());

  async ngOnInit() {
    // Get parameters from URL
    this.route.queryParams.subscribe(async params => {
      const bookName = params['book'];
      const chapter = parseInt(params['chapter'], 10);
      const selectedVersesStr = params['verses'] || '';
      const selectedVerses = selectedVersesStr
        ? selectedVersesStr.split(',').map((v: string) => parseInt(v, 10))
        : [];

      this.bookName.set(bookName);
      this.chapterNumber.set(chapter);

      try {
        const verseData = await this.api.actions.getChapterVerses(bookName, chapter);

        // Mark selected verses (highlighted from previous selection)
        const versesWithSelection: VerseDisplay[] = verseData.map(v => ({
          ...v,
          isSelected: selectedVerses.includes(v.verse),
          isUserSelected: false
        }));

        this.verses.set(versesWithSelection);

        // Split verses into 4 columns
        this.distributeVersesToColumns(versesWithSelection);

        this.loading.set(false);

        // Scroll to first selected verse
        setTimeout(() => {
          const firstSelected = selectedVerses[0];
          if (firstSelected) {
            const element = document.getElementById(`verse-${firstSelected}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 100);
      } catch (err) {
        this.error.set('Failed to load verses: ' + (err as Error).message);
        this.loading.set(false);
      }
    });
  }

  private distributeVersesToColumns(verses: VerseDisplay[]) {
    const totalVerses = verses.length;
    const versesPerColumn = Math.ceil(totalVerses / 4);

    this.leftPageColumn1.set(verses.slice(0, versesPerColumn));
    this.leftPageColumn2.set(verses.slice(versesPerColumn, versesPerColumn * 2));
    this.rightPageColumn1.set(verses.slice(versesPerColumn * 2, versesPerColumn * 3));
    this.rightPageColumn2.set(verses.slice(versesPerColumn * 3));
  }

  toggleVerseSelection(verse: VerseDisplay) {
    const currentSelection = this.userSelectedVerses();
    const newSelection = new Set(currentSelection);

    if (newSelection.has(verse.verse)) {
      newSelection.delete(verse.verse);
      verse.isUserSelected = false;
    } else {
      newSelection.add(verse.verse);
      verse.isUserSelected = true;
    }

    this.userSelectedVerses.set(newSelection);

    // Update all columns to reflect the change
    this.leftPageColumn1.set([...this.leftPageColumn1()]);
    this.leftPageColumn2.set([...this.leftPageColumn2()]);
    this.rightPageColumn1.set([...this.rightPageColumn1()]);
    this.rightPageColumn2.set([...this.rightPageColumn2()]);
  }

  async confirmSelection() {
    const selectedVerseNumbers = Array.from(this.userSelectedVerses());
    const selectedVersesData = this.verses().filter(v =>
      selectedVerseNumbers.includes(v.verse)
    );

    // Send selection back to main window via IPC
    await this.api.actions.sendVerseSelection(
      this.bookName(),
      this.chapterNumber(),
      selectedVersesData.map(v => ({ verse: v.verse, text: v.text }))
    );

    // Close window
    this.closeWindow();
  }

  closeWindow() {
    this.api.actions.closeWindow();
  }
}
