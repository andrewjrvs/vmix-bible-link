import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { Verses } from './routes/verses/verses';
import { Home2 } from './routes/home2/home2';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'h2', component: Home2 },
    { path: 'verses', component: Verses },
    {
        path: 'settings',
        loadChildren: () => import('./routes/settings/settings.routes').then(m => m.settingsRoutes)
    }
];
