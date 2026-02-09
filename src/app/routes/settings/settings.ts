import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jar-settings',
  imports: [RouterModule],
  template: `
    <div class="settings-container">
      <!-- BeOS-style Header -->
      <div class="settings-header">
        <h2 class="settings-title">Settings</h2>
      </div>

      <!-- Navigation Tabs -->
      <div class="settings-nav">
        <a routerLink="general" routerLinkActive="active" class="nav-tab beos-btn">
          General
        </a>
        <a routerLink="upload" routerLinkActive="active" class="nav-tab beos-btn">
          Upload
        </a>
        <a routerLink="display" routerLinkActive="active" class="nav-tab beos-btn">
          Display
        </a>
      </div>

      <!-- Child Route Content -->
      <div class="settings-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: `
    .settings-container {
      padding: 10px;
      background: #d9d9d9;
      font-family: 'Lucida Grande', 'Segoe UI', Tahoma, sans-serif;
      min-height: 100vh;
    }

    /* Header */
    .settings-header {
      padding: 10px;
      margin-bottom: 15px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      box-shadow: inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(0,0,0,0.2);
    }

    .settings-title {
      margin: 0;
      font-size: 1.2rem;
      color: #000;
      font-weight: bold;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.8);
    }

    /* Navigation Tabs */
    .settings-nav {
      display: flex;
      gap: 5px;
      margin-bottom: 10px;
      padding: 0 10px;
    }

    .nav-tab {
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
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        background: linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%);
      }

      &.active {
        background: linear-gradient(to bottom, #4a90e2 0%, #357abd 100%);
        color: white;
        border-color: #6aa8f0 #2a5f9a #2a5f9a #6aa8f0;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
      }
    }

    /* Content Area */
    .settings-content {
      padding: 20px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.2);
      min-height: 400px;
      margin: 0 10px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {}
