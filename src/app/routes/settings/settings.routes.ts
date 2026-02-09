import { Routes } from '@angular/router';
import { Settings } from './settings';
import { General } from './general/general';
import { Upload } from './upload/upload';
import { Display } from './display/display';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: Settings,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: General },
      { path: 'upload', component: Upload },
      { path: 'display', component: Display }
    ]
  }
];
