import { Component } from '@angular/core';
import { SplitRule } from '../../framework/split-rule/split-rule';

@Component({
  selector: 'jar-home',
  imports: [SplitRule],
  template: `
    <p>test</p>
    <jar-split-rule></jar-split-rule>

    <h2>
      home works!
    </h2>
  `,
  styles: ``,
})
export class Home {

}
