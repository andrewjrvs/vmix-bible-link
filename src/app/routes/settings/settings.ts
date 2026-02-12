import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonUpload } from "./json-upload";

@Component({
  selector: 'jar-settings',
  imports: [JsonUpload],
  template: `
    <jar-json-upload></jar-json-upload>
]
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {

}
