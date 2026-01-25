import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
export class App {
  protected readonly title = signal('VMIX Bible Link');
  protected readonly api = inject(Api);

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
