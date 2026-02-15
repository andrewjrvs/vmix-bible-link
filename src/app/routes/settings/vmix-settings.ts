import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { VmixInput, VmixSettings } from '../../../electron/api';

@Component({
  selector: 'jar-vmix-settings',
  imports: [FormsModule],
  template: `
    <h2>vMix Connection</h2>

    <div class="form-row">
      <label>Host</label>
      <input class="beos-input" [(ngModel)]="host" placeholder="127.0.0.1" />
    </div>
    <div class="form-row">
      <label>Port</label>
      <input class="beos-input" type="number" [(ngModel)]="port" placeholder="8088" />
    </div>
    <div class="form-row">
      <button class="beos-btn" (click)="refreshInputs()">Refresh Inputs</button>
      @if (connectionError()) {
        <span class="error">{{ connectionError() }}</span>
      }
      @if (loadingInputs()) {
        <span class="status">Loading...</span>
      }
    </div>

    @if (inputs().length > 0) {
      <h3>Input</h3>
      <div class="form-row">
        <label>Select Input</label>
        <select class="beos-input" [(ngModel)]="selectedInputKey" (ngModelChange)="onInputSelected()">
          <option value="">-- Select --</option>
          @for (input of inputs(); track input.key) {
            <option [value]="input.key">{{ input.number }}: {{ input.name }} ({{ input.type }})</option>
          }
        </select>
      </div>
    }

    @if (selectedFields().length > 0) {
      <h3>Field Mapping</h3>
      <div class="form-row">
        <label>Title Field</label>
        <select class="beos-input" [(ngModel)]="titleField">
          <option value="">-- None --</option>
          @for (field of selectedFields(); track field) {
            <option [value]="field">{{ field }}</option>
          }
        </select>
      </div>
      <div class="form-row">
        <label>Body Field</label>
        <select class="beos-input" [(ngModel)]="bodyField">
          <option value="">-- None --</option>
          @for (field of selectedFields(); track field) {
            <option [value]="field">{{ field }}</option>
          }
        </select>
      </div>
      <div class="form-row">
        <label>Overlay</label>
        <select class="beos-input" [(ngModel)]="overlay">
          @for (n of overlayOptions; track n) {
            <option [value]="n">Overlay {{ n }}</option>
          }
        </select>
      </div>
    }

    <div class="form-row actions">
      <button class="beos-btn save-btn" (click)="save()">Save vMix Settings</button>
      @if (saved()) {
        <span class="status">Saved!</span>
      }
    </div>
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

    h3 {
      font-size: 0.95rem;
      margin: 16px 0 8px 0;
      color: #333;
    }

    .form-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .form-row.actions {
      margin-top: 16px;
    }

    label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #555;
      min-width: 80px;
    }

    .beos-input {
      padding: 4px 8px;
      border: 2px solid;
      border-color: #606060 #ffffff #ffffff #606060;
      background: #fff;
      font-size: 0.9rem;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: #4a90e2 #a0c4f0 #a0c4f0 #4a90e2;
      }
    }

    select.beos-input {
      min-width: 200px;
    }

    .beos-btn {
      padding: 4px 10px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      color: #000;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 500;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

      &:hover {
        background: linear-gradient(to bottom, #d8d8d8 0%, #b8b8b8 100%);
      }

      &:active {
        background: linear-gradient(to bottom, #c0c0c0 0%, #d8d8d8 100%);
        border-color: #606060 #ffffff #ffffff #606060;
        box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
      }
    }

    .save-btn {
      background: linear-gradient(to bottom, #6bc76b 0%, #4db84d 100%);
      color: white;
      border-color: #8fd98f #3a9a3a #3a9a3a #8fd98f;

      &:hover {
        background: linear-gradient(to bottom, #7bd77b 0%, #5dc85d 100%);
      }
    }

    .error {
      color: #cc0000;
      font-size: 0.85rem;
    }

    .status {
      color: #555;
      font-size: 0.85rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmixSettingsComponent {
  private api = inject(Api);

  protected host = '127.0.0.1';
  protected port = 8088;
  protected selectedInputKey = '';
  protected titleField = '';
  protected bodyField = '';
  protected overlay = 1;
  protected overlayOptions = [1, 2, 3, 4];

  protected inputs = signal<VmixInput[]>([]);
  protected selectedFields = signal<string[]>([]);
  protected loadingInputs = signal(false);
  protected connectionError = signal('');
  protected saved = signal(false);

  async ngOnInit() {
    const settings = await this.api.actions.getVmixSettings();
    this.host = settings.host;
    this.port = settings.port;
    this.selectedInputKey = settings.inputKey;
    this.titleField = settings.titleField;
    this.bodyField = settings.bodyField;
    this.overlay = settings.overlay || 1;
  }

  async refreshInputs() {
    this.loadingInputs.set(true);
    this.connectionError.set('');
    try {
      const result = await this.api.actions.getVmixInputs(this.host, this.port);
      this.inputs.set(result);

      // Restore field list if previously selected input is still available
      if (this.selectedInputKey) {
        const match = result.find(i => i.key === this.selectedInputKey);
        if (match) {
          this.selectedFields.set(match.textFields);
        }
      }
    } catch (err) {
      this.connectionError.set('Could not connect to vMix: ' + (err as Error).message);
      this.inputs.set([]);
    } finally {
      this.loadingInputs.set(false);
    }
  }

  onInputSelected() {
    const input = this.inputs().find(i => i.key === this.selectedInputKey);
    this.selectedFields.set(input ? input.textFields : []);
    this.titleField = '';
    this.bodyField = '';
  }

  async save() {
    const input = this.inputs().find(i => i.key === this.selectedInputKey);
    const settings: VmixSettings = {
      host: this.host,
      port: this.port,
      inputKey: this.selectedInputKey,
      inputName: input?.name || '',
      titleField: this.titleField,
      bodyField: this.bodyField,
      overlay: this.overlay,
    };
    await this.api.actions.saveVmixSettings(settings);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
