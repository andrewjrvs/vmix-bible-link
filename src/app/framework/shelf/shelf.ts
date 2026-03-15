import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BookOverview } from '../../models/overview';
import { Book } from "../book/book";

@Component({
  selector: 'jar-shelf',
  imports: [Book],
  template: `
    @for(book of books(); track book.identifier) {
      <jar-book [book]="book"></jar-book>
    }
  `,
  styles: `
  :host {
    //height: 200px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 15px;
    align-items: flex-start;
    perspective: 800px;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shelf {
  public books = input.required<BookOverview[]>();
}
