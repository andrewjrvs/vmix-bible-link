import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { Titlebar } from "../titlebar/titlebar";
import { Body } from "../body/body";

@Component({
  selector: 'jar-window',
  imports: [Titlebar, Body],
  template: `
    <jar-titlebar (close)="actions.emit('close')" (toggle)="actions.emit($event.altKey ? 'devtools' : 'toggle')" ><ng-content select="[title]"></ng-content></jar-titlebar>
    <jar-body><ng-content select="[body]"></ng-content></jar-body>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Window {
  public actions = output < 'close' | 'toggle' | 'devtools'>();
}
