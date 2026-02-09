import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jar-upload',
  imports: [],
  template: `
    <div class="upload-settings">
      <h3 class="section-title">Upload Settings</h3>

      <div class="setting-group beos-panel">
        <label class="setting-label">Upload Bible JSON File:</label>
        <p class="help-text">Upload a new Bible JSON file to replace the current one.</p>
        <input
          type="file"
          accept=".json"
          class="file-input"
        />
        <button class="beos-btn upload-btn">Upload</button>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">Supported Formats:</label>
        <ul class="format-list">
          <li>JSON format from SWORD-to-JSON</li>
          <li>Custom Bible JSON with books/chapters/verses structure</li>
        </ul>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">Current Bible:</label>
        <p class="current-bible">King James Version (KJV)</p>
        <button class="beos-btn danger-btn">Remove Current Bible</button>
      </div>
    </div>
  `,
  styles: `
    .upload-settings {
      max-width: 600px;
    }

    .section-title {
      margin: 0 0 20px 0;
      font-size: 1.1rem;
      color: #000;
      font-weight: bold;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
    }

    .setting-group {
      margin-bottom: 15px;
      padding: 15px;
      background: #f0f0f0;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
    }

    .beos-panel {
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.1);
    }

    .setting-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #000;
    }

    .help-text {
      margin: 5px 0 10px 0;
      color: #666;
      font-size: 0.85rem;
    }

    .file-input {
      width: 100%;
      padding: 6px;
      background: #fff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      margin-bottom: 10px;
    }

    .format-list {
      margin: 5px 0;
      padding-left: 20px;
      color: #333;
    }

    .format-list li {
      margin-bottom: 5px;
    }

    .current-bible {
      margin: 5px 0 10px 0;
      padding: 8px;
      background: #fff;
      border: 1px solid #ccc;
      font-weight: bold;
      color: #4a90e2;
    }

    .beos-btn {
      padding: 8px 16px;
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

    .upload-btn {
      background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
      color: white;
      border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #5aa0f2 0%, #458bcd 100%);
      }
    }

    .danger-btn {
      background: linear-gradient(to bottom, #ff6b6b 0%, #ee5555 100%);
      color: white;
      border-color: #ff8b8b #cc4444 #cc4444 #ff8b8b;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Upload {}
