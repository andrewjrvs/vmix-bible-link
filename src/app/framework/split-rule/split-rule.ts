import { Component } from '@angular/core';

@Component({
  selector: 'jar-split-rule',
  imports: [],
  template: ``,
  styles: `
    @use '../../../styles/window';
    :host {
      @include window.split-rule();
    }
  `,
})
export class SplitRule {

}
