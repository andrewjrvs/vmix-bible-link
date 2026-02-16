import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'jar-window-settings',
  imports: [],
  template: `
    <h2>Window</h2>
    <div class="form-row">
      <label for="transparent">Transparent</label>
      <input
        id="transparent"
        type="checkbox"
        class="beos-input"
        [checked]="transparent()"
        (change)="onToggle($event)"
      />
    </div>

    @if (saved()) {
      <span class="status">Saved! (window will restart automatically)</span>
    }
  `,
  styles: `
    :host {
      display: block;
      margin-top: 24px;
    }

    h2 {
      font-size: 1.1rem;
      margin: 0 0 12px 0;
      color: #222;
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #555;
      min-width: 80px;
    }

    .beos-input {
      /* checkbox will render native appearance, styling not really needed */
    }

    .status {
      color: #555;
      font-size: 0.85rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowSettingsComponent {
  private api = inject(Api);

  protected transparent = signal(false);
  protected saved = signal(false);

  async ngOnInit() {
    try {
      this.transparent.set(await this.api.actions.getWindowTransparency());
    } catch {
      // ignore
    }
  }

  async onToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.transparent.set(checked);
    await this.api.actions.setWindowTransparency(checked);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
