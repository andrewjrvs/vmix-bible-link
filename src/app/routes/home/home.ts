import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SplitRule } from '../../framework/split-rule/split-rule';
import { Shelf } from "../../framework/shelf/shelf";
import { BOOKS } from '../../BOOKS';

@Component({
  selector: 'jar-home',
  imports: [SplitRule, Shelf],
  template: `
    <jar-shelf [books]="books"></jar-shelf>
    <jar-split-rule></jar-split-rule>

    <h2>
      home works!
    </h2>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly books = BOOKS.filter((v, i) => i < 66);
}
