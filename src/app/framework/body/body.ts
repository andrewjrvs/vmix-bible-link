import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jar-body',
  imports: [],
  template: `
    <nav>
      <ul>
        <li><button type="button"><img src="icons/bookmark.svg" /> <span>Bible</span> </button></li>
        <li><button type="button"><img src="icons/blocks.svg" /> <span>App</span> </button></li>
        <li><button type="button"><img src="icons/edit.svg" /> <span>Edit</span> </button></li>
        <li><button type="button"><img src="icons/blocks_gray.svg" /> <span>App2</span> </button></li>
        <li><button type="button"><img src="icons/search.svg" /> <span>Search</span> </button></li>
      </ul>
    </nav>
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
