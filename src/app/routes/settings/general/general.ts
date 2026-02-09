import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jar-general',
  imports: [],
  template: `
    <div class="general-settings">
      <h3 class="section-title">General Settings</h3>

      <div class="setting-group beos-panel">
        <label class="setting-label">Application Name:</label>
        <input type="text" class="setting-input" value="Bible Reader" />
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">Language:</label>
        <select class="setting-select">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      <div class="setting-group beos-panel">
        <label class="setting-label">
          <input type="checkbox" checked /> Enable notifications
        </label>
      </div>

      <div class="button-group">
        <button class="beos-btn save-btn">Save Changes</button>
        <button class="beos-btn">Cancel</button>
      </div>
    </div>
  `,
  styles: `
    .general-settings {
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

    .setting-input,
    .setting-select {
      width: 100%;
      padding: 6px 8px;
      background: #fff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      font-size: 0.9rem;
      color: #000;
    }

    .setting-select {
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
export class General {}
