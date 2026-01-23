import { Component } from '@angular/core';
import { Titlebar } from "../titlebar/titlebar";
import { Body } from "../body/body";

@Component({
  selector: 'jar-window',
  imports: [Titlebar, Body],
  template: `
    <jar-titlebar><ng-content select="[title]"></ng-content></jar-titlebar>
    <jar-body><ng-content select="[body]"></ng-content></jar-body>
  `,
  styles: ``,
})
export class Window {

}
