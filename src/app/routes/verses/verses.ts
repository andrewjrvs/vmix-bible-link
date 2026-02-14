import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPaperPlane, faDisplay, faBroom, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Api } from '../../services/api';
import { VerseInfo, VmixState } from '../../../electron/api';

interface VerseDisplay extends VerseInfo {
  isSelected: boolean;
  isUserSelected: boolean;
}

@Component({
  selector: 'jar-verses',
  imports: [CommonModule, FontAwesomeModule],
  host: { '[class.has-selection]': 'userSelectedVerses().size > 0' },
  template: `
    <h1>{{ bookName() | titlecase }} {{ chapterNumber() }}</h1>
    <div class="window-container">
      <!-- Book Content -->
      <div class="book-container">
        @if (loading()) {
          <div class="loading">Loading verses...</div>
        } @else if (error()) {
          <div class="error">{{ error() }}</div>
        } @else {
          <!-- Book Layout: 2 pages side by side, 2 columns each -->
          <div class="book-spread">
            @for (verse of verses(); track verse.verse) {
              <div id="verse-{{verse.verse}}" class="verse-item {{ verse.isSelected ? 'highlighted' : '' }} {{ verse.isUserSelected ? 'user-selected' : '' }}" (click)="toggleVerseSelection(verse)">
                <div class="verse-number">{{ verse.verse }}</div>
                <div class="verse-text">{{ verse.text }}</div>
              </div>
            } 
          </div>
        }
      </div>
    </div>

    @if (userSelectedVerses().size > 0) {
      <div class="action-bar">
        <span class="verse-ref">{{ formattedReference() }}</span>
        @if (vmixState(); as state) {
          <span class="vmix-status" [class]="'vmix-status vmix-' + state.inputStatus" [title]="state.inputName">
            {{ state.inputStatus === 'active' ? 'LIVE' : state.inputStatus === 'preview' ? 'PRV' : state.inputStatus === 'inactive' ? 'OFF' : '' }}
          </span>
        }
        <div class="action-buttons">
          <button class="beos-btn action-btn clear-btn" title="Clear selection" (click)="clearSelection()">
            <fa-icon [icon]="clearIcon" />
          </button>
          <button class="beos-btn action-btn" title="Save" (click)="onSave()">
            <fa-icon [icon]="faFloppyDisk" />
          </button>
          <button class="beos-btn action-btn" title="Save &amp; Send" (click)="onSaveAndSend()">
            <fa-icon [icon]="faPaperPlane" />
          </button>
          <button class="beos-btn action-btn" title="Save, Send &amp; Show" (click)="onSaveAndSendAndShow()">
            <fa-icon [icon]="faDisplay" />
          </button>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 30px;
      margin: -10px;
      background: #f5f5dc; /* Aged paper color */

      &.has-selection {
        padding-bottom: 90px;
      }
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
      max-width: 1400px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      min-height: 100%;
      padding: 0 2px 0 0;
      column-count: 3;
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

    /* Action Bar */
    .action-bar {
      position: fixed;
      bottom: 16px;
      right: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.35);
      z-index: 100;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .verse-ref {
      font-weight: 600;
      font-size: 0.9rem;
      color: #222;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .action-btn {
      padding: 6px 10px;
      font-size: 1rem;
      min-width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vmix-status {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .vmix-active {
      background: #cc0000;
      color: #fff;
    }

    .vmix-preview {
      background: #4db84d;
      color: #fff;
    }

    .vmix-inactive {
      background: #888;
      color: #fff;
    }

    .vmix-unknown {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Verses {
  private api = inject(Api);
  private route = inject(ActivatedRoute);

  protected faFloppyDisk = faFloppyDisk;
  protected faPaperPlane = faPaperPlane;
  protected faDisplay = faDisplay;
  protected clearIcon = faTrashCan;

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
  protected vmixState = signal<VmixState | null>(null);
  private vmixPollTimer: ReturnType<typeof setInterval> | null = null;

  protected formattedReference = computed(() => {
    const selected = Array.from(this.userSelectedVerses()).sort((a, b) => a - b);
    if (selected.length === 0) return '';

    // Group consecutive numbers into ranges
    const ranges: string[] = [];
    let rangeStart = selected[0];
    let rangeEnd = selected[0];

    for (let i = 1; i < selected.length; i++) {
      if (selected[i] === rangeEnd + 1) {
        rangeEnd = selected[i];
      } else {
        ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`);
        rangeStart = selected[i];
        rangeEnd = selected[i];
      }
    }
    ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`);

    const book = this.bookName().charAt(0).toUpperCase() + this.bookName().slice(1);
    return `${book} ${this.chapterNumber()}:${ranges.join(', ')}`;
  });

  ngOnDestroy() {
    if (this.vmixPollTimer) {
      clearInterval(this.vmixPollTimer);
    }
  }

  async ngOnInit() {
    this.pollVmixState();
    this.vmixPollTimer = setInterval(() => this.pollVmixState(), 3000);

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

  clearSelection() {
    this.userSelectedVerses.set(new Set());
    const updated = this.verses().map(v => ({ ...v, isUserSelected: false }));
    this.verses.set(updated);
    this.distributeVersesToColumns(updated);
  }

  private async pollVmixState() {
    try {
      const state = await this.api.actions.getVmixState();
      this.vmixState.set(state);
    } catch {
      this.vmixState.set(null);
    }
  }

  private getSelectedVersesData() {
    const selectedNumbers = Array.from(this.userSelectedVerses()).sort((a, b) => a - b);
    const selectedVerses = this.verses().filter(v => selectedNumbers.includes(v.verse));

    const parts: string[] = [];
    for (let i = 0; i < selectedVerses.length; i++) {
      if (i > 0 && selectedVerses[i].verse !== selectedVerses[i - 1].verse + 1) {
        parts.push('...');
      }
      parts.push(selectedVerses[i].text);
    }

    return {
      title: this.formattedReference(),
      body: parts.join(' '),
    };
  }

  async onSave() {
    await this.api.actions.saveVerseGroup(this.getSelectedVersesData());
    this.clearSelection();
  }

  async onSaveAndSend() {
    const data = this.getSelectedVersesData();
    await this.api.actions.saveVerseGroup(data);
    await this.api.actions.sendToVmix(data.title, data.body);
    this.clearSelection();
  }

  async onSaveAndSendAndShow() {
    const data = this.getSelectedVersesData();
    await this.api.actions.saveVerseGroup(data);
    await this.api.actions.sendToVmix(data.title, data.body);
    this.clearSelection();
  }
}
