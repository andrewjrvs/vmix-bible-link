import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BookOverview } from '../../models/overview';

@Component({
  selector: 'jar-book',
  imports: [],
  template: `
    <span>{{book().identifier}}</span>
  `,
  styles: `
    @use '../../../styles/book';
    :host {
      //margin-bottom: 2px;
      
      @include book.object();

    }
  `,
  host: {
    '[title]': 'book().name',
    'attr.tabindex': '0',
    '[style.--book-c-ovr]': 'book().testament === "Old" ? "#a75a00" : null',
  },
  changeDetection:  ChangeDetectionStrategy.OnPush, 
})
export class Book {
  public book = input.required<BookOverview>();
}
