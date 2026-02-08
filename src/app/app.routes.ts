import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { Verses } from './routes/verses/verses';

export const routes: Routes = [
    {path: '', component: Home },
    {path: 'verses', component: Verses }
];
