import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jar-body',
  imports: [],
  template: `
    <main><ng-content></ng-content></main>
  `,
  styles: `
    @use '../../../styles/window';
    :host {
      @include window.body();
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Body {

}
