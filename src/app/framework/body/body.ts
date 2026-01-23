import { Component } from '@angular/core';

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
})
export class Body {

}
