import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
import { Titlebar } from "../titlebar/titlebar";
import { Body } from "../body/body";
import { Api } from '../../services/api';

interface Bounds { x: number; y: number; width: number; height: number; }

@Component({
  selector: 'jar-window',
  imports: [Titlebar, Body],
  template: `
    <jar-titlebar (close)="actions.emit('close')" (toggle)="actions.emit($event.altKey ? 'devtools' : 'toggle')" ><ng-content select="[title]"></ng-content></jar-titlebar>
    <jar-body><ng-content select="[body]"></ng-content></jar-body>

    <!-- resize handles -->
    <div class="resize-handle left" (mousedown)="startResize('left',$event)"></div>
    <div class="resize-handle right" (mousedown)="startResize('right',$event)"></div>
    <div class="resize-handle bottom" (mousedown)="startResize('bottom',$event)"></div>
    <div class="resize-handle bottom-left" (mousedown)="startResize('bottom-left',$event)"></div>
    <div class="resize-handle bottom-right" (mousedown)="startResize('bottom-right',$event)"></div>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
    }

    .resize-handle {
      position: absolute;
      background: transparent;
      z-index: 9999;
    }
    .resize-handle.left,
    .resize-handle.right {
      top: 0;
      bottom: 0;
      width: 6px;
      cursor: ew-resize;
    }
    .resize-handle.bottom {
      left: 0;
      right: 0;
      height: 6px;
      bottom: 0px;
      cursor: ns-resize;
    }
    .resize-handle.bottom-left  { bottom: 0; left: 0; width: 6px; height: 6px; cursor: nesw-resize; }
    .resize-handle.bottom-right { bottom: 0; right: 0; width: 6px; height: 6px; cursor: nwse-resize; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Window {
  public actions = output<'close' | 'toggle' | 'devtools'>();

  private api = inject(Api);

  private resizing = false;
  private resizeDir: string | null = null;
  private origBounds: Bounds = { x: 0, y: 0, width: 0, height: 0 };
  private origMouse: { x: number; y: number } = { x: 0, y: 0 };

  startResize(direction: string, event: MouseEvent) {
    event.preventDefault();
    this.resizing = true;
    this.resizeDir = direction;
    this.origMouse = { x: event.screenX, y: event.screenY };

    this.api.actions.getWindowBounds().then(b => {
      this.origBounds = b as Bounds;
    });

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.resizing || !this.resizeDir) return;
    const dx = e.screenX - this.origMouse.x;
    const dy = e.screenY - this.origMouse.y;
    const b = { ...this.origBounds };

    switch (this.resizeDir) {
      case 'left':
        b.x += dx;
        b.width -= dx;
        break;
      case 'right':
        b.width += dx;
        break;
      case 'bottom':
        b.height += dy;
        break;
      case 'bottom-left':
        b.x += dx; b.width -= dx;
        b.height += dy;
        break;
      case 'bottom-right':
        b.width += dx;
        b.height += dy;
        break;
    }

    // enforce minimal size
    if (b.width < 100) b.width = 100;
    if (b.height < 100) b.height = 100;

    this.api.actions.setWindowBounds(b);
  };

  private onMouseUp = (_e: MouseEvent) => {
    if (this.resizing) {
      this.resizing = false;
      this.resizeDir = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  };
}
