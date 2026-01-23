import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Window } from "./framework/window/window";

@Component({
  selector: 'jar-root',
  imports: [RouterOutlet, Window],
  template: `
    <jar-window>
      <span title>{{title()}}</span>
      <div body>
        <router-outlet></router-outlet>
      </div>
    </jar-window>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('vmix-bible-link');
}
