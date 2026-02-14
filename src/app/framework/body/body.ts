import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jar-body',
  imports: [RouterModule],
  template: `
    <nav>
      <ul>
        <li><button type="button" ><img src="icons/search.svg" /> <span>Search</span> </button></li>
        <li><button type="button" routerLinkActive="selected" [routerLinkActiveOptions]="{exact: true}" routerLink="/"><img src="icons/bookmark.svg" /> <span>Bible</span> </button></li>
        <li><button type="button"  routerLinkActive="selected" routerLink="/verses" [queryParams]="{ book: 'genesis', chapter: '1' }"><img src="icons/blocks.svg" /> <span>App</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/h2"><img src="icons/edit.svg" /> <span>Edit</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/settings2"><img src="icons/blocks_gray.svg" /> <span>App2</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/saved"><img src="icons/bookmark.svg" /> <span>Saved</span> </button></li>
        <li><button type="button" routerLinkActive="selected" routerLink="/settings"><img src="icons/desktop.svg" /> <span>Settings</span> </button></li>
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
