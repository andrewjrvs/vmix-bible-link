import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BOOKS } from '../../BOOKS';

@Component({
  selector: 'jar-home',
  imports: [],
  template: `
    <h2>
      home works too!
    </h2>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly books = BOOKS.filter((v, i) => i < 66);
}
