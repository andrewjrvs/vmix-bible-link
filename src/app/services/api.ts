import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Api as ApiInterface } from '../../electron/api';
@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly document = inject(DOCUMENT);
  public actions: ApiInterface = (this.document.defaultView! as any).api!;
}
