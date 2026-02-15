import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { VmixState } from '../../../electron/api';

@Component({
  selector: 'jar-body',
  imports: [RouterModule],
  template: `
    <nav>
      <ul>
        <li class="nav-disabled"><button type="button" ><img src="icons/search.svg" /> <span>Search</span> </button></li>
        <li><button type="button" routerLinkActive="selected" [routerLinkActiveOptions]="{exact: true}" routerLink="/"><img src="icons/bookmark.svg" /> <span>Bible</span> </button></li>
        <li class="nav-disabled"><button type="button" routerLinkActive="selected" routerLink="/verses" [queryParams]="{ book: 'genesis', chapter: '1' }"><img src="icons/blocks.svg" /> <span>Verses</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/saved"><img src="icons/desktop.svg" /> <span>Saved</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/settings"><img src="icons/edit.svg" /> <span>Settings</span> </button></li>
      </ul>
      @if (vmixState(); as state) {
        <span class="vmix-indicator" [class]="'vmix-indicator vmix-' + state.inputStatus" [title]="state.inputName">
          {{ state.inputStatus === 'active' ? 'LIVE' : state.inputStatus === 'preview' ? 'PRV' : state.inputStatus === 'inactive' ? 'OFF' : '' }}
        </span>
      }
    </nav>
    <main><ng-content></ng-content></main>
  `,
  styles: `
    @use '../../../styles/window';
    :host {
      @include window.body();
    }

    .vmix-indicator {
      margin-left: auto;
      margin-right: 10px;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      align-self: center;
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
export class Body implements OnInit, OnDestroy {
  private api = inject(Api);
  protected vmixState = signal<VmixState | null>(null);
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.pollVmixState();
    this.pollTimer = setInterval(() => this.pollVmixState(), 3000);
  }

  ngOnDestroy() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
  }

  private async pollVmixState() {
    try {
      const state = await this.api.actions.getVmixState();
      this.vmixState.set(state);
    } catch {
      this.vmixState.set(null);
    }
  }
}
