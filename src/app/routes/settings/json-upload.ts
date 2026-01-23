import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'jar-json-upload',
  imports: [],
  template: `
    <h2>Bible</h2>

    @if (bibleLoaded()) {
      <p>Bible data loaded.</p>
      <button type="button" (click)="onClearBible()">Clear Bible Data</button>
    }

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
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonUpload {
  private api = inject(Api);
  protected uploading = signal(false);
  protected uploadError = signal('');
  protected bibleLoaded = signal(false);
  

  async ngOnInit() {
    // Check if Bible is already loaded
    const loaded = await this.api.actions.isBibleLoaded();
    this.bibleLoaded.set(loaded);
  }

  protected async onFileSelected(event: Event) {
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

      if (!result.success) {
        
        this.uploadError.set(result.error || 'Failed to upload Bible');
      } else {
        this.bibleLoaded.set(true);
      }
    } catch (error) {
      this.uploadError.set('Invalid JSON file: ' + (error as Error).message);
    } finally {
      this.uploading.set(false);
    }
  }

  protected async onClearBible() {
    if (!confirm('Are you sure you want to clear the Bible data? This will remove all stored data.')) {
      return;
    }

    const result = await this.api.actions.clearBible();
    if (result.success) {
      this.bibleLoaded.set(false);
    } else {
      alert('Failed to clear Bible: ' + (result.error || 'Unknown error'));
    }
  }
}
