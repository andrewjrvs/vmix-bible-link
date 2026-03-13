import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'jar-titlebar',
  imports: [],
  template: `
    <button class="close-button" (click)="close.emit($event)" title="Close">X</button>
    <span><ng-content></ng-content></span>
    <button class="toggle-button" (click)="toggle.emit($event)" title="Toggle Window Size">
        <svg width="16px" height="16px" viewBox="0 0 16 16" stroke-width=".5">
              <defs>
                    <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop class="start-stop" offset="0%"  />
                    <stop class="end-stop" offset="100%"  />
                    </linearGradient>
                </defs>   
            <rect
                fill="url(#grad)"
                    width="12.5"
                    height="12.5"
                    x="3.25"
                    y="3.25"
                    />
                <rect
                    fill="url(#grad)"
                    width="8"
                    height="8"
                    x=".25"
                    y=".25"
                    />
        </svg>
    </button>
  `,
  styles: `
    @use '../../../styles/window';
    :host {
      @include window.titlebar();
    }
    :host-context(.no-transparency) {
      width: 100%;
    }
    .close-button {
        @include window.titlebar-close();
    }
    .toggle-button {
        @include window.titlebar-toggle();
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Titlebar {
  public close = output<{altKey: boolean}>();
  public toggle = output<{altKey: boolean}>();
}
