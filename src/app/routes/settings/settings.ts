import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonUpload } from "./json-upload";
import { VmixSettingsComponent } from "./vmix-settings";
import { WindowSettingsComponent } from "./window-settings";

@Component({
  selector: 'jar-settings',
  imports: [JsonUpload, VmixSettingsComponent, WindowSettingsComponent],
  template: `
    <jar-json-upload></jar-json-upload>
    <jar-vmix-settings></jar-vmix-settings>
    <jar-window-settings></jar-window-settings>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {

}
