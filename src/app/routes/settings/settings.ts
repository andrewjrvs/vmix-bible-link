import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonUpload } from "./json-upload";
import { VmixSettingsComponent } from "./vmix-settings";

@Component({
  selector: 'jar-settings',
  imports: [JsonUpload, VmixSettingsComponent],
  template: `
    <jar-json-upload></jar-json-upload>
    <jar-vmix-settings></jar-vmix-settings>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {

}
