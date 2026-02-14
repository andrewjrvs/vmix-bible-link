import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { Verses } from './routes/verses/verses';
import { Settings } from './routes/settings/settings';
import { Saved } from './routes/saved/saved';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'settings', component: Settings},
    { path: 'verses', component: Verses },
    { path: 'saved', component: Saved },
];
