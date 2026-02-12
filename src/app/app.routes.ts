import { Routes } from '@angular/router';
import { Home } from './routes/home/home';
import { Verses } from './routes/verses/verses';
import { Home2 } from './routes/home2/home2';
import { Settings } from './routes/settings/settings';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'h2', component: Home2 },
    { path: 'settings', component: Settings},
    { path: 'verses', component: Verses },
    {
        path: 'settings2',
        loadChildren: () => import('./routes/settings2/settings.routes').then(m => m.settingsRoutes)
    }
];
