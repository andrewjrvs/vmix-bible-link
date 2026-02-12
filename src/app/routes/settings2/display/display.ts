import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jar-display',
  imports: [],
  template: `
    <div class="display-settings">
      <h3 class="section-title">Display Settings</h3>

      <div class="setting-group beos-panel">
        <label class="setting-label">Font Size:</label>
        <input type="range" min="12" max="24" value="16" class="slider" />
        <span class="value-display">16px</span>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">Theme:</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="theme" value="light" checked />
            Light (BeOS Classic)
          </label>
          <label>
            <input type="radio" name="theme" value="dark" />
            Dark
          </label>
        </div>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">Verse Layout:</label>
        <select class="setting-select">
          <option>Single Column</option>
          <option>Two Columns</option>
          <option selected>Four Columns (Book Style)</option>
        </select>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">
          <input type="checkbox" checked /> Show verse numbers
        </label>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">
          <input type="checkbox" /> Enable smooth scrolling
        </label>
      </div>

      <div class="button-group">
        <button class="beos-btn save-btn">Save Changes</button>
        <button class="beos-btn">Reset to Defaults</button>
      </div>
    </div>
  `,
  styles: `
    .display-settings {
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

    .setting-select {
      width: 100%;
      padding: 6px 8px;
      background: #fff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      font-size: 0.9rem;
      color: #000;
      cursor: pointer;
    }

    .slider {
      width: calc(100% - 60px);
      margin-right: 10px;
      vertical-align: middle;
    }

    .value-display {
      display: inline-block;
      min-width: 50px;
      font-weight: bold;
      color: #4a90e2;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .radio-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
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

    .save-btn {
      background: linear-gradient(to bottom, #6bc76b 0%, #4db84d 100%);
      color: white;
      border-color: #8fd98f #3a9a3a #3a9a3a #8fd98f;
      text-shadow: 1px 1px 0 rgba(0,0,0,0.3);

      &:hover {
        background: linear-gradient(to bottom, #7bd77b 0%, #5dc85d 100%);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Display {}
