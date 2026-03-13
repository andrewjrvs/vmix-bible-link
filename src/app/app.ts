import { ChangeDetectionStrategy, Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Window } from "./framework/window/window";
import { Api } from './services/api';

@Component({
  selector: 'jar-root',
  imports: [RouterOutlet, Window],
  template: `
    <jar-window (actions)="onWindowAction($event)">
      <span title>{{title()}}</span>
      <div body>
        <router-outlet></router-outlet>
      </div>
    </jar-window>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly title = signal('VMIX Bible Link');
  protected readonly api = inject(Api);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  async ngOnInit() {
    try {
      const transparent = await this.api.actions.getWindowTransparency();
      if (!transparent) {
        this.renderer.addClass(this.document.body, 'no-transparency');
      }
    } catch {
      // ignore
    }
  }

  protected onWindowAction(action: string) {
    switch (action) {
      case 'close':
        this.api.actions.closeWindow();
        break;
      case 'toggle':
        this.api.actions.toggleWindow();
        break;
      case 'devtools':
        this.api.actions.toggleDevTools();
        break;
    }
  }

}
